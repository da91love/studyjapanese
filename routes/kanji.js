//*
module.exports = function (app) {


    //* library
    var route = require('express').Router();
    var request = require('request');
    var jsonfile = require('jsonfile');

    //* custom module
    var orm = require("../config/orm");
    var utils = require("../config/utils");

    //* mapper
    //var wordMapper = require("../config/sql/word-mapper");



    route.post("/getKanjiByLevel", function (req, res, next) {
        var level = "n" + req.body.level;
        //var level = "n1";
        var lang = req.body.lang;
        var path = "./config/data/kanji-" + lang + ".json";
        var kanjiList = jsonfile.readFileSync(path);
        var kanjiListByLevel = [];

        for (var i in kanjiList) {
            var item = kanjiList[i];

            if (level == item["level"]) {
                kanjiListByLevel.push(item)
            }
        }
        res.send(kanjiListByLevel);
    });






    return route;
};
//*/


//module.exports = route;