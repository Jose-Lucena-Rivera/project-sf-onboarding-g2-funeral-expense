import { LightningElement, track } from 'lwc';


export default class CustomerForm extends LightningElement {
    // Track which screen is currently visible
    isScreen1 = true;
    isScreen2 = false;
    isScreen3 = false;
    isScreen4 = false;

    // Dropdown options
    firstDropdownOptions = [
        { label: 'Advance funds for unpaid funeral Expenses', value: 'option1' },
        { label: 'General advance of available funds', value: 'option2' },
        { label: 'Liquidation funds', value: 'option3' }
    ];

    secondDropdownOptions = [
        { label: 'Yes', value: 'optionA' },
        { label: 'No', value: 'optionB' }
    ];
    thirdDropdownOptions = [
        { label: 'Account Deposit', value: 'optionY' },
        { label: 'Pick-up at branch', value: 'optionZ' }
    ];

    // Selected values
    @track selectedFirstOption;
    @track selectedSecondOption;
    @track selectedThirdOption;

    // Handle dropdown selections
    handleFirstDropdownChange(event) {
        this.selectedFirstOption = event.detail.value;
    }

    handleSecondDropdownChange(event) {
        this.selectedSecondOption = event.detail.value;
    }
    handleThirdDropdownChange(event) {
        this.selectedThirdOption = event.detail.value;
    }

    get showNextButton() {
        // For screen 1: only show the next button if Option 1 is selected
        if (this.isScreen1 && this.selectedFirstOption === 'option1') {
            return true;
        }
        // For screen 2: show the next button only if Option 'No' is selected
        if (this.isScreen2 && this.selectedSecondOption === 'optionB') {
            return true;
        }
        
        return false;
    }

    // Navigation: Move to the next screen
    handleNext() {
        if (this.isScreen1 && this.selectedFirstOption === 'option1') {
            this.isScreen1 = false;
            this.isScreen2 = true;
        } else if (this.isScreen2) {
            this.isScreen2 = false;
            this.isScreen3 = true;
        } else if (this.isScreen3) {
            this.isScreen3 = false;
            this.isScreen4 = true;
        }
    }

    // Navigation: Move to the previous screen
    handlePrevious() {
        if (this.isScreen4) {
            this.isScreen4 = false;
            this.isScreen3 = true;
        } else if (this.isScreen3) {
            this.isScreen3 = false;
            this.isScreen2 = true;
        } else if (this.isScreen2) {
            this.isScreen2 = false;
            this.isScreen1 = true;
        }
    }

    get isOption2or3() {
        return this.selectedFirstOption == 'option2' || this.selectedFirstOption == 'option3';
    }

    get isOptionYes() {
        return this.selectedSecondOption == 'optionA';
    }

    get isOptionDeposit() {
        return this.selectedThirdOption == 'optionY';
    }

    get isOptionBranch() {
        return this.selectedThirdOption == 'optionZ';
    }

    get acceptedFormats() {
        return ['.pdf', '.png', '.jpeg'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }
}