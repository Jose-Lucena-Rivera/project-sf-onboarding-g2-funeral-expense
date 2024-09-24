import { LightningElement, track } from 'lwc';
import getUsersCases from '@salesforce/apex/CaseController.getUsersCases';

export default class UserCases extends LightningElement {
    @track userCases;
    @track formLabels = {
        caseNumber: 'Case Number',
        caseStatus: 'Status',
        emailNotifications: 'Email Notifications',
        noCasesMessage: 'There are no cases.',
        statusValues: {
            New: 'New',
            'In-Progress': 'In-Progress',
            Closed: 'Closed'
        }
    };

    // Call user's cases from the start.
    connectedCallback() {
        this.loadUserCases();

        // Retrieve language selection from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('language') || localStorage.getItem('selectedLanguage');
        this.updateFormLabels(lang);

        // Add event listener for language changes
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('languagechange', this.handleLanguageChange);
    }

    handleLanguageChange(event) {
        const newLang = event.detail.language;
        this.updateFormLabels(newLang);
    }

    updateFormLabels(language) {
        if (language === 'es') {
            // Set Spanish labels
            this.formLabels = {
                caseNumber: 'Número de Caso',
                caseStatus: 'Estado',
                emailNotifications: 'Notificaciones por Correo Electrónico',
                noCasesMessage: 'No hay casos.',
                statusValues: {
                    New: 'Nuevo',
                    'In-Progress': 'En Progreso',
                    Closed: 'Cerrado'
                }
            };
        } else {
            // Set English labels (default)
            this.formLabels = {
                caseNumber: 'Case Number',
                caseStatus: 'Status',
                emailNotifications: 'Email Notifications',
                noCasesMessage: 'There are no cases.',
                statusValues: {
                    New: 'New',
                    'In-Progress': 'In Progress',
                    Closed: 'Closed'
                }
            };
        }
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

                            // Add the translated status display value
                            translatedStatus: this.getTranslatedStatus(caseItem.Status),

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

    
    // // Helper method to determine the display value for Resolution_Status__c
    // getResolutionStatus(caseItem) {
    //     if (caseItem.Resolution_Status__c === 'Denied') {
    //         return 'Denied';
    //     } else if (caseItem.Resolution_Status__c === 'Approved-Deposit' || caseItem.Resolution_Status__c === 'Approved-Pickup') {
    //         return 'Approved';
    //     } else {
    //         return caseItem.Resolution_Status__c;
    //     }
    // }
    // Helper method to determine the display value for Resolution_Status__c
    getResolutionStatus(caseItem) {
        const language = localStorage.getItem('selectedLanguage') || 'en'; // Default to English if no language is selected
        
        if (caseItem.Resolution_Status__c === 'Denied') {
            return language === 'es' ? 'Denegado' : 'Denied'; // Translate Denied
        } else if (caseItem.Resolution_Status__c === 'Approved-Deposit' || caseItem.Resolution_Status__c === 'Approved-Pickup') {
            return language === 'es' ? 'Aprobado' : 'Approved'; // Translate Approved
        } else {
            return caseItem.Resolution_Status__c; // For other statuses, return as-is
        }
    }

    // Helper method to translate the Status picklist value
    getTranslatedStatus(status) {
        return this.formLabels.statusValues[status] || status;
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