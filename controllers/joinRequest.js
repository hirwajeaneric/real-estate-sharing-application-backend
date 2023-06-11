const JoinRequest = require('../models/joinRequest');
const Property = require('../models/property');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const JoinPost = require('../models/joinPost');
const Contract = require('../models/contract');

const add = async (req, res) => {
    const joinRequest = await JoinRequest.create(req.body);

    // Fetching the join post related to this join request
    const joinPost = await JoinPost.findById(joinRequest.joinPost);

    // Sending email to the person who posted the property.
    let recipient = joinPost.email; 
    let subject = `New join request from ${joinPost.fullName}`; 
    let emailBody = { 
        name: joinPost.fullName, 
        requestSender: joinRequest.fullName, 
        userId: joinPost.postingTenantId, 
        joinRequestId: joinRequest._id 
    };
    let template = './template/newJoinRequest.handlebars';
    
    await sendEmail( recipient, subject, emailBody, template );

    res.status(StatusCodes.CREATED).json({ message: 'Created', joinRequest })
};

const getAll = async(req, res) => {
    const joinRequests = await JoinRequest.find({})
    res.status(StatusCodes.OK).json({ nbHits: joinRequests.length, joinRequests })
};

const findById = async(req, res) => {
    const joinRequestId = req.query.id;
    const joinRequest = await JoinRequest.findById(joinRequestId);
    if (!joinRequest) {
        throw new BadRequestError(`JoinRequest not found!`);
    }
    res.status(StatusCodes.OK).json({ joinRequest });
};

const findByPropertyId = async(req, res) => {
    const propertyId = req.query.propertyId;
    const joinRequests = await JoinRequest.find({ propertyId: propertyId });
    if (!joinRequests) {
        throw new BadRequestError(`JoinRequest not found for this owner.`);
    }
    res.status(StatusCodes.OK).json({ joinRequests });
};

const findByJoinPost = async(req, res) => {
    const joinPost = req.query.joinPost;
    const joinRequests = await JoinRequest.find({ joinPost: joinPost });
    if (!joinRequests) {
        throw new BadRequestError(`JoinRequest not found for this owner.`);
    }
    res.status(StatusCodes.OK).json({ joinRequests });
};

const remove = async(req, res) => {
    const joinRequestId = req.query.id;
    const deletedJoinRequest = await JoinRequest.findByIdAndRemove({ _id: joinRequestId});

    if (!deletedJoinRequest) {
        throw new NotFoundError(`JoinRequest with id ${joinRequestId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'JoinRequest deleted'})
};

const edit = async(req, res) => {
    const joinRequestId = req.query.id;
    // Join request before updating
    const joinRequestBefore = await JoinRequest.findById(req.query.id);

    const request = await JoinRequest.findByIdAndUpdate({ _id: joinRequestId}, req.body);
    const updatedJoinRequest = await JoinRequest.findById(request._id);

    if (!updatedJoinRequest) {
        throw new NotFoundError(`Join request not found!`);
    }

    // UPDATING THE CONTRACT
    if (joinRequestBefore.status === 'Pending' || joinRequestBefore.status === 'Rejected' && updatedJoinRequest.status === 'Accepted' ) {
        // Fetching the contract that corresponds to this specific property, owner, and posting tenant.
        const property = await Property.findById(updatedJoinRequest.propertyId);
        const allContracts = await Contract.find({});
        
        var existingContract = {};
        allContracts.forEach(contract => {
            if (contract.ownerId === property.ownerId) existingContract = contract
        });

        if ( property.ownerId === existingContract.ownerId  && property._id.toString() === existingContract.propertyId  && property.number === existingContract.propertyNumber && existingContract.status === 'Pending' && updatedJoinRequest.status === 'Accepted') {
            existingTenantList = existingContract.tenants;

            // Checking if the following tenant isn't already in the contract.
            existingTenantList.forEach(tenant => {
                if (tenant.tenantId !== updatedJoinRequest.requestingUserId && tenant.tenantEmail !== updatedJoinRequest.email) {
                    existingTenantList.push({
                        tenantId: updatedJoinRequest.requestingUserId,
                        tenantName: updatedJoinRequest.fullName,
                        tenantEmail: updatedJoinRequest.email,
                        tenantPhone: updatedJoinRequest.phone,
                    });
                    existingContract.tenants = existingTenantList;                    
                }
            });

            const updated = await Contract.findByIdAndUpdate(existingContract._id, existingContract);
            const updatedContract = await Contract.findById(updated._id);

            /**
             * 
             * EMAIL SYSTEM ... This email informs the requesting tenant that their request was accepted.
             */

            // Email parameters
            let recipient = updatedJoinRequest.email;
            let subject = "Join request accepted";
            let emailBody = {
                recipientName: updatedJoinRequest.fullName,
                recipientId: updatedJoinRequest.requestingUserId,
                contractId: updatedContract._id,
                body: `Your request to join and rent property number ${property.number} was accepted. \nClick on the link bellow to see more details and sign the contract.`
            }
            let template = "./template/general.handlebars";
            // Send email
            await sendEmail( recipient, subject, emailBody, template );
        }
    } else if (joinRequestBefore.status === 'Pending' || joinRequestBefore.status === 'Accepted' && updatedJoinRequest.status === 'Rejected') {
        // Email parameters
        let recipient = updatedJoinRequest.email;
        let subject = "Join request rejected";
        let emailBody = {
            recipientName: updatedJoinRequest.fullName,
            body: `We are sorry to inform you that your request to join and rent property number ${property.number} was rejected. Visit the link bellow to view more available properties for rent.`
        }
        let template = "./template/rejectedJoinRequest.handlebars";
        // Send email
        await sendEmail( recipient, subject, emailBody, template );
    }

    res.status(StatusCodes.OK).json({ message: 'Join request updated', payload: updatedJoinRequest})
};

module.exports = { add, getAll, edit, findByPropertyId, findByJoinPost, findById, remove }