/*
 *
 */

var SqlString = require('sqlstring');
var orm = require('../orm');

exports.insert_verification = function(qParams) {
    var stmt = {};
    var queryParsed = SqlString.format("INSERT INTO email_auth (`email`, `auth_key`, `expire_date`) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))", [qParams.email, qParams.hash]);
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_verification";
    return stmt;
};

exports.select_userById = function(qParams) {
    var stmt = {};
    var query = 'SELECT * FROM user where user_id = #{id}';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "select_userById";
    return stmt;
};

exports.select_authUser = function(qParams) {
    var stmt = {};
    var queryParsed = SqlString.format('SELECT * FROM user where user_id = ? and user_password = ?', [qParams.id, qParams.password]);
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "select_authUser";
    return stmt;
};

exports.insert_user= function(qParams){
    var stmt = {};
    var query = 'INSERT INTO user (`user_id`, `user_email`, `user_name`, `user_type`, `user_password`, `salt`, `auth_type`, `user_status`, `create_date`) ' +
                            'VALUES ( #{id}, #{email}, #{username}, #{userType}, #{password}, #{salt}, #{authType}, #{status}, NOW() )';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_user";
    return stmt;
};

exports.insert_facebookUser= function(qParams){
    var stmt = {};
    var query = 'INSERT INTO user (`user_id`, `user_email`, `auth_type`, `user_name`, `user_selfie`, `user_status`, `gender`) VALUES ( #{id}, #{email}, #{authType}, #{username}, #{photo}, #{status}, #{gender} )';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_facebookUser";
    return stmt;
};

exports.insert_googleUser= function(qParams){
    var stmt = {};
    var query = 'INSERT INTO user (`user_id`, `user_email`, `auth_type`, `user_name`, `user_selfie`, `user_status`, `gender`) VALUES ( #{id}, #{email}, #{authType}, #{username}, #{photo}, #{status}, #{gender} )';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_googleUser";
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

exports.insert_instagramUser= function(qParams){
    var stmt = {};
    var query = 'INSERT INTO user (`user_id`, `auth_type`, `user_name`, `user_status`) VALUES ( #{id}, #{authType}, #{username}, #{status})';
    stmt.query = orm.evalQuery(query, qParams);
    stmt.db = 'mtm_dev_jp';
    stmt.id = "insert_instagramUser";
    return stmt;
};

exports.select_emailAuth = function(qParams){
    var stmt = {};
    var queryParsed = SqlString.format('SELECT * FROM email_auth WHERE email = ? AND auth_key = ?', [qParams.email, qParams.key]);
    stmt.query = queryParsed;
    stmt.db = 'mtm_dev_jp';
    stmt.id = "select_emailAuth";
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
