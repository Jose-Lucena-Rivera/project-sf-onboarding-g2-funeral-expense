import { LightningElement, track } from 'lwc';

export default class LanguageSelector extends LightningElement {
    @track selectedLanguage = 'en_US';

    connectedCallback() {
        // Retrieve the language from the URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('language');

        if (lang) {
            this.selectedLanguage = lang;
        } else {
            // Detect the browser's default language and set it
            const browserLanguage = navigator.language || navigator.userLanguage;
            this.selectedLanguage = browserLanguage.includes('es') ? 'es_PR' : 'en_US';
        }

        // Notify other components of the initial language
        this.notifyLanguageChange();
    }

    handleLanguageChange(event) {
        this.selectedLanguage = event.target.value;
        this.notifyLanguageChange();

        // Update the URL with the selected language parameter
        const url = new URL(window.location.href);
        url.searchParams.set('language', this.selectedLanguage);
        window.history.pushState({}, '', url);

        // Force a page reload to apply translations
        //window.location.reload();
    }

    notifyLanguageChange() {
        const languageChangeEvent = new CustomEvent('languagechange', {
            detail: { language: this.selectedLanguage }
        });
        window.dispatchEvent(languageChangeEvent);
    }
}