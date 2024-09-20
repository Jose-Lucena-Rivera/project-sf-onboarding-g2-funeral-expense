import { LightningElement, api } from 'lwc';
import LANG from '@salesforce/i18n/lang';
import HERO_BANNER from '@salesforce/resourceUrl/hero_banner';

export default class HeroBanner extends LightningElement {
    text1 = 'We are here to help you';
    text2 = 'during this difficult time';
    heroBannerUrl = HERO_BANNER;

    connectedCallback() {
        this.updateText(LANG);

        // Add an event listener for language changes
        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed
        window.removeEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    updateText(language) {
        if (language === 'es_PR') {
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