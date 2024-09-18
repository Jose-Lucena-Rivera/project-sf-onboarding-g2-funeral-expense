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
            Origin='Funeral Expense Form'
        );
        
        Database.SaveResult sr;
        // Insert new Case. If it succeeds, send a true value; else send a false value.
        try {
            sr = Database.insert(c, true);

            if (sr.isSuccess()) {
                List<Case> cases = [SELECT id, caseNumber FROM Case WHERE id = :sr.getId() LIMIT 1];
            } else {
                // Handle the error case
                String errorMessage = 'The following errors have occurred:\n';
                for (Database.Error err : sr.getErrors()) {                   
                    errorMessage += err.getStatusCode() + ': ' + err.getMessage() + '\n';
                    errorMessage += 'Case fields that affected this error: ' + err.getFields() + '\n';
                }
                throw new AuraHandledException(errorMessage);
            }
        } catch (Exception e) {
            throw new AuraHandledException('Case was not inserted: ' + e.getMessage());
        }

        Case caseCreated;
        try {
            caseCreated = [SELECT id, caseNumber FROM Case WHERE id=:sr.getId() LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Case was not found: ' + e.getMessage());
        }

        return caseCreated.caseNumber;
    }

    
    // Define the mapping of branch towns to branches
    private static final Map<String, List<String>> branchTownMap = new Map<String, List<String>>{
        'Adjuntas' => new List<String>{'Adjuntas'},
        'Aguada' => new List<String>{'Aguada'},
        'Aguadilla' => new List<String>{'Aguadilla Mall', 'Aguadilla Sur', 'Ramey'},
        'Aguas Buenas' => new List<String>{'Aguas Buenas'},
        'Aibonito' => new List<String>{'Aibonito'},
        'Arecibo' => new List<String>{'Arecibo Aeropuerto', 'Arecibo Highway', 'Arecibo San Luis'},
        'Arroyo' => new List<String>{'Arroyo'},
        'Añasco' => new List<String>{'Añasco'},
        'Barceloneta' => new List<String>{'Barceloneta Prime Outlets', 'Cruce Davila'},
        'Barranquitas' => new List<String>{'Barranquitas'},
        'Bayamón' => new List<String>{'Bayamón Center', 'Bayamón Oeste', 'Lomas Verdes', 'Plaza Del Sol', 'Rexville Town Center', 'Rio Hondo', 'Santa Rosa'},
        'Cabo Rojo' => new List<String>{'Cabo Rojo La Hacienda'},
        'Caguas' => new List<String>{'Caguas Pueblo', 'Condadito', 'Las Catalinas', 'Plaza Centro II', 'Plaza Los Prados', 'RFW Bairoa', 'San Alfonso'},
        'Camuy' => new List<String>{'Camuy'},
        'Canóvanas' => new List<String>{'Canovanas Outlet'},
        'Carolina' => new List<String>{'Aeropuerto', 'Ave. 65 Infantería Shopping Center', 'Campo Rico', 'Carolina Highway', 'Isla Verde', 'Los Colobos Shopping Center', 'Parque Escorial', 'Plaza Carolina'},
        'Cayey' => new List<String>{'Cayey Montellano', 'Walmart Cayey'},
        'Ceiba' => new List<String>{'Ceiba'},
        'Ciales' => new List<String>{'Ciales'},
        'Cidra' => new List<String>{'Cidra'},
        'Coamo' => new List<String>{'Coamo'},
        'Comerio' => new List<String>{'Comerio'},
        'Corozal' => new List<String>{'Corozal'},
        'Culebra' => new List<String>{'Culebra'},
        'Dorado' => new List<String>{'Plaza Dorada'},
        'Fajardo' => new List<String>{'Fajardo'},
        'Florida' => new List<String>{'Florida'},
        'Guayama' => new List<String>{'Guayama Mall'},
        'Guayanilla' => new List<String>{'Guayanilla'},
        'Guaynabo' => new List<String>{'Buchanan', 'Exp Garden Hills', 'Guaynabo Las Cumbres', 'Plaza Guaynabo', 'San Patricio Gallery', 'San Patricio Mall'},
        'Gurabo' => new List<String>{'Gurabo'},
        'Hatillo' => new List<String>{'Hatillo'},
        'Hormigueros' => new List<String>{'Hormigueros'},
        'Humacao' => new List<String>{'Humacao Palma Real', 'Palmas Del Mar'},
        'Humacao Este' => new List<String>{'Humacao Este'},
        'Isabela' => new List<String>{'Isabela'},
        'Jayuya' => new List<String>{'Jayuya'},
        'Juana Díaz' => new List<String>{'Juana Díaz'},
        'Juncos' => new List<String>{'RFW Juncos'},
        'Lajas' => new List<String>{'Lajas'},
        'Lares' => new List<String>{'Lares'},
        'Las Marías' => new List<String>{'Las Marías'},
        'Las Piedras' => new List<String>{'Las Piedras'},
        'Loíza' => new List<String>{'Loíza'},
        'Luquillo' => new List<String>{'Luquillo'},
        'Manatí' => new List<String>{'Econo Manatí', 'Manatí Popular Center'},
        'Maricao' => new List<String>{'Maricao'},
        'Maunabo' => new List<String>{'Maunabo'},
        'Mayaguez' => new List<String>{'RUM', 'Mayagüez Mall Centro', 'Mayagüez Mall Sur', 'Mayagüez Suau', 'Mendez Vigo'},
        'Moca' => new List<String>{'Moca'},
        'Morovis' => new List<String>{'Morovis'},
        'Naguabo' => new List<String>{'Naguabo'},
        'Naranjito' => new List<String>{'El Mercado Plaza'},
        'Orocovis' => new List<String>{'Orocovis'},
        'Patillas' => new List<String>{'Patillas'},
        'Peñuelas' => new List<String>{'Peñuelas'},
        'Ponce' => new List<String>{'Centro Del Sur', 'Plaza Del Caribe', 'Ponce El Monte', 'Ponce Plaza', 'Ponce Rambla', 'Ponce Towne Center Norte', 'Ponce Towne Center Sur'},
        'Quebradillas' => new List<String>{'Quebradillas'},
        'Rincón' => new List<String>{'Rincón'},
        'Rio Grande' => new List<String>{'Rio Grande Pueblo'},
        'Rio Grande Pueblo' => new List<String>{'Plaza Del Yunque'},
        'Sabana Grande' => new List<String>{'Sabana Grande'},
        'Salinas' => new List<String>{'Salinas'},
        'San Germán' => new List<String>{'San Germán Plaza Del Oeste'},
        'San Juan' => new List<String>{'Altamira', 'Barbosa', 'Barrio Obrero', 'Calle Loíza', 'Caparra Center', 'Centro Medico', 'Condado Centro', 'Condado Gallery', 'Cupey Center', 'El Señorial Center', 'El Señorial Mall', 'Galería Paseos', 'Mall Of San Juan', 'Miramar', 'Montehiedra', 'Muñoz Rivera', 'Parada 22', 'Parada 26', 'Parada 34', 'Plaza Del Mercado', 'Plaza Las Américas', 'Popular Center', 'Puerto Nuevo', 'Reparto Metropolitano', 'San Francisco', 'San José', 'San Juan', 'San Juan Los Puertos', 'Universidad', 'Valencia Park', 'Walmart Parada 18'},
        'San Lorenzo' => new List<String>{'San Lorenzo'},
        'San Sebastian' => new List<String>{'San Sebastian'},
        'Santa Isabel' => new List<String>{'Santa Isabel'},
        'Toa Alta' => new List<String>{'Toa Alta'},
        'Toa Baja' => new List<String>{'Levittown', 'Toa Baja'},
        'Trujillo Alto' => new List<String>{'Trujillo Alto', 'Trujillo Alto Shopping'},
        'Utuado' => new List<String>{'Utuado'},
        'Vega Alta' => new List<String>{'Vega Alta'},
        'Vega Baja' => new List<String>{'Vega Baja'},
        'Vieques' => new List<String>{'Vieques'},
        'Villalba' => new List<String>{'Villalba'},
        'Yabucoa' => new List<String>{'Yabucoa'},
        'Yauco' => new List<String>{'Yauco Plaza', 'Yauco Pueblo'}
    };
    
    @AuraEnabled(cacheable=true)
    public static List<String> getBranchTowns() {
        // Fetch all available Branch Towns dynamically
        Schema.DescribeFieldResult controllingFieldResult = Case.Branch_Town__c.getDescribe();
        List<Schema.PicklistEntry> controllingPicklistValues = controllingFieldResult.getPicklistValues();

        List<String> branchTowns = new List<String>();
        for (Schema.PicklistEntry entry : controllingPicklistValues) {
            if (entry.isActive()) {
                branchTowns.add(entry.getLabel());
            }
        }
        return branchTowns;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getDependentBranchNames(String controllingFieldValue) {
        // If controllingFieldValue is an empty string, return all branches without filtering
        if (String.isEmpty(controllingFieldValue)) {
            List<String> allBranches = new List<String>();

            // Iterate over all the values in the map and add each branch to the allBranches list
            for (List<String> branches : branchTownMap.values()) {
                allBranches.addAll(branches);
            }

            return allBranches;
        }

        // Return the branches corresponding to the selected Branch Town
        if (branchTownMap.containsKey(controllingFieldValue)) {
            return branchTownMap.get(controllingFieldValue);
        } else {
            return new List<String>();
        }
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

    @AuraEnabled(cacheable=true)
    public static List<Case> getUsersCases(){
        // Map<String, Object> result = getCurrentUserAndAccount();
        // Account acc = (Account)result.get('account');
        // Fetch the current logged-in user's details
        User currentUser = [SELECT Id, AccountId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        
        try {
            List<Case> cases = [SELECT id, caseNumber, status, accountId FROM Case WHERE accountId=:currentUser.AccountId];
            return cases;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}