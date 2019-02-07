/**
 * utility function for client side javascript
 *
 */

var util = util || {};

util.i18nFileName = 'messages';
util.isI18nLoaded = false;
util.spinner = null;
util.spinnerTarget = null;
util.opts = {
    lines : 11, // The number of lines to draw
    length : 8, // The length of each line
    width : 4, // The line thickness
    radius : 8, // The radius of the inner circle
    corners : 1, // Corner roundness (0..1)
    rotate : 0, // The rotation offset
    direction : 1, // 1: clockwise, -1: counterclockwise
    color : '#000', // #rgb or #rrggbb or array of colors
    speed : 1, // Rounds per second
    trail : 60, // Afterglow percentage
    shadow : true, // Whether to render a shadow
    hwaccel : false, // Whether to use hardware acceleration
    className : 'spinner', // The CSS class to assign to the spinner
    zIndex : 2e9, // The z-index (defaults to 2000000000)
    top : 'auto', // Top position relative to parent in px
    left : 'auto' // Left position relative to parent in px
};

util.removeByValue = function(arr, value) {
    for ( var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
            return i;
        }
    }
};

util.getUrlParam = function(paramName) {
    var results = new RegExp('[\\?&]' + paramName + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};

util.debugObject = function(arr, level) {
    var dumped_text = "";
    if (!level)
        level = 0;

    // The padding given at the beginning of the line.
    var level_padding = "";
    for ( var j = 0; j < level + 1; j++)
        level_padding += "    ";

    if (typeof (arr) == 'object') { // Array/Hashes/Objects
        for ( var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') { // If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += util.debugObject(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { // Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
};

util.goToURL = function(url) {
    window.location = "/view/view.jsp?path=" + url;
};

util.Map = function() {
    this.map = {};
};

util.Map.prototype = {
    put : function(key, value) {
        this.map[key] = value;
    },
    get : function(key) {
        return this.map[key];
    },
    containsKey : function(key) {
        return key in this.map;
    },
    containsValue : function(value) {
        for ( var prop in this.map) {
            if (this.map[prop] == value)
                return true;
        }
        return false;
    },
    isEmpty : function(key) {
        return (this.size() == 0);
    },
    clear : function() {
        for ( var prop in this.map) {
            delete this.map[prop];
        }
    },
    remove : function(key) {
        delete this.map[key];
    },
    keys : function() {
        var keys = [];
        for ( var prop in this.map) {
            keys.push(prop);
        }
        return keys;
    },
    values : function() {
        var values = [];
        for ( var prop in this.map) {
            values.push(this.map[prop]);
        }
        return values;
    },
    size : function() {
        var count = 0;
        for ( var prop in this.map) {
            count++;
        }
        return count;
    }
};

util.loadI18n = function(lang) {
    jQuery.i18n.properties({
        name : util.i18nFileName,
        path : '/resources/properties/',
        mode : 'map',
        language : lang,
        callback : function() {
            util.isI18nLoaded = true;
        }
    });
};

util.i18n = function(id, arg1, arg2, arg3, arg4) {
    if (!util.isI18nLoaded) {
        util.error("i18n data not loaded");
        return id;
    }
    return jQuery.i18n.prop(id, arg1, [arg2, arg3, arg4]);
};

util.modifyDateFormat = function(date) {
    date = date.replace(/-/gi, "");
    date = date.replace(/ /gi, "");
    date = date.replace(/:/gi, "");
    return date;
};

// REPLACE VALUE ex) replace_value("2009-09-11","-","");  -> 20090911
util.replaceValue = function(targetStr, searchStr, replaceStr) {
    if (targetStr === null || searchStr === null || replaceStr === null)
        return "";

    var tmpStr = "";
    var tlen = targetStr.length;
    var slen = searchStr.length;
    var i = 0;
    var j = 0;

    while (i < tlen - slen + 1) {
        j = i + slen;

        if (targetStr.substring(i, j) == searchStr) {
            tmpStr += replaceStr;
            i += slen;
        } else {
            tmpStr += targetStr.substring(i, i + 1);
            i++;
        }
    }

    tmpStr += targetStr.substring(i);

    return tmpStr;
};

//DEFAULT SEARCH DATE
util.getDefaultDate = function(dateType, loadDt) {

    if (typeof loadDt == "undefined") {
        loadDt = new Date();
    } else {
        var dateStr = loadDt;
        var a = dateStr.split(" ");
        var d = a[0].split("-");
        loadDt = new Date(d[0], (d[1] - 1), d[2]);
    }

    var resultDate = "";

    if (dateType == "startDate") { // YYYY-MM-DD hh:mm , loadDt - 12 minutes
        resultDate = getTime(new Date(Date.parse(loadDt) - 1000 * 12 * 60));

    } else if (dateType == "endDate") { // YYYY-MM-DD hh:mm , loadDt + 3 minutes
        resultDate = getTime(new Date(Date.parse(loadDt) + 1000 * 3 * 60));

    } else if (dateType == "resubmitStartDate") { // YYYY-MM-DD hh:mm , loadDt - 55 minutes
        resultDate = getTime(new Date(Date.parse(loadDt) - 1000 * 55 * 60));

    } else if (dateType == "resubmitEndDate") { // YYYY-MM-DD hh:mm , loadDt + 5 minutes
        resultDate = getTime(new Date(Date.parse(loadDt) + 1000 * 5 * 60));

    } else if (dateType == "todayStartDate") { // YYYY-MM-DD 00:00, loadDt
        resultDate = getDay(loadDt);
        resultDate = resultDate + "00:00";

    } else if (dateType == "today") { // YYYY-MM-DD, loadDt
        resultDate = getDay(loadDt);

    } else if (dateType == "now") { // YYYY-MM-DD hh:mm:ss, loadDt
        resultDate = getTimeStamp(loadDt);

    } else if (dateType == "resetEndDate") { // YYYY-MM-DD hh:mm , loadDt + 10Day
        resultDate = getTime(new Date(Date.parse(loadDt) + 1000 * 60 * 60 * 24 * 10));

    } else if (dateType == "resetStartDate") { // YYYY-MM-DD hh:mm , loadDt - 10Day
        resultDate = getTime(new Date(Date.parse(loadDt) - 1000 * 60 * 60 * 24 * 10));

    } else { // YYYY-MM-DD
        resultDate = getDay(loadDt);
    }

    function getDay(d) {
        var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2) + '-'
            + leadingZeros(d.getDate(), 2) + ' ';

        return s;
    }

    function getTime(d) {
        var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2) + '-'
            + leadingZeros(d.getDate(), 2) + ' ' +

            leadingZeros(d.getHours(), 2) + ':' + leadingZeros(d.getMinutes(), 2);

        return s;
    }

    function getTimeStamp(d) {
        var s = leadingZeros(d.getFullYear(), 4) + '-' + leadingZeros(d.getMonth() + 1, 2) + '-'
            + leadingZeros(d.getDate(), 2) + ' ' +

            leadingZeros(d.getHours(), 2) + ':' + leadingZeros(d.getMinutes(), 2) + ':'
            + leadingZeros(d.getSeconds(), 2);

        return s;
    }

    function leadingZeros(n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for ( var i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }

    return resultDate;
};

util.getDiffDay = function(startDate, endDate) {
    startDate = util.modifyDateFormat(startDate);
    endDate = util.modifyDateFormat(endDate);
    var diffDay = 0;
    var start_yyyy = startDate.substring(0, 4);
    var start_mm = startDate.substring(4, 6);
    var start_dd = startDate.substring(6, 8);

    var sDate = new Date(start_yyyy, start_mm - 1, start_dd);
    var end_yyyy = endDate.substring(0, 4);
    var end_mm = endDate.substring(4, 6);
    var end_dd = endDate.substring(6, 8);
    var eDate = new Date(end_yyyy, end_mm - 1, end_dd);

    diffDay = Math.ceil((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));

    return diffDay;
};

util.isValidTime = function(time) {

    time = util.modifyDateFormat(time);
    var year = time.substring(0, 4);
    var month = time.substring(4, 6); //Jan=0, Dec.=11
    var day = time.substring(6, 8);
    var hour = time.substring(8, 10);
    var min = time.substring(10, 12);

    if (isValidTimeformat(time)) {
        if (parseInt(year, 10) >= 1900 && isValidMonth(month) && isValidDay(year, month, day) && isValidHour(hour)
            && isValidMin(min)) {
            return true;
        }
    }

    function isValidMonth(mm) {
        var m = parseInt(mm, 10);
        return (m >= 1 && m <= 12);
    }

    function isValidDay(yyyy, mm, dd) {
        var m = parseInt(mm, 10) - 1;
        var d = parseInt(dd, 10);

        var end = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
            end[1] = 29;
        }

        return (d >= 1 && d <= end[m]);
    }

    function isValidHour(hh) {
        var h = parseInt(hh, 10);
        return (h >= 0 && h <= 23);
    }

    function isValidMin(mi) {
        var m = parseInt(mi, 10);
        return (m >= 0 && m <= 59);
    }

    function isValidTimeformat(time) {
        return (!isNaN(time) && time.length == 12);
    }

    return false;
};

util.validateEmail = function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    if (!re.test(value)) {
        return false;
    }
    return true;
};

