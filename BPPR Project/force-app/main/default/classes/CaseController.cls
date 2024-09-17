public with sharing class CaseController {
    /*
        FIELDS:
        First_Name_Deceased__c
        Last_Name_Deceased__c
        Funeral_Home_Name__c
        Disbursement_Preference__c
        Date_of_Death__c
        Claimed_Amount__c
        Phone_Number__c
        Preferred_Phone_Number__c
        Relationship__c
        Social_Security_Number__c
        Funeral_Home_Account_Number__c
     */
    @AuraEnabled
    public static String createAdvanceFundCase(String firstNameDeceased, String lastNameDeceased, String funeralHomeName, String disbursementPreference, 
    Date dateOfDeath, String claimedAmount, String preferredPhone, String otherPhone, String relationship, String ssn, String funeralHomeNumber, String firstname, 
    String lastname, String email, String accountId, String branchTown, String branch) {
        
      
        // Create new Case
        Case c = new Case(
            First_Name_Deceased__c=firstNameDeceased,
            Last_Name_Deceased__c=lastNameDeceased,
            Funeral_Home_Name__c=funeralHomeName,
            Disbursement_Preference__c=disbursementPreference,
            Date_of_Death__c=dateOfDeath,
            Claimed_Amount__c= Decimal.valueOf(claimedAmount),
            Preferred_Phone_Number__c= preferredPhone,
            Phone_Number__c=otherPhone,
            Relationship__c=relationship,
            Social_Security_Number__c=ssn,
            Funeral_Home_Account_Number__c=funeralHomeNumber,
            AccountId = accountId,
            Branch_Town__c = branchTown,
            Branch__c = branch,
            Origin='Web'
        );
        
       
        // Insert new Case. If it succeeds, send a true value; else send a false value.
        try {
            Database.SaveResult sr = Database.insert(c, true);
            Case caseCreated = [SELECT id, caseNumber FROM Case WHERE id=:sr.getId()];
            return caseCreated.caseNumber;
        } catch(Exception e) {
            return 'error';
        }   
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, List<String>> getDependentPicklistValues(String controllingFieldValue) {
        Map<String, List<String>> dependentValues = new Map<String, List<String>>();
    
        // Describe the controlling and dependent fields
        Schema.DescribeFieldResult controllingFieldResult = Case.Branch_Town__c.getDescribe(); 
        Schema.DescribeFieldResult dependentFieldResult = Case.Branch__c.getDescribe();
    
        // Fetch picklist values for both controlling and dependent fields
        List<Schema.PicklistEntry> controllingPicklistValues = controllingFieldResult.getPicklistValues();
        List<Schema.PicklistEntry> dependentPicklistValues = dependentFieldResult.getPicklistValues();
    
        // Iterate over each controlling picklist value and build dependent options manually.
        for (Schema.PicklistEntry controllingEntry : controllingPicklistValues) {
            String controllingValue = controllingEntry.getValue();
            List<String> dependentOptions = new List<String>();
    
            // This is where the conditional structure would match dependencies based on some criteria
            // Use static checks, databases, or known dependencies.
            for (Schema.PicklistEntry dependentEntry : dependentPicklistValues) {
                // Check if the dependent entry is active or set conditions manually based on controlling field value
                if (dependentEntry.isActive()) {
                    dependentOptions.add(dependentEntry.getLabel());
                }
            }
            // Associate the found dependent options to their controlling values
            dependentValues.put(controllingEntry.getLabel(), dependentOptions);
        }
    
        return dependentValues;
    }
    
    
    


    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCurrentUserAndAccount() {
        // Fetch the current logged-in user's details
        User currentUser = [SELECT Id, FirstName, LastName, Email, Phone, AccountId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        
        // Fetch the associated account based on AccountId from the user record
        Account userAccount;
        if (currentUser.AccountId != null) {
            userAccount = [SELECT Id, Name FROM Account WHERE Id = :currentUser.AccountId LIMIT 1];
        }
        
        // Return user and account information as a Map
        Map<String, Object> result = new Map<String, Object>();
        result.put('user', currentUser);
        result.put('account', userAccount);
        return result;
    }

}