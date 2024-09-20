import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selfRegister from '@salesforce/apex/LightningSelfRegisterLWCController.selfRegister';

export default class RegistrationForm extends LightningElement {
    // Form fields
    @track formFields = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        ssn: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        password: '',
        confirmPassword: ''
    }

    // General error message
    @track errorMessage = '';
    @track showError = false;

    @track fieldErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        ssn: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        password: '',
        confirmPassword: ''
    }

    // Handle when HTML input changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.formFields[field] = event.target.value;
    }

    handleSubmit() {
        this.showError = false;
        this.errorMessage = '';

        // Validate each field
        this.validateField('firstName');
        this.validateField('lastName');
        this.validateField('email');
        this.validateField('phone');
        this.validateField('dateOfBirth');
        this.validateField('ssn');
        this.validateField('street');
        this.validateField('city');
        this.validateField('state');
        this.validateField('country');
        this.validateField('postalCode');
        this.validateField('password');
        this.validateField('confirmPassword');

        // If there is an error in any input field, return.
        if (this.fieldErrors.firstName || this.fieldErrors.lastName || this.fieldErrors.email ||
            this.fieldErrors.phone || this.fieldErrors.dateOfBirth || this.fieldErrors.ssn ||
            this.fieldErrors.street || this.fieldErrors.city || this.fieldErrors.state ||
            this.fieldErrors.country || this.fieldErrors.postalCode || this.fieldErrors.password ||
            this.fieldErrors.confirmPassword) {
            return;
        }

        // Call the Apex method for server-side registration
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
            regConfirmUrl: '/register/confirm', // Replace with actual confirmation URL
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
        this.showSuccessToast()
        window.location.href = "/s/login";
        
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Account has been created,',
            message: 'Register was successful!',
            variant: 'success',
        });
        this.dispatchEvent(event);
    }

    // Validation management
    validateField(field) {
        switch (field) {
            case 'firstName':
                this.fieldErrors.firstName = this.formFields.firstName ? '' : 'First name is required.';
                break;
            case 'lastName':
                this.fieldErrors.lastName = this.formFields.lastName ? '' : 'Last name is required.';
                break;
            case 'email':
                this.fieldErrors.email = this.formFields.email ? '' : 'Email is required.';
                this.validateEmail();
                break;
            case 'phone':
                this.fieldErrors.phone = this.formFields.phone ? '' : 'Phone number is required.';
                this.validatePhone();
                break;
            case 'dateOfBirth':
                this.fieldErrors.dateOfBirth = this.formFields.dateOfBirth ? '' : 'Date of birth is required.';
                break;
            case 'ssn':
                this.fieldErrors.ssn = this.formFields.ssn ? '' : 'SSN is required.';
                break;
            case 'street':
                this.fieldErrors.street = this.formFields.street ? '' : 'Street is required.';
                break;
            case 'city':
                this.fieldErrors.city = this.formFields.city ? '' : 'City is required.';
                break;
            case 'state':
                this.fieldErrors.state = this.formFields.state ? '' : 'State is required.';
                break;
            case 'country':
                this.fieldErrors.country = this.formFields.country ? '' : 'Country is required.';
                break;
            case 'postalCode':
                this.fieldErrors.postalCode = this.formFields.postalCode ? '' : 'Postal code is required.';
                break;
            case 'password':
                this.fieldErrors.password = this.formFields.password ? '' : 'Password is required.';
                this.validatePassword();
                break;
            case 'confirmPassword':
                this.fieldErrors.confirmPassword = this.formFields.confirmPassword ? '' : 'Confirm password is required.';
                this.validateConfirmPassword();
                break;
        }
    }

    validateEmail() {
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailPattern.test(this.formFields.email)) {
            this.fieldErrors.email = 'Email must be valid.'
        }
    }

    // Function to validate the last 4 digits of the ssn.
    validateSSN() {
        const ssnPattern = /\d{4}$/;
        if (!ssnPattern.test(this.formFields.ssn)) {
            this.fieldErrors.ssn = 'SSN must contain the last 4 digits.';
        }
    }
    
    // Funtion to validate password. Must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long.
    validatePassword() {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordPattern.test(this.formFields.password)) {
            this.fieldErrors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long.';
        }
    }
    
    // Function to validate that password is the same as confirmPassword.
    validateConfirmPassword() {
        if (this.formFields.password !== this.formFields.confirmPassword) {
            this.fieldErrors.confirmPassword = 'Passwords do not match.';
        }
    }
}