util.validatePort = function(value) {
    var isValid = true;
    var portLength = value.length;
    if (portLength == 0 || portLength > 5) {
        isValid = false;
    }
    for ( var i = 0; i < portLength; i++) {
        if (value.substr(i, 1) < '0' || value.substr(i, 1) > '9') {
            isValid = false;
            break;
        }
    }
    var portNumber = Number(value);
    if (portNumber < 0 || portNumber > 65535) {
        isValid = false;
    }
    return isValid;
};

util.validateIp = function(value) {
    var isValid = true;
    var iplength = (value.split(/\./)).length;
    if (iplength == 4) {
        if (value.search(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) != -1) { // ip 4
            var myArray = value.split(/\./);
            if (parseInt(myArray[0], 10) > 255 || parseInt(myArray[1], 10) > 255 || parseInt(myArray[2], 10) > 255
                || parseInt(myArray[3], 10) > 255) {
                return false;
            }

            if (parseInt(myArray[0], 10) == 0 && parseInt(myArray[1], 10) == 0 && parseInt(myArray[2], 10) == 0
                && parseInt(myArray[3], 10) == 0) {
                return false;
            }
            isValid = true;
        } else {
            isValid = false;
        }
    } else if (iplength == 6) {
        if (value.search(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3}.\d{1,3}$/) != -1) { // ip 6
            var myArray2 = value.split(/\./);
            if (parseInt(myArray2[0], 10) > 255 || parseInt(myArray2[1], 10) > 255 || parseInt(myArray2[2], 10) > 255
                || parseInt(myArray2[3], 10) > 255 || parseInt(myArray2[4], 10) > 255
                || parseInt(myArray2[5], 10) > 255) {
                isValid = false;
            }
            if (parseInt(myArray2[0], 10) == 0 && parseInt(myArray2[1], 10) == 0 && parseInt(myArray2[2], 10) == 0
                && parseInt(myArray2[3], 10) == 0 && parseInt(myArray2[4], 10) == 0
                && parseInt(myArray2[5], 10) == 0) {
                isValid = false;
            }
            isValid = true;
        } else {
            isValid = false;
        }
    } else {
        isValid = false;
    }
    return isValid;
};

