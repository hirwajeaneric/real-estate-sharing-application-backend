const emailTemplates = {
    PERMISSION_TO_REPOST_PROPERTY: {
        accepted: {
            ownerEmail: {
                recipient: ``,
                subject: `Contract updated`,
                propertyNumber: ``,
                body: `You successfully updated the contract by providing permission to your tenant to repost the rented property. View more details in the contract.`,
                recipientName: '', 
                recipientId: '', 
                contractId: '',
                tempate: `./template/general.handlebars`
            },
            tenantEmail: {
                recipient: ``,
                subject: `Permission to repost property granted`,
                propertyNumber: ``,
                body: `You request for the permission to repost the rented property has been granted. You can now repost the property you rented to search for other people to join you.`,
                recipientName: '', 
                recipientId: '', 
                contractId: '',
                tempate: `./template/general.handlebars`
            }
        },
        rejected: {
            ownerEmail: {
                recipient: ``,
                subject: `Contract updated`,
                propertyNumber: ``,
                body: `You have rejected the permission to repost the rented property by your tenant.`,
                recipientName: '', 
                recipientId: '', 
                contractId: '',
                tempate: `./template/general.handlebars`
            },
            tenantEmail: {
                recipient: ``,
                subject: `Permission to repost property denied`,
                propertyNumber: ``,
                body: `We are sorry to inform you that your request for the permission to repost the rented property was rejected. This can happen when you did not previously requested for that permission or if your owner does not allow his/her tenants to share the property due to various reasons. \nWe therefore advise you to first communicate with the owner of the property and reach an agreement since this kind of request modifies the contract.`,
                recipientName: '', 
                recipientId: '', 
                contractId: '',
                tempate: `./template/general.handlebars`
            }
        }
    },
    SIGNING_ON_THE_CONTRACT: {
        owner: {
            signed: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }        
            },
            rejected: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }
            },
            withdrew: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }
            }
        },
        tenant: {
            signed: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }        
            },
            rejected: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }
            },
            withdrew: {
                ownerEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                },
                tenantEmail: {
                    recipient: ``,
                    subject: ``,
                    propertyNumber: ``,
                    body: ``,
                    recipientName: '', 
                    recipientId: '', 
                    contractId: '',
                    tempate: ``
                }
            }
        },
    }
}

const setEmailSamples = (templateType, status, ownerOrTenant, recipientEmail, recipientName, recipientId, contractId, propertyNumber) => {
    if (templateType === 'PERMISSION_TO_REPOST_PROPERTY' && status === 'accepted' && ownerOrTenant==='ownerEmail') {
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipient = recipientEmail;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipientName = recipientName;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.recipientId = recipientId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.contractId = contractId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.ownerEmail.propertyNumber = propertyNumber;
    } else if (templateType === 'PERMISSION_TO_REPOST_PROPERTY' && status === 'rejected' && ownerOrTenant==='ownerEmail') {
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipient = recipientEmail;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipientName = recipientName;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.recipientId = recipientId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.contractId = contractId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.ownerEmail.propertyNumber = propertyNumber;
    } else if (templateType === 'PERMISSION_TO_REPOST_PROPERTY' && status === 'accepted' && ownerOrTenant==='tenantEmail') {
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipient = recipientEmail;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipientName = recipientName;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.recipientId = recipientId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.contractId = contractId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.accepted.tenantEmail.propertyNumber = propertyNumber;
    } else if (templateType === 'PERMISSION_TO_REPOST_PROPERTY' && status === 'rejected' && ownerOrTenant==='tenantEmail') {
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipient = recipientEmail;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipientName = recipientName;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.recipientId = recipientId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.contractId = contractId;
        emailTemplates.PERMISSION_TO_REPOST_PROPERTY.rejected.tenantEmail.propertyNumber = propertyNumber;
    }
}


module.exports = {emailTemplates, setEmailSamples};