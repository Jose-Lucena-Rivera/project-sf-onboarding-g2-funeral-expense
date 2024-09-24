import { LightningElement, track } from 'lwc';
import getUsersCases from '@salesforce/apex/CaseController.getUsersCases';

export default class UserCases extends LightningElement {
    @track userCases;

    // Call user's cases from the start.
    connectedCallback() {
        this.loadUserCases();
    }

    // Load user's cases
    loadUserCases() {
        getUsersCases()
            .then(result => {
                // Check if the result is an array and process cases
                if (result && Array.isArray(result)) {
                    this.userCases = result.map(caseItem => {
                        return {
                            ...caseItem,
                            // Check if EmailMessages exist before mapping
                            EmailMessages: caseItem.EmailMessages
                                ? caseItem.EmailMessages.map(email => ({
                                    ...email,
                                    showBody: false // Initially hide the body of each email
                                }))
                                : [], // If no EmailMessages, return empty array
                            // Add the resolution status display value
                            resolutionDisplay: this.getResolutionStatus(caseItem),
                            // Add the resolution status class
                            resolutionClass: this.getResolutionStatusClass(caseItem),
                            resolutionClassString: `resolution-status ${this.getResolutionStatusClass(caseItem)}`
                        };
                    });
                } else {
                    this.userCases = []; // If result is not an array, set to empty array
                }
            })
            .catch(error => {
                console.error(error);
                this.userCases = undefined;
            });
    }

    // Helper method to determine the display value for Resolution_Status__c
    getResolutionStatus(caseItem) {
        if (caseItem.Resolution_Status__c === 'Denied') {
            return 'Denied';
        } else if (caseItem.Resolution_Status__c === 'Approved-Deposit' || caseItem.Resolution_Status__c === 'Approved-Pickup') {
            return 'Approved';
        } else {
            return caseItem.Resolution_Status__c;
        }
    }

    // Helper method to determine the class for Resolution_Status__c
    getResolutionStatusClass(caseItem) {
        if (caseItem.Resolution_Status__c === 'Denied') {
            return 'resolution-denied';
        } else if (caseItem.Resolution_Status__c === 'Approved-Deposit' || caseItem.Resolution_Status__c === 'Approved-Pickup') {
            return 'resolution-approved';
        } else {
            return 'resolution-default';
        }
    }
    getResolutionStatusClassString(caseItem) {
        return `resolution-status ${this.getResolutionStatusClass(caseItem)}`;
    }

    // Method to toggle the visibility of email body
    toggleEmailBody(event) {
        const caseId = event.target.dataset.caseId;
        const emailId = event.target.dataset.emailId;

        // Find the case and the specific email by Id
        this.userCases = this.userCases.map(caseItem => {
            if (caseItem.Id === caseId) {
                caseItem.EmailMessages = caseItem.EmailMessages.map(email => {
                    if (email.Id === emailId) {
                        // Toggle the showBody flag
                        email.showBody = !email.showBody;
                    }
                    return email;
                });
            }
            return caseItem;
        });
    }

    get thereAreCases() {
        return this.userCases && this.userCases.length > 0;
    }
}