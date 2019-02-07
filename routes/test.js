module.exports = function (app, preFilter) {

    //* library
    var route = require('express').Router();
    var request = require('request');
    var jsonfile = require('jsonfile');
    var fs = require('fs');




    //* custom module
    var orm = require("../config/orm");
    var utils = require("../config/utils");





    //* mapper
    //var wordMapper = require("../config/sql/word-mapper");



    // route.get("/unexpectedError", function (req, res, next) {
    //     var fs = require('fs');
    //
    //     fs.readFile('somefile.txt', function (err, data) {
    //         if (err) throw err;
    //         console.log(data);
    //     });
    // });



    // route.get("/test_pkCrush", function (req, res, next) {
    //     console.log("pk crush");
    //
    //     var sql_test_pkCrush = userMapper.test_pkCrush();
    //     function queryCallback(resultData) {
    //         console.log(resultData);
    //     }
    //     orm.exeQuery(sql_test_pkCrush, queryCallback);
    // });


    // route.get("/maxExCnt", function (req, res, next) {
    //
    //     var path = "./config/data/kanji-en.json";
    //     var kanjiList = jsonfile.readFileSync(path);
    //
    //     var maxSize = 0;
    //     for(var i in kanjiList){
    //         var ex = kanjiList[i]["ex"];
    //         if(ex){
    //             if(ex.length){
    //                 var leng = ex.length;
    //                 if(leng > maxSize){
    //                     maxSize = leng;
    //                 }
    //             }
    //         }
    //     }
    //     console.log(maxSize);
    //
    // });








String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

var getIdxArr = function(str, delimiter) {
    var idxArr = [];
    for (var i = 0; i < str.length; i++) {
        if (str[i] === "delimiter") {
            idxArr.push(i);
        }
    }
    return idxArr;
};


var getReplaced = function(query) {
    var qParams = [];
    var startIdxArr = getIdxArr(str, "#{");
    var endIdxArr = getIdxArr(str, "}");
    for (var i in startIdxArr) {
        var startIdx = startIdxArr[i];
        var endIdx = endIdxArr[i];
        var value = str.substring(startIdx + 1, endIdx);
        qParams.push(value);
    }
    return qParams;
};

var getMatchedValue = function(key, qParams) {
    var itemMatched = qParams.filter(function(itemList) {
        return itemList.key == key;
    });
    return itemMatched[0].value;
};


var evalParameters = function(query, replaced, qParams) {
    for (var i in replaced) {
        var textToReplace = replaced[i];
        var value = getMatchedValue(textToReplace, qParams);
        textToReplace = "#{" + textToReplace + "}";
        query.replaceAll(textToReplace, "'" + value + "'");
    }
    return query;
};












    return route;
};