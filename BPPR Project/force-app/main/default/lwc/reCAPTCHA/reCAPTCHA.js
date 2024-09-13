// import { LightningElement , api, track} from 'lwc';
// import pageUrl from '@salesforce/resourceUrl/reCaptcha';
// import isReCAPTCHAValid from '@salesforce/apex/reCAPTCHAController.isReCAPTCHAValid';

// export default class ReCAPTCHA extends LightningElement {
//     @api formToken;
//     @api validReCAPTCHA = false;

//     @track navigateTo;
//     captchaWindow = null;

//     constructor(){
//         super();
//         this.navigateTo = pageUrl;
//     }

//     captchaLoaded(evt){
//         var e = evt;
//         console.log(e.target.getAttribute('src') + ' loaded');
//         if(e.target.getAttribute('src') == pageUrl){

//             window.addEventListener("message", function(e) {
//                 if (e.data.action == "getCAPCAH" && e.data.callCAPTCHAResponse == "NOK"){
//                     console.log("Token not obtained!")
//                 } else if (e.data.action == "getCAPCAH" ) {
//                     this.formToken = e.data.callCAPTCHAResponse;
//                     isReCAPTCHAValid({tokenFromClient: formToken}).then(data => {
//                         this.validReCAPTCHA = data;
//                     });
//                 }
//             }, false);
//         } 
//     }

    // recaptchaInitialized = false;
    // siteKey = '6Le2jEIqAAAAANBR_7SyGcY6nkBneNqNua8uCtE0';
    // token;

    // renderedCallback() {
    //     if (this.recaptchaInitialized) {
    //         return;
    //     }
    //     this.recaptchaInitialized = true;

    //     // Load Google reCAPTCHA script from a static resource or directly from Google
    //     //loadScript(this, `${recaptchaResource}`)
    //     loadScript(this, 'https://www.google.com/recaptcha/api.js?render=' + this.siteKey)

    //         .then(() => {
    //             window.grecaptcha.ready(() => {
    //                 this.initializeRecaptcha();
    //             });
    //         })
    //         .catch((error) => {
    //             console.error('Error loading reCAPTCHA script:', error);
    //         });
    // }

    // initializeRecaptcha() {
    //     window.grecaptcha.render(this.template.querySelector('#recaptcha'), {
    //         sitekey: this.siteKey,
    //         callback: this.onRecaptchaSuccess.bind(this),
    //         'error-callback': this.onRecaptchaError,
    //     });
    // }

    // onRecaptchaSuccess(token) {
    //     this.token = token; // Store the reCAPTCHA token
    // }

    // onRecaptchaError() {
    //     console.error('reCAPTCHA failed');
    // }

    // handleSubmit() {
    //     if (!this.token) {
    //         alert('Please complete the reCAPTCHA.');
    //         return;
    //     }

    //     // Call Apex to verify reCAPTCHA
    //     verifyRecaptcha({ token: this.token })
    //         .then((response) => {
    //             if (response.success) {
    //                 // Proceed with form submission
    //                 console.log('reCAPTCHA verification succeeded.');
    //             } else {
    //                 console.error('reCAPTCHA verification failed:', response['error-codes']);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error verifying reCAPTCHA:', error);
    //         });
    // }
    import { LightningElement, track, api } from 'lwc';
import pageUrl from '@salesforce/resourceUrl/reCaptcha';
import isReCaptchaValid from '@salesforce/apex/reCAPTCHAController.isReCaptchaValid';

export default class reCaptcha extends LightningElement {
    @api formToken;
    @api validReCAPTCHA = false;

    @track navigateTo;
    captchaWindow = null;

    constructor(){
        super();
        this.navigateTo = pageUrl;
        window.addEventListener("message", this.listenForMessage);
    }
    listenForMessage(e){
        console.log(e);
        console.log('e-'+ JSON.stringify(e.data));
        if(e.data)
        {
            if (e.data.action == "getCAPCAH" && e.data.callCAPTCHAResponse == ""){
                console.log("Token not obtained!")
            } else if (e.data.action == "getCAPCAH" ) {
                this.formToken = e.data.callCAPTCHAResponse;
                isReCaptchaValid({token: formToken}).then(data => {
                    this.validReCAPTCHA = data;
                });
            };
        }
    }
    onCaptchaLoaded(evt){
        var e = evt;
        console.log(e.target.getAttribute('src') + ' loaded-'+ pageUrl);
        if(e.target.getAttribute('src') == pageUrl){
            this.listenForMessage(evt);
        } 
    }
}