import { LightningElement, track } from 'lwc';
import getDependentBranchNames from '@salesforce/apex/CaseController.getDependentBranchNames';
import createAdvanceFundCase from '@salesforce/apex/CaseController.createAdvanceFundCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCurrentUserAndAccount from '@salesforce/apex/CaseController.getCurrentUserAndAccount';
import getBranchTowns from '@salesforce/apex/CaseController.getBranchTowns';
import linkFilesToCaseApex from '@salesforce/apex/CaseController.linkFilesToCaseApex';



export default class CustomerForm extends LightningElement {
    // Track which screen is currently visible
    isScreen1 = true;
    isScreen2 = false;
    isScreen3 = false;
    isScreen4 = false;

    //Track inputs of form Data
    @track formData = {
        firstNameDeceased: '',
        lastNameDeceased: '',
        funeralHomeName: '',
        disbursementPreference: '',
        dateOfDeath: '',
        claimedAmount: '',
        otherPhone: '',
        relationship: '',
        ssn: '',
        funeralHomeNumber: '',
        branch: '',
        branchTown: '',
        //User Auto populated fields
        firstname:'',
        lastname:'',
        email:'',
        preferredPhone: '',
        accountId: '',
        accountName: '' // To store associated account name
    };

    // Dropdown #1: options for first screen
    firstDropdownOptions = [
        { label: 'Advance funds for unpaid funeral Expenses', value: 'option1' },
        { label: 'General advance of available funds', value: 'option2' },
        { label: 'Liquidation funds', value: 'option3' }
    ];
    // Dropdown #2: options for second screen
    secondDropdownOptions = [
        { label: 'Yes', value: 'optionA' },
        { label: 'No', value: 'optionB' }
    ];
    // Dropdown #3: options for third screen, disbursement type
    thirdDropdownOptions = [
        { label: 'Account Deposit', value: 'Account Deposit' },
        { label: 'Pick-up at branch', value: 'Pick-up at branch' }
    ];

    // Contains selected values for each of the Dropdowns
    @track selectedFirstOption;
    @track selectedSecondOption;
    ///Picklist logic
    @track parentPicklistValues = [];
    @track childPicklistValues = [];
    @track selectedParentValue = '';
    @track selectedChildValue = '';
    @track uploadedFileIds = [];
    dependentValuesMap = {}; // To store the map returned from Apex


    // Handle dropdown selections for Dropdown #1
    handleFirstDropdownChange(event) {
        this.selectedFirstOption = event.detail.value;
    }
    // Handle dropdown selections for Dropdown #2
    handleSecondDropdownChange(event) {
        this.selectedSecondOption = event.detail.value;
    }
    // Handle dropdown selections for Dropdown #3
    handleThirdDropdownChange(event) {
        this.formData.disbursementPreference = event.detail.value;
    }
    
    handleParentChange(event) {
        // Set the selected parent value
        this.selectedParentValue = event.detail.value;
        console.log(`Selected Parent Value: ${this.selectedParentValue}`);

        // Fetch branches based on the selected parent value
        this.fetchChildPicklistValues(this.selectedParentValue);
        this.formData.branchTown = event.detail.value;  
    }

    handleChildChange(event) {
        // Set the selected child value
        this.selectedChildValue = event.detail.value;
        console.log(`Selected Child Value: ${this.selectedChildValue}`);

        this.formData.branch = event.detail.value;
    }

    connectedCallback() {
        // Fetch initial picklist values on load
        this.fetchParentPicklistValues();
        // Fetch current user information
        this.fetchCurrentUserInfo();
    }

    get showNextButton() {
        // For screen 1: only show the next button if Option 1 is selected
        if (this.isScreen1 && this.selectedFirstOption === 'option1') {
            return true;
        }
        // For screen 2: show the next button only if Option 'No' is selected
        if (this.isScreen2 && this.selectedSecondOption === 'optionB') {
            return true;
        }
        
        return false;
    }

    // Navigation: Move to the next screen
    handleNext() {
        if (this.isScreen1 && this.selectedFirstOption === 'option1') {
            this.isScreen1 = false;
            this.isScreen2 = true;
        } else if (this.isScreen2) {
            this.isScreen2 = false;
            this.isScreen3 = true;
        } else if (this.isScreen3) {
            this.isScreen3 = false;
            this.isScreen4 = true;
        }
    }

