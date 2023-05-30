const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    number: { 
        type: String, 
        required: [true, 'number must be provided'] 
    },
    description: { 
        type: String, 
        required: [true, 'description must be provided'] 
    },
    rentPrice: { 
        type: Number, 
        required: [true, 'Rent price must be provided'] 
    },
    estateType: { 
        type: String, 
        required: true 
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
            values: ["For rent","Occupied","To be shared"],
            message: '{VALUE} is not supported as a status.'
        }
    },
    rating: { 
        type: Number, 
        required: false 
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