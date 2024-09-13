public with sharing class reCAPTCHAController {
    private static final String SECRET_KEY = '6Le2jEIqAAAAAHqvtL0O0YAcke0JgoUswcPUmd48';
    
    // @AuraEnabled
    // public static Boolean isReCAPTCHAValid(String tokenFromClient) {
    //     String RECAPTCHA_SERVICE_URL = 'https://www.google.com/recaptcha/api/siteverify';
    //     Http http = new Http();

    //     HttpRequest request = new HttpRequest();

    //     request.setEndpoint(RECAPTCHA_SERVICE_URL + '?secret=' + SECRET_KEY + '&response' + tokenFromClient);
    //     request.setMethod('POST');
    //     request.setHeader('Content-Length', '0');
    //     HttpResponse response = http.send(request);

    //     Map<String, Object> mapOfBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());

    //     Boolean success = (Boolean) mapOfBody.get('success');

    //     return success;
    // }

    

    // @AuraEnabled
    // public static ReCaptchaResponse verifyRecaptcha(String token) {
    //     HttpRequest req = new HttpRequest();
    //     req.setEndpoint('https://www.google.com/recaptcha/api/siteverify');
    //     req.setMethod('POST');
    //     req.setBody('secret=' + secretKey + '&response=' + token);
    //     req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
    //     Http http = new Http();
    //     HttpResponse res = http.send(req);
        
    //     if (res.getStatusCode() == 200) {
    //         Map<String, Object> jsonMap = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
    //         return new ReCaptchaResponse((Boolean) jsonMap.get('success'), (List<String>) jsonMap.get('error-codes'));
    //     } else {
    //         throw new AuraHandledException('Failed to verify reCAPTCHA');
    //     }
    // }

    // public class ReCaptchaResponse {
    //     @AuraEnabled public Boolean success;
    //     @AuraEnabled public List<String> errorCodes;
        
    //     public ReCaptchaResponse(Boolean success, List<String> errorCodes) {
    //         this.success = success;
    //         this.errorCodes = errorCodes;
    //     }
    // }

    
    
    @AuraEnabled
    public static Boolean isReCaptchaValid(String token) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:Recaptcha_NC&response=' + token);
        request.setMethod('POST');
        request.setHeader('Content-Length', '6000000');
        request.setHeader('Content-Encoding', 'gzip');
        HttpResponse response = http.send(request);
        Map<String, Object> mapOfBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        Boolean success = (Boolean) mapOfBody.get('success');
    
        return success;
    }
}