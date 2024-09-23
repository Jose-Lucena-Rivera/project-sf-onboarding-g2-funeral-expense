import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selfRegister from '@salesforce/apex/LightningSelfRegisterLWCController.selfRegister';

export default class RegistrationForm extends LightningElement {
    @track formFields = {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phone: undefined,
        dateOfBirth: undefined,
        ssn: undefined,
        street: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        postalCode: undefined,
        password: undefined,
        confirmPassword: undefined
    }

    // Default language is English
    @track labels = this.getEnglishLabels();

    patterns = {
        password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$/,
        postalCode: /^\d{5}(-\d{4})?$/,
        ssn: /^[0-9]{4}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }

    @track errorMessage = '';
    @track showError = false;

    connectedCallback() {
        this.checkLanguage();
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.formFields[field] = event.target.value;
    }

    handleSubmit() {
        this.showError = false;
        this.errorMessage = '';

        // Check if any required field is missing
        if (!this.formFields.firstName || !this.formFields.lastName || !this.formFields.email ||
        !this.formFields.phone || !this.formFields.dateOfBirth || !this.formFields.ssn ||
        !this.formFields.street || !this.formFields.city || !this.formFields.state ||
        !this.formFields.country || !this.formFields.postalCode || !this.formFields.password ||
        !this.formFields.confirmPassword) {
            this.showError = true;
            this.errorMessage = this.labels.allFieldsError;
            return;
        }

        // Validate password match
        if (this.formFields.password !== this.formFields.confirmPassword) {
            this.showError = true;
            this.errorMessage = this.labels.passwordMismatch;
            return;
        }

        // Call Apex method for registration
        selfRegister({
            firstname: this.formFields.firstName,
            lastname: this.formFields.lastName,
            email: this.formFields.email,
            phone: this.formFields.phone,
            dateOfBirth: this.formFields.dateOfBirth,
            ssn: this.formFields.ssn,
            street: this.formFields.street,
            city: this.formFields.city,
            state: this.formFields.state,
            country: this.formFields.country,
            postalCode: this.formFields.postalCode,
            password: this.formFields.password,
            confirmPassword: this.formFields.confirmPassword,
            accountId: "", 
            regConfirmUrl: '/register/confirm',
            startUrl: '/'
        })
        .then(result => {
            if (result) {
                this.showError = true;
                this.errorMessage = result;
            } else {
                this.handleRegisterSuccess();
            }
        })
        .catch(error => {
            this.showError = true;
            this.errorMessage = error.body.message;
        });
    }

    handleRegisterSuccess() {
        this.showSuccessToast();
        window.location.href = "/s/case-form";
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: this.labels.accountCreatedTitle,
            message: this.labels.registerSuccess,
            variant: 'success',
        });
        this.dispatchEvent(event);
    }

    handleLanguageChange(event) {
        const selectedLanguage = event.detail.language;
        if (selectedLanguage === 'es') {
            this.labels = this.getSpanishLabels();
        } else {
            this.labels = this.getEnglishLabels();
        }
    }

    checkLanguage() {
        const params = new URLSearchParams(window.location.search);
        const language = params.get('language') || localStorage.getItem('selectedLanguage');
        if (language === 'es') {
            this.labels = this.getSpanishLabels();
        } else {
            this.labels = this.getEnglishLabels();
        }
    }

    getEnglishLabels() {
        return {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            dateOfBirth: 'Date of Birth',
            ssn: 'Last 4 Digits of SSN',
            street: 'Street Address',
            city: 'City',
            state: 'State Address',
            country: 'Country Address',
            postalCode: 'Zip/Postal Code',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            submit: 'Submit',
            allFieldsError: 'All fields must be completed.',
            passwordMismatch: 'Passwords do not match.',
            accountCreatedTitle: 'Account has been created,',
            registerSuccess: 'Register was successful!'
        };
    }

    getSpanishLabels() {
        return {
            firstName: 'Nombre',
            lastName: 'Apellido',
            email: 'Correo Electrónico',
            phone: 'Teléfono',
            dateOfBirth: 'Fecha de Nacimiento',
            ssn: 'Últimos 4 dígitos del SSN',
            street: 'Dirección',
            city: 'Ciudad',
            state: 'Estado',
            country: 'País',
            postalCode: 'Código Postal',
            password: 'Contraseña',
            confirmPassword: 'Confirmar Contraseña',
            submit: 'Enviar',
            allFieldsError: 'Todos los campos deben completarse.',
            passwordMismatch: 'Las contraseñas no coinciden.',
            accountCreatedTitle: 'Cuenta ha sido creada,',
            registerSuccess: '¡Registro exitoso!'
        };
    }
}