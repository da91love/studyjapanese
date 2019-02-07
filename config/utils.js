/**
 * utility function for server side node.js script
 *
 */

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

exports.isEmpty = function(value) {
    if(value == null){
        return true;
    } else {
        value = value.replaceAll(" ", "");
        if(value.length == 0) {
            return true;
        }
    }
    return false;
};

exports.replaceAll = function(text, target, replacement) {
    return text.split(target).join(replacement);
};

exports.escapeGetParam= function(text) {
    var textEsc = "";
    textEsc = text.replaceAll("+", "");
    textEsc = textEsc.replaceAll("&", "");
    return textEsc;
};
