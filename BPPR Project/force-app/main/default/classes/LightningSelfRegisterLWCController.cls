global with sharing class LightningSelfRegisterLWCController {
    // Check is password is the same
    private static boolean isValidPassword(String password, String confirmPassword) {
        return password == confirmPassword;
    }
    
    private static boolean siteAsContainerEnabled(String communityUrl) {
        Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(communityUrl,'');
        return authConfig.isCommunityUsingSiteAsContainer();
    }
    
    // Validate password
    private static void validatePassword(User u, String password, String confirmPassword) {
        if(!Test.isRunningTest()) {
        Site.validatePassword(u, password, confirmPassword);
        }
        return;
    }
    
    // Register function
    @AuraEnabled
    public static String selfRegister(String firstname, String lastname, String email, String phone, Date dateOfBirth, String ssn, String password, String confirmPassword, String accountId, String regConfirmUrl, String startUrl) {
        Savepoint sp = null;
        try {
            sp = Database.setSavepoint();
            
            if (lastname == null || String.isEmpty(lastname)) {
                return Label.Site.lastname_is_required;
            }
            
            if (email == null || String.isEmpty(email)) {
                return Label.Site.email_is_required;
            }
            
            User u = new User();
            u.Username = email;
            u.put('Email',email);
            
            u.FirstName = firstname;
            u.LastName = lastname;
            
            u.put('Phone', phone);
            u.put('Date_of_Birth__c', dateOfBirth);
            u.put('SSN__c', ssn);

            String networkId = Network.getNetworkId();

            // If using site to host the community the user should not hit s1 after logging in from mobile.
            if(networkId != null && siteAsContainerEnabled(Network.getLoginUrl(networkId))) {
                u.put('UserPreferencesHideS1BrowserUI',true);
            }
            
            String nickname = ((firstname != null && firstname.length() > 0) ? firstname.substring(0,1) : '' ) + lastname.substring(0,1);
            nickname += String.valueOf(Crypto.getRandomInteger()).substring(1,7);
            u.put('CommunityNickname', nickname);
            
            // lastName is a required field on user, but if it isn't specified, we'll default it to the username
            String userId = Site.createPortalUser(u, accountId, password);
            return null;
        }
        catch (Exception ex) {
            Database.rollback(sp);
            return ex.getMessage();            
        }
    }
    
    @AuraEnabled
    global static String setExperienceId(String expId) {
        // Return null if there is no error, else it will return the error message 
        try {
            if (expId != null) {
                Site.setExperienceId(expId);   
            }
            return null; 
        } catch (Exception ex) {
            return ex.getMessage();            
        }        
    }
}