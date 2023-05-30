const RentRequest = require('../models/rentRequest');
const Property = require('../models/estate');
const User = require('../models/User');
const Contract = require('../models/contract');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const SendEmail = require('../utils/email/sendEmail');

const add = async (req, res) => {
    // Creating the rent request
    const rentRequest = await RentRequest.create(req.body);
    
    // Finding the owner of the house
    const house = await Property.findById(req.body.estateId);
    const owner = await User.findById(house.ownerId);    

    // Major email info
    let recipient = owner.email;
    let subject = `New Rent request from ${rentRequest.fullName}`; 
    let emailBody = {
        name: owner.fullName,
        requestSender: rentRequest.fullName,
        userId: owner._id,
        rentRequestId: rentRequest._id
    }  
    let template = "./template/newRentRequest.handlebars";

    // Sending the email to the house owner
    await SendEmail( recipient, subject, emailBody, template );

    res.status(StatusCodes.CREATED).json({ message: 'Created', payload: rentRequest });
};

const getAll = async(req, res) => {
    const rentRequests = await RentRequest.find({})
    res.status(StatusCodes.OK).json({ nbHits: rentRequests.length, rentRequests })
};

const findById = async(req, res) => {
    const rentRequestId = req.query.id;
    const rentRequest = await RentRequest.findById(rentRequestId);
    if (!rentRequest) {
        throw new BadRequestError(`Rent request not found!`);
    }
    res.status(StatusCodes.OK).json({ rentRequest });
};

const findByPropertyId = async(req, res) => {
    const estateId = req.query.estateId;
    const rentRequests = await RentRequest.find({ estateId: estateId });
    if (!rentRequests) {
        throw new BadRequestError(`Rent request not found for this owner.`);
    }
    res.status(StatusCodes.OK).json({ rentRequests });
};

const remove = async(req, res) => {
    const rentRequestId = req.query.id;
    const deletedRentRequest = await RentRequest.findByIdAndRemove({ _id: rentRequestId});

    if (!deletedRentRequest) {
        throw new NotFoundError(`Rent request with id ${rentRequestId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Rent request deleted'})
};

const edit = async(req, res) => {
    var status = req.body.status;

    if (status === 'Accepted' || status === 'Rejected' || req.body.response) {
        req.body.responseDate = Date.now();
        // Updating the request
        var request = await RentRequest.findByIdAndUpdate({ _id: req.query.id}, req.body);
        var updatedRentRequest = await RentRequest.findById(request._id);
    
        // Find estate information
        var estate = await Property.findById(updatedRentRequest.estateId);
        
        let ownerIdentificationNumber = '';
        let tenantIdentificationNumber = '';
        let emailPayload = {};
        let handleBars = "";

        // Find info about estate owner
        var owner = await User.findById(estate.ownerId);
        
        if (owner.nationalId !== "0000000000000000" && owner.passportNumber === "00000000") {
            ownerIdentificationNumber = owner.nationalId;
        } else if (owner.nationalId === "0000000000000000" && owner.passportNumber !== "00000000") {
            ownerIdentificationNumber = owner.passportNumber;
        } else if (owner.nationalId !== "0000000000000000" && owner.passportNumber !== "00000000") {
            ownerIdentificationNumber = owner.nationalId;
        }

        // Info about tenant
        if (updatedRentRequest.nationalId !== "0000000000000000" && updatedRentRequest.passportNumber === "00000000") {
            tenantIdentificationNumber = owner.nationalId;
        } else if (updatedRentRequest.nationalId === "0000000000000000" && updatedRentRequest.passportNumber !== "00000000") {
            tenantIdentificationNumber = owner.passportNumber;
        } else if (updatedRentRequest.nationalId !== "0000000000000000" && updatedRentRequest.passportNumber !== "00000000") {
            tenantIdentificationNumber = owner.nationalId;
        }

        // Setup email according to request status 
        if (status === 'Accepted') {
            // Create a contract
            const contract = await Contract.create({
                estateId: updatedRentRequest.estateId,
                estateNumber: estate.number,
                ownerId: estate.ownerId,
                ownerName: owner.fullName,
                ownerEmail: owner.email,
                tenants: [
                    { 
                        tenantId: updatedRentRequest.requestingUserId,
                        tenantEmail: updatedRentRequest.email,
                        tenantPhone: updatedRentRequest.phone,
                        tenantName: updatedRentRequest.fullName,
                        allowedToRepost: updatedRentRequest.allowedToShare
                    }
                ],
                totalPayment: estate.rentPrice,
                paymentPerTenant: estate.rentPrice,
            });

            emailPayload = {
                houseInfo: {
                    houseNumber: estate.number,
                    houseLocation: estate.location,
                },
                contractId: contract._id
            };
            handleBars = "./template/acceptedRequest.handlebars";

            // Add tenant to the list of other tenants of an estate
            let listOfTenants = estate.tenants;
            listOfTenants.push({ 
                id: updatedRentRequest.requestingUserId, 
                fullName: updatedRentRequest.fullName
            })
            
            await Property.findByIdAndUpdate(estate._id, { tenants : listOfTenants})


        } else {
            emailPayload = {
                houseInfo: {
                    houseNumber: estate.number,
                    houseLocation: estate.location,
                },
                response: updatedRentRequest.response
            };
            handleBars = "./template/rejectedRequest.handlebars";
        }

        // Sending the email to the person who sent a rent request
        await SendEmail(
            updatedRentRequest.email, 
            `Rent request ${updatedRentRequest.status}`,
            {
                payload: emailPayload,
                name: updatedRentRequest.fullName
            },
            handleBars 
        );
    } else {
        const request = await RentRequest.findByIdAndUpdate({ _id: req.query.id}, req.body);
        const updatedRentRequest = await RentRequest.findById(request._id);
    }

    if (!updatedRentRequest) {
        throw new NotFoundError(`Request not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Rent request updated', payload: updatedRentRequest})
};

module.exports = { add, getAll, edit, findByPropertyId, findById, remove }