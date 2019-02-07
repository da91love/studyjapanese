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



    route.post("/getWordByLevel", function (req, res, next) {
        var level = req.body.level;
        var lang = req.body.lang;
        var path = "./config/data/word-n" + level + "-" + lang + ".json";
        var wordList = jsonfile.readFileSync(path);
        res.send(wordList);
    });






    return route;
};
//*/


//module.exports = route;