util.getByteLength = function(value) {
    return ~-encodeURI(value).split(/%..|./).length;
};

util.startProgressIndicator = function() {
    $('body')
        .append(
            '<div id="spin_modal_overlay" style="background: rgba(255,255,255, .5); background-color: #fff; opacity: 0.5; filter: alpha(opacity=50); -ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=50); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:'
            + (2e9 - 1) + '"/>');
    var spinElem = $("#spin_modal_overlay")[0];
    if (util.spinner == null) {
        util.spinner = new Spinner(util.opts).spin(spinElem);
    }
    util.spinner.spin(spinElem);
};

util.stopProgressIndicator = function() {
    util.spinner.stop();
    $("#spin_modal_overlay").remove();
};

util.openInterfaceIdDialog = function(callback) {
    var dialog = $("#dialog").dialog({
        title : "Search Interface ID",
        autoOpen : false,
        height : 500,
        width : 617,
        modal : true,
        buttons : {
            Close : function() {
                $(this).dialog("close");
            },
        },
    });
    dialog.load('/view/monitoring/searchPopupInterfaceId.jsp').data("callback", callback).dialog('open');
};

util.dialogCnt = 0;
util.alert = function(content, title, okHandler) {
    if (!content) {
        content = "";
    }
    var dialogId = "dialog-confirm" + util.dialogCnt++;
    var html = "";
    html += "<div id='" + dialogId + "' title=''>";
    html += "<p>";
    html += "<span class='ui-icon ui-icon-alert' style='float: left; margin: 0 7px 20px 0;'></span><div id='text_div'></div>";
    html += "</p>";
    html += "</div>";
    $("body").append(html);
    if (!title) {
        title = "Message from webpage";
    }
    $("#" + dialogId).attr("title", title);
    //	$("#dialog-confirm #icon").attr("class", "ui-icon ui-icon-alert");
    var textDiv = $("#" + dialogId + " > #text_div");
    content = content.replace(new RegExp('\r?\n', 'g'), '<br />');
    textDiv.html(content);
    $("#" + dialogId).dialog({
        resizable : false,
        height : 268,
        modal : true,
        //		autoOpen: false,
        buttons : {
            Ok : function() {
                $(this).dialog("close");
                if (okHandler) {
                    okHandler();
                }
            },
        },
        open : function(event, ui) {
            var dialogs = $('.ui-dialog:visible');
            if (dialogs.length > 1) {
                dialogs.each(function(i, e) {
                    if (i === 0) {
                        //	                   $(e).css('top', '0px');
                    } else {
                        var prevDialog = $(e).prevAll('.ui-dialog:visible');
                        $(e).css('top', parseInt(prevDialog.css('top')) + 20 + 'px');
                        $(e).css('left', parseInt(prevDialog.css('left')) + 20 + 'px');
                    }
                });
            }
        }

    });
    $("#" + dialogId).dialog("open");
};





util.getRandomNum = function(cnt){
    var rNum = [];
    for(var i = 0; i < cnt; i++){
        rNum.push(Math.floor(Math.random() * HIRA.length));
    }
    return rNum;
};
