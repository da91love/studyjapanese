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


    route.get("/test_pkCrush", function (req, res, next) {
        console.log("pk crush");

        var sql_test_pkCrush = userMapper.test_pkCrush();
        function queryCallback(resultData) {
            console.log(resultData);
        }
        orm.exeQuery(sql_test_pkCrush, queryCallback);
    });


    route.post("/getWord", function (req, res, next) {
        request(req.body.url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
            res.send(body);
        });
    });

    route.all("/makeExToKo", function (req, res, next) {
        var path = "./config/data/kanji-ko_back.json";
        var kanjiList = jsonfile.readFileSync(path);
        var newKanjiList = [];

        for (var i in kanjiList) {
            var ex = [];
            var item = kanjiList[i]["ex-onyomi"];
            for (var ii in item) {
                var newItem = {};
                if (item[ii]["onyomi-word"] == "") {
                    kanjiList[i]["ex-onyomi"] = [];
                } else {
                    newItem["ex-word"] = item[ii]["onyomi-word"] + "(" + item[ii]["onyomi-pron"] + ")";
                    newItem["ex-mean"] = item[ii]["onyomi-mean"];
                    ex.push(newItem)
                }
            }
            item = kanjiList[i]["ex-kunyomi"];
            for (var ii in item) {
                var newItem = {};
                if (item[ii]["kunyomi-word"] == "") {
                    kanjiList[i]["ex-kunyomi"] = [];
                } else {
                    newItem["ex-word"] = item[ii]["kunyomi-word"] + " (" + item[ii]["kunyomi-pron"] + ")";
                    newItem["ex-mean"] = item[ii]["kunyomi-mean"];
                    ex.push(newItem)
                }

            }
            kanjiList[i]["ex"] = ex
        }

        var resultPath ='./config/data/kanji-ko-new.json';
        var myJSON = JSON.stringify(kanjiList);
        fs.writeFile(resultPath, myJSON, function() {
            console.log('process is complete');
        });

    });







/* not used. for ref
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
//*/











    return route;
};