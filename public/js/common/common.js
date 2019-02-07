var comm = comm || {};



/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function (a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);



var i18n_MSG = {};
var DEFAULT_LANG = "ko";
var TITLE = "Open Trainer!";

function initCustomJs(){
    init_sparklines();
    init_flot_chart();
    //init_sidebar();
    init_wysiwyg();
    init_InputMask();
    init_JQVmap();
    init_cropper();
    init_knob();
    init_IonRangeSlider();
    init_ColorPicker();
    init_TagsInput();
    init_parsley();
    init_daterangepicker();
    init_daterangepicker_right();
    init_daterangepicker_single_call();
    init_daterangepicker_reservation();
    init_SmartWizard();
    init_EasyPieChart();
    init_charts();
    init_echarts();
    init_morris_charts();
    init_skycons();
    init_select2();
    init_validator();
    init_DataTables();
    init_chart_doughnut();
    init_gauge();
    init_PNotify();
    init_starrr();
    init_calendar();
    init_compose();
    init_CustomNotification();
    //init_autosize();
    //init_autocomplete();
}


function reloadPageContents(pageName) {
    //History.pushState(null, null, "#" + pageName);
    comm.applyI18n("container");
    initCustomJs();
    $.getScript( "/js/views/" + pageName + ".js");
}

comm.loadPage = function(pageName){
    var tmpl = new LoadTemplate('page-contents', pageName);
    tmpl.create(function(){
        reloadPageContents(pageName);
    });
};

comm.loadWelcomePage = function() {
    var welcomePage = "record";
    var tmpl = new LoadTemplate('page-contents', welcomePage);
    tmpl.create(function() {
        reloadPageContents(welcomePage);
        // History.replaceState(null, null, "#");
        // comm.applyI18n("container");
        // initCustomJs();
        // $.getScript( "/js/views/" + welcomePage + ".js");
    });
};

comm.setTitle = function(){
    $('title').text(TITLE);
};

comm.setI18nMessage = function(lang){
    var params = {};
    params.lang = lang;

    function successHandler(resultData) {
        i18n_MSG = resultData;
    }
    service.i18n(params, successHandler);
};

comm.applyI18n = function(selector) {
    var target = selector;
    $(target + ' *[i18n]').each(function() {
        var i18nId = $(this).attr('i18n');
        if (i18nId == "") {
            return;
        }
        var msg = i18n_MSG[i18nId];
        var tagName = $(this).get(0).tagName;

        if(tagName == "A" || tagName == "LI" || tagName == "DIV" /*|| tagName == "LABEL"*/ || tagName == "OPTION" || tagName == "P" || tagName == "B" || tagName == "BUTTON"
            || tagName == "SPAN" || tagName == "H1" || tagName == "H2" || tagName == "H3" || tagName == "H4" || tagName == "H5") {
            $(this).text(msg);
        } else if (tagName == "INPUT") {
            //$(this).val(msg);
            $(this).append(msg);
        } else if (tagName == "LABEL") {
            if($(this).hasClass('radio-inline')) {
                $(this).append(msg);
            } else {
                $(this).text(msg);
            }
        }
    });
};

comm.swal = function(type, i18nId ){
    var text = i18n_MSG[i18nId];
    swal({
        type: type,
        text: text
    })
};

comm.makeFormData = function(elementId) {
    var formData = {};
    var target = "";
    if (elementId) {
        target = "#" + elementId;
    }
    $(target + ' *[name]').each(function() {
        var obj = $(this);
        var value = "";
        var name = obj.attr('name');
        var tagName = obj.get(0).tagName;
        if (tagName == "INPUT") {
            value = obj.val();
            formData[name] = value;
        } else if(tagName == "BUTTON"){
            if(obj.hasClass("active")){
                value = obj.attr("value");
                formData[name] = value;
            }
        }
    });
    return formData;
};

comm.clearFormData = function(elementId) {
    var target = "";
    if (elementId) {
        target = "#" + elementId;
    }
    $(target).find('*').each(function() {
        var tagName = $(this).get(0).tagName;
        if (tagName == "INPUT") {
            $(this).val("");
        } else if(tagName == "BUTTON") {
        $(this).removeClass('active');
        }
    });
};

comm.popMsg = function(i18nKey, type, callback) {
    switch (type){
        case 'D':
            type = BootstrapDialog.TYPE_DEFAULT;
            break;
        case 'I':
            type = BootstrapDialog.TYPE_INFO;
            break;
        case 'P':
            type = BootstrapDialog.TYPE_PRIMARY;
                break;
        case 'S':
            type = BootstrapDialog.TYPE_SUCCESS;
                break;
        case 'W':
            type = BootstrapDialog.TYPE_WARNING;
                break;
        case 'E':
            type = BootstrapDialog.TYPE_DANGER;
                break;
        default:
            type = BootstrapDialog.TYPE_DEFAULT;
    }

    BootstrapDialog.alert({
        size: BootstrapDialog.SIZE_SMALL,
        type: type,
        message: i18n_MSG[i18nKey],
        callback: callback
    });
};






/*****************
 * EVENT HANDLER *
 *****************/
$(".btn-radio .btn").click(function () {
    $(this).siblings('button').removeClass('active');
    $(this).addClass('active');
});



$(".sns").click(function () {
    var name = $(this).attr("name");
    var url = "http://www.studyjp.ga/";
    var txt = "Free Japanese Study Site: ";
    var isMobile = jQuery.browser.mobile;
    sendSns(name, isMobile, url, txt)
});

function sendSns(snsName, isMobile, url, txt) {
    var socialSource;
    var _url = encodeURIComponent(url);
    var _txt = encodeURIComponent(txt);
    var _br = encodeURIComponent('\r\n');

    switch (snsName) {
        case 'facebook':
            socialSource = {
                url: 'http://www.facebook.com/sharer/sharer.php?u=' + _url
            };
            break;
        case 'google':
            socialSource = {

                url: 'https://plus.google.com/share?url='+ _url
            };
            break;
        case 'twitter':
            socialSource = {
                url: 'https://twitter.com/share?text=' + _txt + '&url=' + _url
            };
            break;
        case 'linkedin':
            socialSource = {
                url: 'https://www.linkedin.com/shareArticle?mini=true&url=' + _url + '&title' + _txt
            };
            break;
        case 'pinterest':
            socialSource = {
                url: 'https://pinterest.com/pin/create/button/?url=' + _url + "&description=" + _txt
            };
            break;
        case 'line':
            socialSource = {
                url: "http://line.me/R/msg/text/?" + _txt
            };
            break;
        default:
            alert('The SNS you try is Not supported.');
            return false;
    }
    window.open(socialSource.url);


    /* distinct Mobile device or Web browser
     if(isMobile){
     if (navigator.userAgent.match(/android/i)) {
     //** Android
     setTimeout(function () {
     location.href = 'intent://' + o.param + '#Intent;' + o.g_proto + ';end'
     }, 100);
     } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
     //** Apple
     setTimeout(function () {
     location.href = o.a_store;
     }, 200);
     setTimeout(function () {
     location.href = o.a_proto + o.param
     }, 100);
     } else {
     alert('The function is available at only mobile devices.');
     }
     } else {

     }
     //*/

}

