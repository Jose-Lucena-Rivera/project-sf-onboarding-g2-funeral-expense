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

    // General error message
    @track errorMessage = '';
    @track showError = false;

    //Track inputs of form Data
    @track formData = {
        firstNameDeceased: undefined,
        lastNameDeceased: undefined,
        funeralHomeName: undefined,
        disbursementPreference: undefined,
        dateOfDeath: undefined,
        claimedAmount: undefined,
        otherPhone: undefined,
        relationship: undefined,
        ssn: undefined,
        funeralHomeNumber: undefined,
        branch: undefined,
        branchTown: undefined,
        //User Auto populated fields
        firstname:'',
        lastname:'',
        email:'',
        preferredPhone: '',
        accountId: '',
        accountName: '' // To store associated account name
    };

// Define formLabels to store the dynamic labels for changing language
    @track formLabels = {
        // Labels for deceased customer information
        firstNameLabel: 'First Name',
        lastNameLabel: 'Last Name',
        socialSecurityLabel: 'Social Security Number',
        dateOfDeathLabel: 'Date of Death',
        uploadDeathCertLabel: 'Upload Death Certificate (PDF)',

        // Labels for requestor information
        requestorFirstNameLabel: 'Requestor First Name',
        requestorLastNameLabel: 'Requestor Last Name',
        relationshipLabel: 'Relationship',
        emailLabel: 'Email',
        preferredPhoneLabel: 'Preferred Phone Number',
        otherPhoneLabel: 'Other Phone Number',
        uploadRequestorIDLabel: 'Upload copy of requestor ID',

        // Labels for disbursement information
        funeralHomeNameLabel: 'Funeral Home Name',
        claimedAmountLabel: 'Claimed Amount',
        disbursementPreferenceLabel: 'Disbursement Preference',
        funeralHomeAccountLabel: 'Funeral Home Account Number',
        branchTownLabel: 'Choose a Branch Town',
        branchLabel: 'Choose a Branch',
        uploadFuneralInvoiceLabel: 'Funeral Home Invoice',

       // Other labels
       legalNotificationLabel: 'I have read and accepted the legal notification above',
       submitButtonLabel: 'Submit',
       nextButtonLabel: 'Next',
       previousButtonLabel: 'Previous',

       // Text content (paragraphs, etc.)
       requestSupportText: 'We are here to support you during this difficult time.',
       requirementsText: 'Requirements to request processing:',
       deathCertificateText: 'Death Certificate (original or copy)',
       funeralHomeBillText: 'Funeral home bill',
       bankIssuanceText: 'The Bank will issue an official check payable to the funeral home for the amount billed up to the maximum permitted by law ($15,000) of the funds deposited with Popular.',
       invoicePaidText: 'Is the funeral home invoice paid?',
       unpaidInvoiceInfo: 'To request an advance for funeral expenses the invoice must be unpaid. You can request a general advance, for more information on how to request this visit:',
       visitLinkMessage: 'Please visit',
       finalStepText: 'Screen 4: Final step or confirmation.',
       supportMessage: 'We are here to support you during this difficult time.',
       requestMessage: 'What is your request?',
       requestTypeLabel: 'What is your request?',
       fileUploadedText: 'File uploaded successfully',

    firstDropdownOptions: [
        { label: 'Advance funds for unpaid funeral Expenses', value: 'option1' },
        { label: 'General advance of available funds', value: 'option2' },
        { label: 'Liquidation funds', value: 'option3' }
    ],
    secondDropdownOptions: [
        { label: 'Yes', value: 'optionA' },
        { label: 'No', value: 'optionB' }
    ],
    thirdDropdownOptions: [
        { label: 'Account Deposit', value: 'Account Deposit' },
        { label: 'Pick-up at branch', value: 'Pick-up at branch' }
    ],

     // New placeholders and combobox labels:
     disbursementPreferenceLabel: 'Disbursement Preference',  // For the combobox label
     disbursementPreferencePlaceholder: 'Select Disbursement preference',  // Placeholder for combobox
     
     selectAnswerLabel: 'Select Answer',  // For the combobox label
     selectAnswerPlaceholder: 'Select Yes/No',  // Placeholder for the "Yes/No" combobox
     
     branchTownPlaceholder: 'Select Branch Town',  // Placeholder for Branch Town combobox
     branchPlaceholder: 'Select Branch',  // Placeholder for Branch combobox

     initialDropdownLabel: 'What is your request?',
     initialDropdownPlaceholder: 'Select request type',


     // Labels for validation messages (add these to your existing formLabels)
    firstNameError: 'First Name cannot be longer than 20 characters.',
    lastNameError: 'Last Name cannot be longer than 20 characters.',
    ssnError: 'Social Security Number must be in one of the following formats: ######### or ###-##-####.',
    phoneError: 'Other Phone Number must be in one of the following formats: ########## or ###-###-####.',
    claimedAmountError: 'Claimed amount cannot be greater than $15,000.',
    submitError: 'All fields must be completed.',

    // Spanish translations for the error messages
    firstNameError_es: 'El nombre no puede tener más de 20 caracteres.',
    lastNameError_es: 'El apellido no puede tener más de 20 caracteres.',
    ssnError_es: 'El número de seguro social debe estar en uno de los siguientes formatos: ######### o ###-##-####.',
    phoneError_es: 'El número de teléfono debe estar en uno de los siguientes formatos: ########## o ###-###-####.',
    claimedAmountError_es: 'El monto reclamado no puede ser mayor de $15,000.',
    submitError_es: 'Todos los campos deben completarse.',



     // Toast messages
     successToastTitle: 'The case has been created successfully',
     successToastMessage: 'Today you will receive an email confirming we got your request with your ticket number. Your request should be processed between 24-48 hours. We will send you an email indicating if your request was approved or denied.',
     errorToastTitle: 'We couldn\'t register your request',
     errorToastMessage: 'Something happened! Your request was not able to be registered at this time. Please try again in a few moments. Excuse the inconvenience and thank you for understanding.',
 
     // Spanish translations
     successToastTitle_es: 'El caso ha sido creado con éxito',
     successToastMessage_es: 'Hoy recibirá un correo electrónico confirmando que hemos recibido su solicitud con su número de ticket. Su solicitud debe ser procesada entre 24-48 horas. Le enviaremos un correo electrónico indicando si su solicitud fue aprobada o rechazada.',
     errorToastTitle_es: 'No pudimos registrar su solicitud',
     errorToastMessage_es: '¡Algo sucedió! Su solicitud no pudo ser registrada en este momento. Por favor, inténtelo de nuevo en unos momentos. Disculpe las molestias y gracias por su comprensión.'
    };

    // // Dropdown #1: options for first screen
    // firstDropdownOptions = [
    //     { label: 'Advance funds for unpaid funeral Expenses', value: 'option1' },
    //     { label: 'General advance of available funds', value: 'option2' },
    //     { label: 'Liquidation funds', value: 'option3' }
    // ];
    // // Dropdown #2: options for second screen
    // secondDropdownOptions = [
    //     { label: 'Yes', value: 'optionA' },
    //     { label: 'No', value: 'optionB' }
    // ];
    // // Dropdown #3: options for third screen, disbursement type
    // thirdDropdownOptions = [
    //     { label: 'Account Deposit', value: 'Account Deposit' },
    //     { label: 'Pick-up at branch', value: 'Pick-up at branch' }
    // ];

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

    @track deathCertificateFileName;
    @track requestorIdFileName;
    @track funeralHomeInvoiceFileName;

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

    handleLanguageChange(event) {
        const newLang = event.detail.language;
        this.updateFormLabels(newLang);
    
        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', newLang);
    }
       

    connectedCallback() {
        // Fetch initial picklist values on load
        this.fetchParentPicklistValues();
        // Fetch current user information
        this.fetchCurrentUserInfo();
    
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('language');
        const langFromStorage = localStorage.getItem('selectedLanguage');

        // Default to 'en_US' if no language is found
        let initialLanguage = langFromUrl || langFromStorage || 'en_US';
        this.updateFormLabels(initialLanguage);

        // Add event listener for language changes
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed
        window.removeEventListener('languagechange', this.handleLanguageChange.bind(this));
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

    get isDeathCertificateUploaded() {
        return this.deathCertificateFileName != undefined;
    }

    get isRequestorIdUploaded() {
        return this.requestorIdFileName != undefined;
    }

    get isFuneralHomeInvoiceUploaded() {
        return this.funeralHomeInvoiceFileName != undefined;
    }

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpeg'];
    }
   
    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
    
        // Append the new uploaded files to the existing list of file IDs
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                this.uploadedFileIds.push(file.documentId);  // Add each new file ID to the array

                this[event.target.dataset.id] = file.name;
            });
            
            console.log('All stored file IDs:', this.uploadedFileIds);  // Logging for debugging purposes
            alert('No. of files uploaded: ' + uploadedFiles.length);

        } else {
            console.log('No files were uploaded');
        }
    }

    handleCaseSubmit() {
        // Clear any previous errors
        this.showError = false;
        this.errorMessage = '';

         // Get the language preference from localStorage
         const selectedLanguage = localStorage.getItem('selectedLanguage');

        // Use either English or Spanish based on the selected language
        const errorMessages = {
            firstNameError: selectedLanguage === 'es' ? this.formLabels.firstNameError_es : this.formLabels.firstNameError,
            lastNameError: selectedLanguage === 'es' ? this.formLabels.lastNameError_es : this.formLabels.lastNameError,
            ssnError: selectedLanguage === 'es' ? this.formLabels.ssnError_es : this.formLabels.ssnError,
            phoneError: selectedLanguage === 'es' ? this.formLabels.phoneError_es : this.formLabels.phoneError,
            claimedAmountError: selectedLanguage === 'es' ? this.formLabels.claimedAmountError_es : this.formLabels.claimedAmountError,
            submitError: selectedLanguage === 'es' ? this.formLabels.submitError_es : this.formLabels.submitError
        };

        // Validate that all required fields are filled
        if (!this.formData.firstNameDeceased || !this.formData.lastNameDeceased || !this.formData.funeralHomeName || 
            !this.formData.disbursementPreference || !this.formData.dateOfDeath || !this.formData.claimedAmount ||
            !this.formData.otherPhone || !this.formData.relationship || !this.formData.ssn || 
            !(this.formData.funeralHomeNumber || (this.formData.branchTown && this.formData.branch)) ||
            !this.deathCertificateFileName || !this.requestorIdFileName || !this.funeralHomeInvoiceFileName) {
            
            this.showError = true;
            this.errorMessage = errorMessages.submitError;
            return;
        }

        // Validate First Name and Last Name (Max 20 characters)
        if (this.formData.firstNameDeceased.length > 20) {
            this.showError = true;
            this.errorMessage = errorMessages.firstNameError;
            return;
        }
        if (this.formData.lastNameDeceased.length > 20) {
            this.showError = true;
            this.errorMessage = errorMessages.lastNameError;
            return;
        }

        // Validate Social Security Number (SSN) pattern
        const ssnWithoutDashes = /^\d{9}$/;
        const ssnWithDashes = /^\d{3}-\d{2}-\d{4}$/;

        if (!ssnWithoutDashes.test(this.formData.ssn) && !ssnWithDashes.test(this.formData.ssn)) {
            this.showError = true;
            this.errorMessage = errorMessages.ssnError;
            return;
        }

        // Validate Other Phone Number (Must be 10 digits or in ###-###-#### format)
        const phonePatternWithoutDashes = /^\d{10}$/;
        const phonePatternWithDashes = /^\d{3}-\d{3}-\d{4}$/;

        if (!phonePatternWithoutDashes.test(this.formData.otherPhone) && !phonePatternWithDashes.test(this.formData.otherPhone)) {
            this.showError = true;
            this.errorMessage = errorMessages.phoneError;
            return;
        }

        // Validate Claimed Amount
        if (this.formData.claimedAmount > 15000) {
            this.showError = true;
            this.errorMessage = errorMessages.claimedAmountError;
            return;
        }

        
        
        // Update formData with language preference
        this.formData.languagePreference = selectedLanguage === 'es' ? 'ES' : 'EN';

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
            branch: this.formData.branch,
            languagePreference: this.formData.languagePreference
        })
        .then(result => {
            // If true, create a Success Toast Notification,
            // Else create an Error Toast Notification.
            if (result.CaseNumber) {
                // Case created successfully, now link the files
                this.linkFilesToCase(result.Id)
                    .then(() => {
                        this.handleSuccessToast(result.CaseNumber);
        
                        // Delay the navigation to the next page by 4 seconds (4000 milliseconds)
                        setTimeout(() => {
                            window.location.href = "/s/my-cases";
                        }, 4000);  // 4000 milliseconds = 4 seconds
        
                    })
                    .catch(error => {
                        console.error('Error linking files to case:', error);
                        this.handleErrorToast('Case created, but files failed to attach.');
                    });
            } else {
                this.handleErrorToast('Error creating case.');
            }
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

    handleSuccessToast(caseNumber) {
        // Get the selected language from localStorage or use default ('en')
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
        const successTitle = selectedLanguage === 'es' ? this.formLabels.successToastTitle_es : this.formLabels.successToastTitle;
        const successMessage = selectedLanguage === 'es' ? this.formLabels.successToastMessage_es : this.formLabels.successToastMessage;
    
        const evt = new ShowToastEvent({
            title: `${successTitle}. Case Number: ${caseNumber}`,
            message: successMessage,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
    // //Success Toast Notification
    // handleSuccessToast(result) {
    //     const evt = new ShowToastEvent({
    //         title: `The case has been created successfully. Case Number: ${result}`,
    //         message: `Today you will receive an email confirming we got your request with your ticket number.
    //         We will send the email to the one you input in the form.
    //         Your request should be processed between 24-48 hours. We will send you an email indicating if your request
    //         was approved or denied.`,
    //         variant: 'success',
    //     });
    //     this.dispatchEvent(evt);
    // }
    //Error creating case toast notification
    handleErrorToast(customMessage = null) {
        // Get the selected language from localStorage or use default ('en')
        const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
        const errorTitle = selectedLanguage === 'es' ? this.formLabels.errorToastTitle_es : this.formLabels.errorToastTitle;
        let errorMessage = selectedLanguage === 'es' ? this.formLabels.errorToastMessage_es : this.formLabels.errorToastMessage;
    
        // If a custom message is provided, use it (and translate if needed)
        if (customMessage) {
            errorMessage = selectedLanguage === 'es' ? this.translateErrorMessage(customMessage) : customMessage;
        }
    
        const evt = new ShowToastEvent({
            title: errorTitle,
            message: errorMessage,
            variant: 'error',
        });
        this.dispatchEvent(evt);
    }
    


    // handleErrorToast() {
    //     const evt = new ShowToastEvent({
    //         title: 'We couldn\'t register your request',
    //         message: 'Something Happened! Your request was not able to be registered at this time, please try again in a few moments. Excuse the inconvenience and thank you for understanding.',
    //         variant: 'error',
    //     });
    //     this.dispatchEvent(evt);
    // }

    handleLanguageChange(event) {
        const newLang = event.detail.language;
        this.updateFormLabels(newLang);

        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', newLang);
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


    linkFilesToCase(caseId) {
        return new Promise((resolve, reject) => {
            if (this.uploadedFileIds.length > 0) {
                // Call Apex method to link the files to the case
                linkFilesToCaseApex({ caseId: caseId, fileIds: this.uploadedFileIds })
                    .then(() => {
                        console.log('Files successfully linked to the case');
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error linking files to case:', error);
                        reject(error);
                    });
            } else {
                console.log('No files to link to the case');
                resolve();
            }
        });
    }


    updateFormLabels(language) {
        if (language === 'es') {
            // Set Spanish labels and text
            this.formLabels.firstNameLabel = 'Nombre';
            this.formLabels.lastNameLabel = 'Apellido';
            this.formLabels.socialSecurityLabel = 'Número de Seguro Social';
            this.formLabels.dateOfDeathLabel = 'Fecha de Defunción';
            this.formLabels.uploadDeathCertLabel = 'Subir Certificado de Defunción (PDF)';
            this.formLabels.requestorFirstNameLabel = 'Nombre del solicitante';
            this.formLabels.requestorLastNameLabel = 'Apellido del solicitante';
            this.formLabels.relationshipLabel = 'Relación';
            this.formLabels.emailLabel = 'Correo electrónico';
            this.formLabels.preferredPhoneLabel = 'Número de teléfono preferido';
            this.formLabels.otherPhoneLabel = 'Otro número de teléfono';
            this.formLabels.uploadRequestorIDLabel = 'Subir copia de identificación del solicitante';
            this.formLabels.funeralHomeNameLabel = 'Nombre de la funeraria';
            this.formLabels.claimedAmountLabel = 'Monto reclamado';
            this.formLabels.disbursementPreferenceLabel = 'Preferencia de desembolso';
            this.formLabels.funeralHomeAccountLabel = 'Número de cuenta de la funeraria';
            this.formLabels.branchTownLabel = 'Seleccione una ciudad de sucursal';
            this.formLabels.branchLabel = 'Seleccione una sucursal';
            this.formLabels.uploadFuneralInvoiceLabel = 'Subir factura de la funeraria';
            this.formLabels.legalNotificationLabel = 'He leído y acepto la notificación legal anterior';
            this.formLabels.submitButtonLabel = 'Enviar';
            this.formLabels.nextButtonLabel = 'Siguiente';
            this.formLabels.previousButtonLabel = 'Anterior';

            // Spanish translations for <p> tags
            this.formLabels.requestSupportText = 'Estamos aquí para apoyarte en este momento difícil.';
            this.formLabels.requirementsText = 'Requisitos para solicitar procesamiento:';
            this.formLabels.deathCertificateText = 'Certificado de Defunción (original o copia)';
            this.formLabels.funeralHomeBillText = 'Factura de la funeraria';
            this.formLabels.bankIssuanceText = 'El Banco emitirá un cheque oficial pagadero a la funeraria por el monto facturado hasta el máximo permitido por la ley ($15,000) de los fondos depositados en Popular.';
            this.formLabels.invoicePaidText = '¿La factura de la funeraria está pagada?';
            this.formLabels.unpaidInvoiceInfo = 'Para solicitar un adelanto para gastos funerarios, la factura debe estar impaga. Puede solicitar un adelanto general, para obtener más información sobre cómo solicitar esto visite:';
            this.formLabels.visitLinkMessage = 'Por favor visita';
            this.formLabels.finalStepText = 'Pantalla 4: Paso final o confirmación.';
            this.formLabels.supportMessage = 'Estamos aquí para apoyarte durante este momento difícil.';
            this.formLabels.requestMessage = '¿Cuál es tu solicitud?';
            this.formLabels.fileUploadedText = 'Archivo subido con éxito';


            // Set Spanish labels for dropdowns
            this.formLabels.firstDropdownOptions = [
                { label: 'Fondos adelantados para gastos funerarios impagos', value: 'option1' },
                { label: 'Adelanto general de fondos disponibles', value: 'option2' },
                { label: 'Fondos de liquidación', value: 'option3' }
            ];
            this.formLabels.secondDropdownOptions = [
                { label: 'Sí', value: 'optionA' },
                { label: 'No', value: 'optionB' }
            ];
            this.formLabels.thirdDropdownOptions = [
                { label: 'Depósito en cuenta', value: 'Account Deposit' },
                { label: 'Recoger en la sucursal', value: 'Pick-up at branch' }
            ];

            // Set Spanish labels and placeholders
            this.formLabels.disbursementPreferenceLabel = 'Preferencia de desembolso';
            this.formLabels.disbursementPreferencePlaceholder = 'Seleccione una preferencia de desembolso';

            this.formLabels.selectAnswerLabel = 'Seleccionar respuesta';
            this.formLabels.selectAnswerPlaceholder = 'Seleccionar Sí/No';

            this.formLabels.branchTownPlaceholder = 'Seleccionar ciudad de sucursal';
            this.formLabels.branchPlaceholder = 'Seleccionar sucursal';

            this.formLabels.initialDropdownLabel = '¿Cuál es tu solicitud?';
            this.formLabels.initialDropdownPlaceholder = 'Seleccione el tipo de solicitud';
        } else {
            // English (default) labels and text
            this.formLabels.firstNameLabel = 'First Name';
            this.formLabels.lastNameLabel = 'Last Name';
            this.formLabels.socialSecurityLabel = 'Social Security Number';
            this.formLabels.dateOfDeathLabel = 'Date of Death';
            this.formLabels.uploadDeathCertLabel = 'Upload Death Certificate (PDF)';
            this.formLabels.requestorFirstNameLabel = 'Requestor First Name';
            this.formLabels.requestorLastNameLabel = 'Requestor Last Name';
            this.formLabels.relationshipLabel = 'Relationship';
            this.formLabels.emailLabel = 'Email';
            this.formLabels.preferredPhoneLabel = 'Preferred Phone Number';
            this.formLabels.otherPhoneLabel = 'Other Phone Number';
            this.formLabels.uploadRequestorIDLabel = 'Upload copy of requestor ID';
            this.formLabels.funeralHomeNameLabel = 'Funeral Home Name';
            this.formLabels.claimedAmountLabel = 'Claimed Amount';
            this.formLabels.disbursementPreferenceLabel = 'Disbursement Preference';
            this.formLabels.funeralHomeAccountLabel = 'Funeral Home Account Number';
            this.formLabels.branchTownLabel = 'Choose a Branch Town';
            this.formLabels.branchLabel = 'Choose a Branch';
            this.formLabels.uploadFuneralInvoiceLabel = 'Funeral Home Invoice';
            this.formLabels.legalNotificationLabel = 'I have read and accepted the legal notification above';
            this.formLabels.submitButtonLabel = 'Submit';
            this.formLabels.nextButtonLabel = 'Next';
            this.formLabels.previousButtonLabel = 'Previous';

            // English translations for <p> tags
            this.formLabels.requestSupportText = 'We are here to support you during this difficult time.';
            this.formLabels.requirementsText = 'Requirements to request processing:';
            this.formLabels.deathCertificateText = 'Death Certificate (original or copy)';
            this.formLabels.funeralHomeBillText = 'Funeral home bill';
            this.formLabels.bankIssuanceText = 'The Bank will issue an official check payable to the funeral home for the amount billed up to the maximum permitted by law ($15,000) of the funds deposited with Popular.';
            this.formLabels.invoicePaidText = 'Is the funeral home invoice paid?';
            this.formLabels.unpaidInvoiceInfo = 'To request an advance for funeral expenses the invoice must be unpaid. You can request a general advance, for more information on how to request this visit:';
            this.formLabels.visitLinkMessage = 'Please visit';
            this.formLabels.finalStepText = 'Screen 4: Final step or confirmation.';
            this.formLabels.supportMessage = 'We are here to support you during this difficult time.';
            this.formLabels.requestMessage = 'What is your request?';
            this.formLabels.fileUploadedText = 'File uploaded successfully';

            // Set English (default) labels for dropdowns
            this.formLabels.firstDropdownOptions = [
                { label: 'Advance funds for unpaid funeral Expenses', value: 'option1' },
                { label: 'General advance of available funds', value: 'option2' },
                { label: 'Liquidation funds', value: 'option3' }
            ];
            this.formLabels.secondDropdownOptions = [
                { label: 'Yes', value: 'optionA' },
                { label: 'No', value: 'optionB' }
            ];
            this.formLabels.thirdDropdownOptions = [
                { label: 'Account Deposit', value: 'Account Deposit' },
                { label: 'Pick-up at branch', value: 'Pick-up at branch' }
            ];

            // Set English (default) labels and placeholders
            this.formLabels.disbursementPreferenceLabel = 'Disbursement Preference';
            this.formLabels.disbursementPreferencePlaceholder = 'Select Disbursement preference';

            this.formLabels.selectAnswerLabel = 'Select Answer';
            this.formLabels.selectAnswerPlaceholder = 'Select Yes/No';

            this.formLabels.branchTownPlaceholder = 'Select Branch Town';
            this.formLabels.branchPlaceholder = 'Select Branch';

            this.formLabels.initialDropdownLabel = 'What is your request?';
            this.formLabels.initialDropdownPlaceholder = 'Select request type';
        }
    }
    
    
    translateErrorMessage(message) {
        switch (message) {
            case 'Case created, but files failed to attach.':
                return 'Caso creado, pero los archivos no se pudieron adjuntar.';
            case 'Error creating case.':
                return 'Error al crear el caso.';
            default:
                return message;  // Return the default message if no translation is available
        }
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.formData[field] = event.target.value;
    }
}