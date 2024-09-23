import { LightningElement } from 'lwc';
import HERO_BANNER from '@salesforce/resourceUrl/hero_banner';

export default class HeroBanner extends LightningElement {
    text1 = 'We are here to help you';
    text2 = 'during this difficult time';
    heroBannerUrl = HERO_BANNER;

    connectedCallback() {
        // Retrieve the initial language either from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('language');
        const langFromStorage = localStorage.getItem('selectedLanguage');

        let initialLanguage = langFromUrl || langFromStorage || 'en_US';
        this.updateText(initialLanguage);

        // Add event listener for language changes
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed
        window.removeEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    updateText(language) {
        if (language === 'es') {
            this.text1 = 'Estamos aquí para ayudarte';
            this.text2 = 'durante este momento difícil';
        } else {
            this.text1 = 'We are here to help you';
            this.text2 = 'during this difficult time';
        }
    }

    handleLanguageChange(event) {
        const newLang = event.detail.language;
        this.updateText(newLang);
    }
}