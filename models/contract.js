const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    propertyId: { 
        type: String, 
        required: true 
    },
    propertyNumber: { 
        type: String, 
        required: true 
    },
    ownerId: { 
        type: String, 
        required: true 
    },
    ownerName: { 
        type: String, 
        required: true 
    },
    ownerEmail: { 
        type: String, 
        required: true 
    },
    ownerSignature: { 
        type: String, 
        required: false,
        default: "Pending",
        enum: {
            values: ['Pending', 'Signed', 'Rejected', 'Withdrew'],
            message: '{VALUE} is not supported as a signature.'
        } 
    },
    comment: { 
        type: String, 
        required: false 
    },
    ownerSignedOn: {
        type: Date,
        required: false
    },
    tenants: [
        { 
            tenantId: {
                type: String, 
                required: true
            },
            tenantName: {
                type: String, 
                required: true
            },
            tenantEmail: {
                type: String, 
                required: true
            },
            tenantPhone: {
                type: String, 
                required: true
            },
            allowedToRepost: {
                type: Boolean,
                required: true,
                default: false
            },
            signature: { 
                type: String, 
                required: false,
                default: "Pending",
                enum: {
                    values: ['Pending', 'Signed', 'Rejected', 'Withdrew'],
                    message: '{VALUE} is not supported as a signature.'
                } 
            },
            signedOn: {
                type: Date, 
                required: false
            },
            withdrawalReason: {
                type: String, 
                required: false
            },
            withDrewOn: {
                type: Date, 
                required: false
            },
        }
    ],
    totalPayment: { 
        type: Number, 
        required: true 
    },
    paymentPerTenant: {
        type: Number, 
        required: true
    },
    status: {
        type: String, 
        required: true,
        default: "Pending",
        enum: {
            values: ['Pending', 'Active', 'Stopped'],
            message: '{VALUE} is not supported as a contract status.'
        }
    },
    createdOn: {
        type: Date, 
        required: true,
        default: Date.now()
    },
    startDate: {
        type: Date, 
        required: false
    },
    stopDate: {
        type: Date, 
        required: false
    }
}) 

module.exports = mongoose.model('Contract', contractSchema);