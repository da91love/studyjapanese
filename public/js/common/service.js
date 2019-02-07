/* Usage example in view

 function successHandler(resultData){
 // ....
 }
 service.serviceName(param, successHandler);

 */

var service = service || {};

var conn_url = window.location.href;
var HOST = "";

if(conn_url.indexOf("www") == -1){
    HOST = "http://studyjp.ga";
} else {
    HOST = "http://www.studyjp.ga";
}
HOST = "http://localhost:3333";


service.serviceErrorHandler = function(jqXHR, textStatus, errorThrown) {
    alert(JSON.stringify(jqXHR) + "\n\n" + textStatus + " : " + errorThrown);
};

service.callService = function(url, dataType, params, isAsnc, successHandler, errorHandler) {
    $.ajax({
        url : url,
        data : JSON.stringify(params),
        dataType : dataType,
        type : 'POST',
        contentType : 'application/' + dataType,
        context : this,
        async : isAsnc,
        success : successHandler,
        error : errorHandler
    });
};




/**********
 * COMMON *
 * ********/
service.i18n = function(params, successHandler) {
    service.callService(HOST + "/i18n", 'json',
        params, isAsnc = false, successHandler, service.serviceErrorHandler);
};




/***********
 * CharMap *
 **********/
service.getCharMap = function(params, successHandler) {
    service.callService(HOST + "/char/getCharMap", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};


/********
 * Word *
 ********/
service.getWordByLevel = function(params, successHandler) {
    service.callService(HOST + "/word/getWordByLevel", 'json',
        params, isAsnc = false, successHandler, service.serviceErrorHandler);
};







/*********
 * Kanji *
 *********/
service.getKanjiByLevel = function(params, successHandler) {
    service.callService(HOST + "/kanji/getKanjiByLevel", 'json',
        params, isAsnc = false, successHandler, service.serviceErrorHandler);
};







/*************
 * Collector *
 *************/
service.collectWord = function(params, successHandler, errorHandler) {
    service.callService(HOST + "/collect/getWord", 'json',
        params, isAsnc = true, successHandler, errorHandler);
};






/*********
 * LOGIN *
 * *******/
service.login = function(params, successHandler) {
    service.callService(HOST + "/auth/login", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};

service.logout= function(params, successHandler) {
    service.callService(HOST + "/route/logout", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};
service.welcome= function(params, successHandler) {
    service.callService(HOST + "/route/welcome", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};

service.register = function(params, successHandler) {
    service.callService(HOST + "/auth/register", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};

service.registerWithEmail = function(params, successHandler) {
    service.callService(HOST + "/auth/registerWithEmail", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};


service.createUser = function(params, successHandler) {
    service.callService(HOST + "/user/createUser", 'json',
        params, isAsnc = true, successHandler, service.serviceErrorHandler);
};



