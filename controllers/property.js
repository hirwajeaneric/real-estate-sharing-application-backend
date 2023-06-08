const PropertyModel = require('../models/property');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const sendEmail = require('../utils/email/sendEmail');
const multer= require('multer');

// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './properties') },
    filename: (req, file, callback) => { callback(null, `property-${file.originalname}`) }
})

// Filter files with multer
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback("Not an image! Please upload only images.", false);
    }
  };

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter 
});

// Middleware for attaching files to the request body before saving.
const attachFile = async (req, res, next) => {
    var pics = [];
    const {query, body, files, file} = req;

    // Check if there is an  property or house already
    if (query.id) {
        const  existingProperty = await PropertyModel.findById(query.id);
        
        if ( existingProperty &&  existingProperty.picturers.length !== 0) {
            pics =  existingProperty.picturers;
            if (files.length === 0 && file == 0) {
                
            } else if (files.length !== 0) {
                pics =  existingProperty.picturers;
                files.forEach(file => {
                    pics.push(file.filename); 
                });
            } else if (files.length === 0 && file) {
                pics =  existingProperty.picturers;
                pics.push(file);
            }
        } else if ( existingProperty &&  existingProperty.picturers.length === 0) {
            if (files.length === 0 && file == 0) {
                
            } else if (files.length !== 0) {
                pics =  existingProperty.picturers;
                files.forEach(file => {
                    pics.push(file.filename); 
                });
            } else if (files.length === 0 && file) {
                pics =  existingProperty.picturers;
                pics.push(file);
            }
        } else if (! existingProperty) {
            throw new BadRequestError(`Not found!`);
        }
    } else {
        if (files.length === 0 && file == 0) {
                    
        } else if (files.length !== 0) {
            files.forEach(file => {
                pics.push(file.filename); 
            });       
        } else if (files.length === 0 && file) {
            pics.push(file);
        }
    }

    req.body.picturers = pics;
    next();
}

const add = async (req, res) => {
    const data = req.body;
    const existing = await PropertyModel.findOne({ number: data.number });
    if (existing) {
        throw new BadRequestError(`Property with number: ${data.number} is already registered`)
    }
    const  property = await PropertyModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Successfully added', property })
};

const getAll = async(req, res) => {
    const  properties = await PropertyModel.find({})
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties })
};

const findById = async(req, res) => {
    const  propertyId = req.query.id;
    const  property = await PropertyModel.findById( propertyId);
    if(!property){
        throw new BadRequestError(`Property not found!`)
    }
    res.status(StatusCodes.OK).json({ property })
};

const findByOwnerId = async(req, res) => {
    const ownerId = req.query.ownerId;
    const properties = await PropertyModel.find({ ownerId: ownerId });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};

const findByLocation = async(req, res) => {
    const location = req.query.location;
    let  properties = [];
    const allProperties = await PropertyModel.find({});

    allProperties.forEach(property => {
        if ( property.location === location ||  property.location.includes(location)) {
            properties.push(property);
        }
    })

    res.status(StatusCodes.OK).json({ nbHits: properties.length, properties });
};

const findByMapCoordinates = async(req, res) => {
    const mapCoordinates = req.query.mapCoordinates;
    const properties = await PropertyModel.find({ mapCoordinates: mapCoordinates });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};

const findByStatus = async(req, res) => {
    const status = req.query.status;
    const properties = await PropertyModel.find({ status: status });
    res.status(StatusCodes.OK).json({ nbHits: properties.length, properties });
};

const findByPostId = async(req, res) => {
    const postId = req.query.postId;
    const  properties = await PropertyModel.find({ postId: postId });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};

const edit = async(req, res) => {
    const  property = req.body;
    const  propertyId = req.query.id;
    
    const updated = await PropertyModel.findByIdAndUpdate({ _id:  propertyId }, property);
    const updatedProperty = await PropertyModel.findById(updated._id);

    res.status(StatusCodes.OK).json({ message: 'Updated', property: updatedProperty })
};

const remove = async(req, res) => {
    const propertyId = req.query.id;
    const deletedProperty = await PropertyModel.findByIdAndRemove({ _id: propertyId});

    if (!deletedProperty) {
        throw new NotFoundError(`Property with id ${propertyId} not found!`);
    }

    res.status(StatusCodes.OK).json({ message: 'Deleted'})
};

module.exports = { add, getAll, findById, findByStatus, findByLocation, findByOwnerId, findByMapCoordinates, findByPostId, edit, upload, attachFile, remove }
