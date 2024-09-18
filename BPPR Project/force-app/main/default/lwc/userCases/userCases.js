import { LightningElement, track} from 'lwc';
import getUsersCases from '@salesforce/apex/CaseController.getUsersCases';

export default class UserCases extends LightningElement {
    @track userCases;

    // Call user's cases from the start.
    connectedCallback() {
        this.loadUserCases();
    }

    // Load user's cases
    loadUserCases() {
        getUsersCases()
        .then(result => {
            this.userCases = result;
        })
        .catch(error => {
            console.log(error);
            this.userCases = undefined;
        });
    }

    get thereAreCases() {
        return this.userCases != undefined && this.userCases.length > 0;
    }
}