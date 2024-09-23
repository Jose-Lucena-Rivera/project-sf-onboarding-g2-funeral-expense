import { LightningElement, track } from 'lwc';
import PHONE from '@salesforce/resourceUrl/phone';

export default class ContactUs extends LightningElement {
    @track isEnglish = false;
    @track isSpanish = false;
    PhoneUrl = PHONE;

    connectedCallback() {
        this.checkLanguage();
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    checkLanguage() {
        const params = new URLSearchParams(window.location.search);
        const language = params.get('language') || localStorage.getItem('selectedLanguage');

        this.updateLanguageDisplay(language);
    }

    handleLanguageChange(event) {
        const selectedLanguage = event.detail.language;
        this.updateLanguageDisplay(selectedLanguage);
    }

    updateLanguageDisplay(language) {
        this.isEnglish = (language === 'en_US');
        this.isSpanish = (language === 'es');
    }

    disconnectedCallback() {
        // Clean up event listener
        window.removeEventListener('languagechange', this.handleLanguageChange.bind(this));
    }
}