import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import selfRegister from '@salesforce/apex/LightningSelfRegisterLWCController.selfRegister';

export default class RegistrationForm extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track dateOfBirth = '';
    @track ssn = '';
    
    @track street = '';
    @track city = '';
    @track state = '';
    @track country = '';
    @track postalCode = '';
    
    @track password = '';
    @track confirmPassword = '';

    @track errorMessage = '';
    @track showError = false;

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleSubmit() {
        this.showError = false;
        this.errorMessage = '';

        // Client-side validation
        if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
            this.showError = true;
            this.errorMessage = 'All fields are required.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.showError = true;
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        // Call the Apex method for server-side registration
        selfRegister({
            firstname: this.firstName,
            lastname: this.lastName,
            email: this.email,
            phone: this.phone,
            dateOfBirth: this.dateOfBirth,
            ssn: this.ssn,
            street: this.street,
            city: this.city,
            state: this.state,
            country: this.country,
            postalCode: this.postalCode,
            password: this.password,
            confirmPassword: this.confirmPassword,
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
        window.location.href = "/s/login";
        // this.showSuccessToast()
    }

    // showSuccessToast() {
    //     const event = new ShowToastEvent({
    //         title: 'Success:',
    //         message: 'Register was successful!',
    //         variant: 'success',
    //         mode: 'pester'
    //     });
    //     this.dispatchEvent(event);
    // }
    
}