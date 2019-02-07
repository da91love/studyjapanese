/*
 *
 */

var SqlString = require('sqlstring');
var orm = require('../orm');



exports.select_kanji_by_level = function(qParams){
    var stmt = {};
    var queryParsed = SqlString.format('SELECT * FROM char_map');
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "select_kanji_by_level";
    return stmt;
};



