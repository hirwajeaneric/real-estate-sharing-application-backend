const Contract = require('../models/contract');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const { emailTemplates, setEmailSamples } = require('../utils/email/emailContentSamples');

const add = async (req, res) => {
    const contract = await Contract.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Contract created', contract })
};

const getAll = async(req, res) => {
    const contracts = await Contract.find({})
    res.status(StatusCodes.OK).json({ nbHits: contracts.length, contracts })
};

const findById = async(req, res) => {
    const contractId = req.query.id;
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new BadRequestError(`Contract not found!`);
    }
    res.status(StatusCodes.OK).json({ contract });
};

const findByOwnerId = async(req, res) => {
    const ownerId = req.query.ownerId;
    const contracts = await Contract.find({ ownerId: ownerId });
    if (!contracts) {
        throw new BadRequestError(`Contract not found for this owner.`);
    }
    res.status(StatusCodes.OK).json({ contracts });
};

const findByTenantId = async(req, res) => {
    const tenantId = req.query.tenantId;
    const allContracts = await Contract.find({});
    let contracts = [];

    allContracts.forEach(contract => {
        contract.tenants.forEach(tenant => {
            if (tenant.tenantId === tenantId) {
                contracts.push(contract);
            }
        })
    })

    if (!contracts) {
        throw new BadRequestError(`No contracts found`);
    }
    res.status(StatusCodes.OK).json({ contracts });
};

const findByStatus = async(req, res) => {
    const status = req.query.status;
    const contracts = await Contract.find({status: status});
    if (!contracts) {
        throw new BadRequestError(`Contract not found`);
    }
    res.status(StatusCodes.OK).json({ nbHits: contracts.length, contracts });
};

const remove = async(req, res) => {
    const contractId = req.query.id;
    const deletedContract = await Contract.findByIdAndRemove({ _id: contractId});

    if (!deletedContract) {
        throw new NotFoundError(`Contract with id ${contractId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Contract deleted'})
};

const edit = async(req, res) => {
    const contract = req.body;
    const contractId = req.query.id;
    var updatedContract = {};

    if (req.body.tenants) {
        // Fetch the already existing contract.
        var existingContract = await Contract.findById(req.query.id);
        // Let's check if there is no other tenant in the contract already
        if (!existingContract.tenants || existingContract.tenants.length === 0 ) {
            // Updating the contract if there are no heavy conditions
            const updated = await Contract.findByIdAndUpdate({ _id: contractId}, req.body );
            updatedContract = await Contract.findById(updated._id);
        } else {
            let listOfTenants = existingContract.tenants;

            listOfTenants.forEach(tenant => {
                if (tenant.tenantId === req.body.tenants[0].tenantId || tenant.tenantName === req.body.tenants[0].tenantName) {
                    tenant.tenantId = req.body.tenants[0].tenantId;
                    tenant.tenantName = req.body.tenants[0].tenantName;
                    tenant.tenantEmail = req.body.tenants[0].tenantEmail;
                    tenant.signature = req.body.tenants[0].signature;
                    tenant.signedOn = req.body.tenants[0].signedOn;
                }
            })

            const updated = await Contract.findByIdAndUpdate({ _id: contractId}, existingContract);
            updatedContract = await Contract.findById(updated._id);
        }
        
    } else {
        // Updating the contract if there are no heavy conditions
        const updated = await Contract.findByIdAndUpdate({ _id: contractId}, req.body );
        updatedContract = await Contract.findById(updated._id);
    }

    /**
     * 
     * SENDING EMAILS
    */
    const { PERMISSION_TO_REPOST_PROPERTY, SIGNING_ON_THE_CONTRACT} = emailTemplates;
    
    // PERMISSION TO REPOST
    if (updatedContract.tenants[0].allowedToRepost !== contract.tenants[0].allowedToRepost && contract.tenants[0].allowedToRepost ===true) {
        // Email to the owner
        setEmailSamples("PERMISSION_TO_REPOST_PROPERTY", "accepted", "ownerEmail", updatedContract.ownerEmail, updatedContract.ownerName, updatedContract.ownerId, updatedContract._id, updatedContract.estateNumber);    
        await sendEmail(
            PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipient,
            PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.subject,
            {
                recipientName: PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipientName,
                recipientId: PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipientId, 
                contractId: PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.contractId,
                propertyNumber: PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.propertyNumber,
                body: PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.body
            },
            PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.tempate
        )

        // Email to the tenant
        setEmailSamples("PERMISSION_TO_REPOST_PROPERTY", "accepted", "tenantEmail", updatedContract.tenants[0].tenantEmail, updatedContract.tenants[0].tenantName, updatedContract.tenants[0].tenantId, updatedContract._id, updatedContract.estateNumber);    
        await sendEmail(
            PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipient,
            PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.subject,
            {
                recipientName: PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipientName,
                recipientId: PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipientId, 
                contractId: PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.contractId,
                propertyNumber: PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.propertyNumber,
                body: PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.body
            },
            PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.tempate
        )

    } else if (updatedContract.tenants[0].allowedToRepost !== contract.tenants[0].allowedToRepost && contract.tenants[0].allowedToRepost ===false) {
        // Email to the owner
        setEmailSamples("PERMISSION_TO_REPOST_PROPERTY", "rejected", "ownerEmail", updatedContract.ownerEmail, updatedContract.ownerName, updatedContract.ownerId, updatedContract._id, updatedContract.estateNumber);    
        await sendEmail(
            PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipient,
            PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.subject,
            {
                recipientName: PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipientName,
                recipientId: PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipientId, 
                contractId: PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.contractId,
                propertyNumber: PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.propertyNumber,
                body: PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.body
            },
            PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.tempate
        )

        // Email to the tenant
        setEmailSamples("PERMISSION_TO_REPOST_PROPERTY", "rejected", "tenantEmail", updatedContract.tenants[0].tenantEmail, updatedContract.tenants[0].tenantName, updatedContract.tenants[0].tenantId, updatedContract._id, updatedContract.estateNumber);    
        await sendEmail(
            PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipient,
            PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.subject,
            {
                recipientName: PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipientName,
                recipientId: PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipientId, 
                contractId: PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.contractId,
                propertyNumber: PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.propertyNumber,
                body: PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.body
            },
            PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.tempate
        )
    }

    // SIGNING THE CONTRACT
    // Tenant signing
    if (updatedContract.tenants[0].signature !== contract.tenants[0].signature && contract.tenants[0].signature ==='Signed') {

    } else if (updatedContract.tenants[0].signature !== contract.tenants[0].signature && contract.tenants[0].signature ==='Rejected') {

    } else if (updatedContract.tenants[0].signature !== contract.tenants[0].signature && contract.tenants[0].signature ==='Withdrew') {

    }

    // Owner signing
    if (updatedContract.ownerSignature !== contract.ownerSignature && contract.ownerSignature ==='Signed') {

    } else if (updatedContract.ownerSignature !== contract.ownerSignature && contract.ownerSignature ==='Rejected') {

    } else if (updatedContract.ownerSignature !== contract.ownerSignature && contract.ownerSignature ==='Withdrew') {

    }

    if (!updatedContract) {
        throw new NotFoundError(`Contract with id ${contractId} not found!`);
    }
    res.status(StatusCodes.OK).json({ message: 'Contract updated', payload: updatedContract})
};

module.exports = { add, getAll, edit, findByOwnerId, findByTenantId, findByStatus, findById, remove }