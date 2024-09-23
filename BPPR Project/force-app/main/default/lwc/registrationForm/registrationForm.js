import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selfRegister from '@salesforce/apex/LightningSelfRegisterLWCController.selfRegister';

export default class RegistrationForm extends LightningElement {
    // Form fields
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

    patterns = {
        password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$/,
        postalCode: /^\d{5}(-\d{4})?$/,
        ssn: /^[0-9]{4}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }

    // General error message
    @track errorMessage = '';
    @track showError = false;

    // Handle when HTML input changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.formFields[field] = event.target.value;
    }

    handleSubmit() {
        this.showError = false;
        this.errorMessage = '';

        // If there is an error in any input field, return.
        if (!this.formFields.firstName || !this.formFields.lastName || !this.formFields.email ||
        !this.formFields.phone || !this.formFields.dateOfBirth || !this.formFields.ssn ||
        !this.formFields.street || !this.formFields.city || !this.formFields.state ||
        !this.formFields.country || !this.formFields.postalCode || !this.formFields.password ||
        !this.formFields.confirmPassword) {
            this.showError = true;
            this.errorMessage = 'All fields must be completed.'
            return;
        }

        // Validate that password is the same as confirmPassword.
        if (this.formFields.password !== this.formFields.confirmPassword) {
            this.showError = true;
            this.errorMessage = 'Passwords do not match.'
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
        window.location.href = "/s/case-form";
        
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Account has been created,',
            message: 'Register was successful!',
            variant: 'success',
        });
        this.dispatchEvent(event);
    }
}