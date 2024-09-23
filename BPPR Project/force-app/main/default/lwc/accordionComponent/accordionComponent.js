import { LightningElement } from 'lwc';

export default class AccordionComponent extends LightningElement {
    selectedLanguage = 'en_US'; // Default language is English

    // Localized content for both English and Spanish
    accordionItems = {
        en_US: [
            {
                id: 1,
                header: 'What should I do to request an advance of funds for funeral expenses?',
                content: 'You can request an advance from the bank to cover funeral expenses. Requirements include a Death Certificate (original or copy) and a Funeral home bill.',
                isOpen: false,
                icon: 'utility:chevronright'
            },
            {
                id: 2,
                header: 'How do I obtain the advance of funds?',
                content: 'For the advance of funds, you have the option to direct deposit to the Funeral Home Account Number or pick-up a check at your preferred Banco Popular Branch.',
                isOpen: false,
                icon: 'utility:chevronright'
            },
            {
                id: 3,
                header: 'What is the maximum amount permitted for the advance of funds for funeral expenses?',
                content: 'The Bank will issue an official check payable to the funeral home for the amount billed or up to the maximum permitted by law ($15,000) of the funds deposited with Popular.',
                isOpen: false,
                icon: 'utility:chevronright'
            }
        ],
        es: [
            {
                id: 1,
                header: '¿Qué debo hacer para solicitar un adelanto de fondos para gastos fúnebres?',
                content: 'Puede solicitar un anticipo del banco para cubrir los gastos fúnebres. Los requisitos incluyen un certificado de defunción (original o copia) y una factura de la funeraria.',
                isOpen: false,
                icon: 'utility:chevronright'
            },
            {
                id: 2,
                header: '¿Cómo obtengo el adelanto de fondos?',
                content: 'Para el adelanto de fondos, tiene la opción de depósito directo en la cuenta de la funeraria o recoger un cheque en su sucursal preferida de Banco Popular.',
                isOpen: false,
                icon: 'utility:chevronright'
            },
            {
                id: 3,
                header: '¿Cuál es la cantidad máxima permitida para el adelanto de fondos para gastos fúnebres?',
                content: 'El banco emitirá un cheque oficial pagadero a la funeraria por el monto facturado o hasta el máximo permitido por ley ($15,000) de los fondos depositados en Popular.',
                isOpen: false,
                icon: 'utility:chevronright'
            }
        ]
    };

    // Localized content for section title and text above accordion
    sectionContent = {
        en_US: {
            title: 'We have made our processes digital',
            paragraphs: [
                'The processes for the advance funds for funeral expenses and the liquidation of deposit funds have been converted digitally.',
                'Banco Popular has created a digital way to streamline these processes. To create a case you will need to register on our portal and upload the necessary documents.',
            ],
            accordionTitle: 'Learn more about advance funds for funeral expenses:',
            registerText: 'Register Here'
        },
        es: {
            title: 'Hemos digitalizado nuestros procesos',
            paragraphs: [
                'Los procesos para adelanto de fondos para gastos fúnebres como la liquidación de fondos de deposito han sido covnertidos a manera digital.',
                'Banco Popular ha creado una forma digital para agilizar los procesos. Para crear una solicitud tendra que registrarse en nuestro portal y subir los documentos necesarios.',
            ],
            accordionTitle: 'Conoce más sobre el adelanto de fondos para gastos fúnebres :',
            registerText: 'Regístrese Aquí'
        }
    };

    get registerText() {
        return this.sectionContent[this.selectedLanguage]?.registerText || this.sectionContent['en_US'].registerText;
    }

    navigateToForm() {
        window.location.href = 'https://cunning-koala-g913l3-dev-ed.trailblaze.my.site.com/bppr/s/login/SelfRegister';
    }

    get items() {
        return this.accordionItems[this.selectedLanguage] || this.accordionItems['en_US'];
    }

    get sectionTitle() {
        return this.sectionContent[this.selectedLanguage]?.title || this.sectionContent['en_US'].title;
    }

    get sectionParagraphs() {
        return this.sectionContent[this.selectedLanguage]?.paragraphs || this.sectionContent['en_US'].paragraphs;
    }

    get accordionTitle() {
        return this.sectionContent[this.selectedLanguage]?.accordionTitle || this.sectionContent['en_US'].accordionTitle;
    }

    connectedCallback() {
        // Fetch initial language from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('language');
        const langFromStorage = localStorage.getItem('selectedLanguage');

        // Set language based on URL or localStorage, or default to English
        this.selectedLanguage = langFromUrl || langFromStorage || 'en_US';

        window.addEventListener('languagechange', this.handleLanguageChange.bind(this));
    }

    handleLanguageChange(event) {
        this.selectedLanguage = event.detail.language || 'en_US';
    }

    toggleAccordion(event) {
        const itemId = event.target.dataset.id;
        this.accordionItems[this.selectedLanguage] = this.accordionItems[this.selectedLanguage].map(item => {
            if (item.id == itemId) {
                item.isOpen = !item.isOpen;
                item.icon = item.isOpen ? 'utility:chevrondown' : 'utility:chevronright';
            }
            return item;
        });
        // Force component to re-render by resetting the data
        this.accordionItems = { ...this.accordionItems };
    }

    disconnectedCallback() {
        window.removeEventListener('languagechange', this.handleLanguageChange);
    }
}