const mongoose = require('mongoose');

const joinPropertyPostSchema = new mongoose.Schema({
    propertyId: { 
        type: String, 
        required: true 
    },
    ownerId: { 
        type: String, 
        required: true 
    },
    postingTenantId: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: { 
        type: String, 
        required: false 
    },
    gender: { 
        type: String, 
        required: false, 
    },
    expectedGender: { 
        type: String, 
        required: false 
    },
    expectedAge: { 
        type: String, 
        required: false 
    },
    expectedActivities: [{ 
        type: String, 
        required: false
    }],
    comment: { 
        type: String, 
        required: false 
    },
    postDate: { 
        type: Date, 
        required: true,
        default: Date.now() 
    }
}) 

module.exports = mongoose.model('Join_Property_Post', joinPropertyPostSchema);