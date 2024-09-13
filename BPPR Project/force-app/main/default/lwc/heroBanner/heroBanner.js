import { LightningElement, api } from 'lwc';
import LANG from '@salesforce/i18n/lang';

export default class HeroBanner extends LightningElement {
    text1 = 'We are here to help you';
    text2 = 'during this difficult time';

    connectedCallback() {
        this.updateTextBasedOnLanguage();
    }

    updateTextBasedOnLanguage() {
        
        
        if (LANG === 'es-PR') {
            this.text1 = 'Estamos aquí para ayudarte';
            this.text2 = 'durante este momento difícil';
        } else {
            this.text1 = 'We are here to help you';
            this.text2 = 'during this difficult time';
        }
    }
}