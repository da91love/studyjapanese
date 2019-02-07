/*
 *
 */

var SqlString = require('sqlstring');
var orm = require('../orm');



exports.select_charMap = function(qParams){
    var stmt = {};
    var queryParsed = SqlString.format('SELECT * FROM char_map');
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "select_charMap";
    return stmt;
};






exports.insert_kakaoUser= function(qParams){
    var stmt = {};
    var query = 'INSERT INTO user (`user_id`, `auth_type`, `user_name`, `user_status`) VALUES ( #{id}, #{authType}, #{username}, #{status})';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_kakaoUser";
    return stmt;
};

exports.update_userStatus=function(qParams) {
    var stmt = {};
    var queryParsed = SqlString.format('UPDATE user SET `user_status` = ? WHERE user_email = ?', [qParams.status, qParams.email]);
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "update_userStatus";
    return stmt;
};





/********************** TEST **************************/
exports.test_pkCrush=function(qParams) {
    var stmt = {};
    var queryParsed = SqlString.format('INSERT INTO `dev_mtm`.`email_auth` (`id`, `email`,`auth_key`,`expire_date`) VALUES (`1`,`12`,`123`,now())');
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "test_pkCrush";
    return stmt;
};