    // Navigation: Move to the previous screen
    handlePrevious() {
        if (this.isScreen4) {
            this.isScreen4 = false;
            this.isScreen3 = true;
        } else if (this.isScreen3) {
            this.isScreen3 = false;
            this.isScreen2 = true;
        } else if (this.isScreen2) {
            this.isScreen2 = false;
            this.isScreen1 = true;
        }
    }


    get isOption2or3() {
        return this.selectedFirstOption == 'option2' || this.selectedFirstOption == 'option3';
    }

    get isOptionYes() {
        return this.selectedSecondOption == 'optionA';
    }

    get isOptionDeposit() {
        return this.formData.disbursementPreference == 'Account Deposit';
    }

    get isOptionBranch() {
        return this.formData.disbursementPreference == 'Pick-up at branch';
    }

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpeg'];
    }

    // handleUploadFinished(event) {
    //     const uploadedFiles = event.detail.files;
    //     if (uploadedFiles.length > 0) {
    //         // Store the document IDs of the uploaded files for later use
    //         this.uploadedFileIds = uploadedFiles.map(file => file.documentId);
            
    //         console.log('Stored File IDs:', this.uploadedFileIds);  // Logging the file IDs for debugging purposes
    //         alert('No. of files uploaded: ' + uploadedFiles.length);
    //     } else {
    //         console.log('No files were uploaded');
    //     }
    // }
   
    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
    
        // Append the new uploaded files to the existing list of file IDs
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                this.uploadedFileIds.push(file.documentId);  // Add each new file ID to the array
            });
            
            console.log('All stored file IDs:', this.uploadedFileIds);  // Logging for debugging purposes
            alert('No. of files uploaded: ' + uploadedFiles.length);
        } else {
            console.log('No files were uploaded');
        }
    }

    handleCaseSubmit() {
        // Iterate over formData using a for...in loop
        // for (let key in this.formData) {
        //     if (this.formData.hasOwnProperty(key)) {
        //         console.log(`Field: ${key}, Value: ${this.formData[key]}`);
        //     }
        // }

        createAdvanceFundCase({
            firstNameDeceased: this.formData.firstNameDeceased,
            lastNameDeceased: this.formData.lastNameDeceased,
            funeralHomeName: this.formData.funeralHomeName,
            disbursementPreference: this.formData.disbursementPreference,
            dateOfDeath: this.formData.dateOfDeath,
            claimedAmount: this.formData.claimedAmount,
            preferredPhone: this.formData.preferredPhone,
            otherPhone: this.formData.otherPhone,
            relationship: this.formData.relationship,
            ssn: this.formData.ssn,
            funeralHomeNumber: this.formData.funeralHomeNumber,
            firstname: this.formData.firstname,
            lastname: this.formData.lastname,
            email: this.formData.email,
            accountId: this.formData.accountId, // Pass the associated account ID when creating the case
            branchTown: this.formData.branchTown,
            branch: this.formData.branch
        })
            
        
        .then(result => {
            console.log(result);
            result = JSON.parse(JSON.stringify(result));
            console.log(result);

            // Now link the uploaded files to the newly created case
            if (this.uploadedFileIds.length > 0) {
                this.linkFilesToCase(result.Id);
            }
            // If true, create a Success Toast Notification,
            // Else create an Error Toast Notification.
            if (result.CaseNumber != undefined) {
                this.handleSuccessToast(result.CaseNumber);
            } else {
                this.handleErrorToast();
            }
           // window.location.href = "/s/my-cases";


        })
        .catch(error => {
            // Log the error and show an error toast
            console.error('Error creating case:', error);
            console.error('Error creating case:', JSON.stringify(error)); // Convert error object to string for detailed logging

            // Check for different types of error properties
            if (error.body) {
                console.error('Error body:', error.body.message);  // Apex error message
            } else if (error.message) {
                console.error('Error message:', error.message);  // General error message
            } else {
                console.error('Unknown error:', error);  // Fallback for unknown errors
            }
            this.handleErrorToast();
        });
    
    }  
    //Success Toast Notification
    handleSuccessToast(result) {
        const evt = new ShowToastEvent({
            title: `The case has been created successfully. Case Number: ${result}`,
            message: `Today you will receive an email confirming we got your request with your ticket number.
            We will send the email to the one you input in the form.
            Your request should be processed between 24-48 hours. We will send you an email indicating if your request
            was approved or denied.`,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
    //Error creating case toast notification
    handleErrorToast() {
        const evt = new ShowToastEvent({
            title: 'We couldn\'t register your request',
            message: 'Something Happened! Your request was not able to be registered at this time, please try again in a few moments. Excuse the inconvenience and thank you for understanding.',
            variant: 'error',
        });
        this.dispatchEvent(evt);
    }
        


    fetchParentPicklistValues() {
        getBranchTowns()
            .then((result) => {
                // Populate parent picklist values with the result
                this.parentPicklistValues = result.map((town) => ({
                    label: town,
                    value: town
                }));
                console.log('Parent Picklist Values:', this.parentPicklistValues);
            })
            .catch((error) => {
                console.error('Error fetching parent picklist values:', error);
            });
    }

    fetchChildPicklistValues(controllingFieldValue) {
        getDependentBranchNames({ controllingFieldValue })
            .then((result) => {
                // Populate child picklist values with the result
                this.childPicklistValues = result.map((branch) => ({
                    label: branch,
                    value: branch
                }));
                console.log('Child Picklist Values:', this.childPicklistValues);
            })
            .catch((error) => {
                console.error('Error fetching child picklist values:', error);
            });
    }
    fetchCurrentUserInfo() {
        getCurrentUserAndAccount()
            .then(result => {
                // Populate formData with current user information
                const user = result.user;
                const account = result.account;

                this.formData.firstname = user.FirstName;
                this.formData.lastname = user.LastName;
                this.formData.email = user.Email;
                this.formData.preferredPhone = user.Phone;

                // If the account exists, populate account-related fields
                if (account) {
                    this.formData.accountId = account.Id;
                    this.formData.accountName = account.Name;
                }
            })
            .catch(error => {
                console.error('Error fetching user and account information:', error);
            });
    }

    // linkFilesToCase(caseId) {
    //     // Call Apex method to link the files to the case
    //     linkFilesToCaseApex({ caseId: caseId, fileIds: this.uploadedFileIds })
    //         .then(() => {
    //             console.log('Files successfully linked to the case');
    //             // Optionally show a toast or handle successful linking
    //             const evt = new ShowToastEvent({
    //                 title: 'Success',
    //                 message: 'Files were successfully attached to the case',
    //                 variant: 'success',
    //             });
    //             this.dispatchEvent(evt);
    //         })
    //         .catch(error => {
    //             console.error('Error linking files to case:', error);
    //             // Optionally show a toast or handle error
    //             const evt = new ShowToastEvent({
    //                 title: 'Error',
    //                 message: 'Failed to attach files to the case. Please try again.',
    //                 variant: 'error',
    //             });
    //             this.dispatchEvent(evt);
    //         });
    // }
    linkFilesToCase(caseId) {
        if (this.uploadedFileIds.length > 0) {
            // Call Apex method to link the files to the case
            linkFilesToCaseApex({ caseId: caseId, fileIds: this.uploadedFileIds })
                .then(() => {
                    console.log('Files successfully linked to the case');
                    // Optionally show a toast or handle successful linking
                    // const evt = new ShowToastEvent({
                    //     title: 'Success',
                    //     message: 'Files were successfully attached to the case',
                    //     variant: 'success',
                    // });
                    // this.dispatchEvent(evt);
                })
                .catch(error => {
                    console.error('Error linking files to case:', error);
                    // Optionally show a toast or handle error
                    // const evt = new ShowToastEvent({
                    //     title: 'Error',
                    //     message: 'Failed to attach files to the case. Please try again.',
                    //     variant: 'error',
                    // });
                    // this.dispatchEvent(evt);
                });
        } else {
            console.log('No files to link to the case');
        }
    }
    
    

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.formData[field] = event.target.value;
    }
}