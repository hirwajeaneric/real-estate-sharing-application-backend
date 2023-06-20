const JoinPost = require('../models/joinPost');
const Contract = require('../models/contract');
const Property = require('../models/property');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

const add = async (req, res) => {
    const newJoinPost = req.body;
    let acceptedToRepost = false;

    const allContracts = await Contract.find({});

    allContracts.forEach(contract => {
        contract.tenants.forEach(tenant => {
            if (tenant.tenantId === newJoinPost.postingTenantId || 
                tenant.tenantName === newJoinPost.fullName || 
                contract.propertyId === newJoinPost.propertyId && 
                tenant.acceptedToRepost) {
                    acceptedToRepost = true;
                    return;
            } else {
                acceptedToRepost = false;
            }
        })
    });

    if (acceptedToRepost) {
        const joinPost = await JoinPost.create(req.body);

        // CHANGE PROPERTY STATUS
        const updatedProperty = await Property.findByIdAndUpdate(joinPost.propertyId, { status: 'For Join' });
        if (updatedProperty) {
            res.status(StatusCodes.CREATED).json({ message: 'Created', payload: joinPost })
        }
    } else {
        throw new BadRequestError(`Failed to post the house since sharing the rent price with other people was not part of the contract. If you want to change the contract terms, please contact your landlord ang ask for the permission to repost the house.`)
    }
};

const getAll = async(req, res) => {
    const joinPosts = await JoinPost.find({})
    res.status(StatusCodes.OK).json({ nbHits: joinPosts.length, joinPosts })
};

const findById = async(req, res) => {
    const joinPostId = req.query.id;
    const joinPost = await JoinPost.findById(joinPostId);
    if (!joinPost) {
        throw new BadRequestError(`Join post not found!`);
    }
    res.status(StatusCodes.OK).json({ joinPost });
};

const findByPropertyId = async(req, res) => {
    const propertyId = req.query.propertyId;
    const joinPosts = await JoinPost.find({ propertyId: propertyId });
    res.status(StatusCodes.OK).json({ joinPosts });
};

const findByExpectedActivities = async(req, res) => {
    const expectedActivity = req.query.expectedActivity;
    const posts = await JoinPost.find({});
    let joinPosts = [];

    posts.forEach(post => {
        post.expectedActivities.forEach(activity => {
            if (activity === expectedActivity) {
                joinPosts.push(post);
            }
        })        
    })

    res.status(StatusCodes.OK).json({ joinPosts });
};

const findByOwnerId = async(req, res) => {
    const ownerId = req.query.ownerId;
    const joinPosts = await JoinPost.find({ ownerId: ownerId });
    res.status(StatusCodes.OK).json({ joinPosts });
};

const findByPostingTenantId = async(req, res) => {
    const postingTenantId = req.query.postingTenantId;
    const joinPosts = await JoinPost.find({postingTenantId: postingTenantId});
    if (!joinPosts) {
        throw new BadRequestError(`No join posts found`);
    }
    res.status(StatusCodes.OK).json({ joinPosts });
};

const edit = async(req, res) => {
    const joinPostId = req.query.id;
    
    const joinPost = await JoinPost.findByIdAndUpdate({ _id: joinPostId}, req.body);
    const updatedJoinPost = await JoinPost.findById(joinPost._id);
    if (!updatedJoinPost) {
        throw new NotFoundError(`JoinPost with id ${joinPostId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Post updated', payload: updatedJoinPost})
};

module.exports = { add, getAll, edit, findByOwnerId, findByExpectedActivities, findByPropertyId, findByPostingTenantId , findByOwnerId, findById }