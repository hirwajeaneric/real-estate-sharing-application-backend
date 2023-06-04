const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: [true, 'description must be provided'] 
    },
    rentPrice: { 
        type: Number, 
        required: [true, 'Rent price must be provided'] 
    },
    propertyType: { 
        type: String, 
        enum: {
            values: ["1 Bedroom Only","1 Bedroom + Living Room","2 Bedrooms + Living Room","3 Bedroom + Living Room","4 Bedroom + Living Room"],
            message: '{VALUE} is not supported as a property type.'
        }
    },
    bedRooms: {
        type: Number, 
        required: true,
    },
    bathRooms: {
        type: Number, 
        required: true,
    },
    furnished: {
        type: Boolean,
        required: true, 
        default: false
    },
    dimensions: {
        type: String, 
        required: false,
    },
    ownerId: { 
        type: String, 
        required: true 
    },
    tenants: [
        {
            id: { 
                type: String, 
                required: false 
            },
            fullName: { 
                type: String, 
                required: false 
            },
        }
    ],
    location: { 
        type: String, 
        required: [true, 'Location must be provided']
    },
    mapCoordinates: { 
        type: String, 
        required: false 
    },
    picturers: [
        { 
            type: String, 
            required: false
        }
    ],
    status: { 
        type: String, 
        required: true,
        enum: {
            values: ["For Rent","Occupied","For Share","For Sale"],
            message: '{VALUE} is not supported as a status.'
        }
    },
    rating: { 
        type: Number, 
        default: 0,
        required: true
    },
    abuseReports: [
        { 
            email: {
                type: String, 
                required: false
            },
            phone: {
                type: String, 
                required: false
            },
            fullName: {
                type: String, 
                required: false
            },
            description: {
                type: String, 
                required: false
            }, 
        }
    ],
    lastUpdated: { 
        type: Date, 
        required: true,
        default: Date.now() 
    }
}) 

module.exports = mongoose.model('Property', propertySchema);