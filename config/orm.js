
var syncSql = require('sync-sql');
var mysql = require('mysql');



/*****************
 * configuration *
 *****************/


if ('production' == process.env['NODE_ENV']){
//** PRODUCT

    //* Asynchronous Database
    dbPoolInfo = {
        host :'mtmdevjp.c8ie9nznphfv.ap-northeast-1.rds.amazonaws.com',
        port : 3306,
        user : 'sangookyi01',
        password : '1q2w3e4r',
        database :'mtm_dev',
        connectionLimit : 100,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000
        //waitForConnections:true
    };

    var mtmDevPool = mysql.createPool(dbPoolInfo);

    //not used
    var authPool = mysql.createPool(dbPoolInfo);


    //* Synchronous Database
    dbInfo = {
        host :'mtmdevjp.c8ie9nznphfv.ap-northeast-1.rds.amazonaws.com',
        port : 3306,
        user : 'sangookyi01',
        password : '1q2w3e4r',
        database :'mtm_dev',
    };

    var SyncDB_mtm_dev = dbInfo;

    //not used
    var SyncDB_auth = dbInfo;

    var getSyncDB = function(dbName) {
        if(dbName == 'mtm_dev_jp') {
            return SyncDB_mtm_dev
        } else if(dbName == 'auth')  {
            return SyncDB_auth;
        } else {
            console.log("There is no schema of '" + dbName.db + "'.");
            return 0;
        }
    };

    var getDBPool = function(dbName) {
        if(dbName == 'mtm_dev_jp') {
            return mtmDevPool;
        } else if(dbName == 'auth')  {
            return authPool;
        } else {
            console.log("There is no schema of '" + dbName.db + "'.");
            return 0;
        }
    };

} else {
//** DEVELOPMENT

    //* Asynchronous Database
    dbPoolInfo = {
        host :'localhost',
        port : 3306,
        user : 'admin',
        password : '1234',
        database :'mtm_dev_jp',
        connectionLimit : 100,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000
        //waitForConnections:true
    };

    var mtmDevPool = mysql.createPool(dbPoolInfo);

    //not used
    var authPool = mysql.createPool(dbPoolInfo);


    //* Synchronous Database
    dbInfo = {
        host :'localhost',
        port : 3306,
        user : 'admin',
        password : '1234',
        database :'mtm_dev_jp'
    };

    var SyncDB_mtm_dev = dbInfo;

    //not used
    var SyncDB_auth = dbInfo;

    var getSyncDB = function(dbName) {
        if(dbName == 'mtm_dev_jp') {
            return SyncDB_mtm_dev
        } else if(dbName == 'auth')  {
            return SyncDB_auth;
        } else {
            console.log("There is no schema of '" + dbName.db + "'.");
            return 0;
        }
    };

    var getDBPool = function(dbName) {
        if(dbName == 'mtm_dev_jp') {
            return mtmDevPool;
        } else if(dbName == 'auth')  {
            return authPool;
        } else {
            console.log("There is no schema of '" + dbName.db + "'.");
            return 0;
        }
    };
}



/***********
 * Execute *
 ***********/

exports.exeQuerySync = function(sqlSource) {
    console.log("[SQL Statement:"+sqlSource.id+"] => " + sqlSource.query);

    var dbInfo = getSyncDB(sqlSource.db);
    return syncSql.mysql(dbPoolInfo, sqlSource.query);
};

exports.exeQuery = function (sqlSource, queryCallback) {
    console.log("[SQL Statement:" + sqlSource.id + "] => " + sqlSource.query);

    var pool = getDBPool(sqlSource.db);
    pool.getConnection(function (err, connection) {
        connection.query(sqlSource.query, function (err, data) {
            if (err) {
                connection.release();
                throw err;
            }
            connection.release();
            console.log('[Query Result]: ', data);
            queryCallback(data);
        });
    });
};


String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

exports.evalQuery = function(query, qParams) {
    for (var key in qParams) {
        var rKey = "#{" + key + "}" ;
        var rValue = "'" + qParams[key] + "'";
        query = query.replaceAll(rKey, rValue);
        //query = query.replaceAll(rKey, rValue).replaceAll("\\r", "" ).replaceAll("\\n", "" );
    }
    return query;
};


