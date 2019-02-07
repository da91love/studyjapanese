//*
module.exports = function (app) {


    //* library
    var route = require('express').Router();
    var jsonfile = require('jsonfile');


    //* custom module
    var orm = require("../config/orm");
    var utils = require("../config/utils");


    //* mapper
    var charMapper = require("../config/sql/char-mapper");





    route.post("/getCharMap", function (req, res, next) {
        var path = "./config/data/char-map.json";
        var charMap = jsonfile.readFileSync(path);
        res.send(charMap);

    });




    /* don't use DB
    route.post("/getCharMap", function (req, res, next) {
        var sql_select_charMap = charMapper.select_charMap();

        function queryCallback(resultData) {
            res.json(resultData);
        }

        orm.exeQuery(sql_select_charMap, queryCallback);
    });
    //*/
    return route;
};
//*/


//module.exports = route;