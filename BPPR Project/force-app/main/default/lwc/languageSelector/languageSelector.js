import { LightningElement, track } from 'lwc';

export default class LanguageSelector extends LightningElement {
    @track selectedLanguage = 'en_US';

    connectedCallback() {
        // Retrieve the language from the URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('language');
    
        // Retrieve the language from localStorage
        const langFromStorage = localStorage.getItem('selectedLanguage');
    
        if (langFromUrl) {
            // Use language from URL and store it in localStorage
            this.selectedLanguage = langFromUrl;
            localStorage.setItem('selectedLanguage', langFromUrl);
        } else if (langFromStorage) {
            // Use language from localStorage
            this.selectedLanguage = langFromStorage;
        } else {
            // Default: detect the browser's language and set it
            const browserLanguage = navigator.language || navigator.userLanguage;
            this.selectedLanguage = browserLanguage.includes('es') ? 'es' : 'en_US';
            localStorage.setItem('selectedLanguage', this.selectedLanguage);
        }
    
        // Notify other components of the current language
        this.notifyLanguageChange();
    }

    handleLanguageChange(event) {
        const selectedLang = event.target.value;
        this.selectedLanguage = selectedLang;
    
        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', this.selectedLanguage);
    
        // Update the URL with the selected language
        this.updateUrlWithLanguage(this.selectedLanguage);
    
        // Reload the page to apply the new language
        window.location.reload();
    }

    notifyLanguageChange() {
        const languageChangeEvent = new CustomEvent('languagechange', {
            detail: { language: this.selectedLanguage }
        });
        window.dispatchEvent(languageChangeEvent);
    }

    updateUrlWithLanguage(language) {
        const url = new URL(window.location.href);
        url.searchParams.set('language', language);
        window.history.pushState({}, '', url); // Update the URL
    }

    renderedCallback() {
        this.setSelectedOption();
    }
    
    setSelectedOption() {
        const selectElement = this.template.querySelector('select');
        if (selectElement) {
            selectElement.value = this.selectedLanguage;
        }
    }
}