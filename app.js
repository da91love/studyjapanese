process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var authKey = require('./config/authKey');
//var mergeJson = require('json-merge');
var jsonfile = require('jsonfile');
var utils = require("./config/utils");
var mailer = require("./config/mailer");

var app = express();
app.locals.appTitle = 'mtm_dev_jp';


/************************
 * Configuration by ENV *
 ************************/
var ENV = app.get('env');

//** Express.js Config
app.set('port', process.env.PORT || 3333);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//** Express.js middleware Config
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('SDF#KHJBNV$-DFG&K^%U-UKIGWSSDB-J@SHDF'));


//** Database Config
var storeInfo = {};
if ('production' == ENV){
    console.log("#### The app is loaded as a production mode. ####");
    storeInfo = {
        host:'mtmdevjp.c8ie9nznphfv.ap-northeast-1.rds.amazonaws.com',
        port:3306,
        user:'sangookyi01',
        password:'1q2w3e4r',
        database:'mtm_dev'
    }
} else { //development
    console.log("#### The app is loaded as a development mode. ####");
    storeInfo = {
        host:'localhost',
        port:3306,
        user:'root',
        password:'kk5dd0ss2',
        database:'mtm_dev_jp'
    };
}

//** Session Config
app.use(session({
    secret: '2C774A-D649-4DGRD5-46E296EF984F',
    resave: false,           // 세션 ID를 접속할때마다 새로 발급하지 않는다.
    saveUninitialized: true, // 실제로 세션이 사용되기 전까지 ID를 발급하지 마라
    store: new MySQLStore(storeInfo)
}));
app.use(methodOverride());


//** Static Resource Config
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));



/*****************
 * Preprocessing *
 *****************/

function preFilter(req, res, next) {
    //* Language
    var lang = req.headers["accept-language"];
    lang = getLanguage(lang);
    res.cookie("browser_lang", lang);

    //* Authorise
    // if(req.session.isAuthenticated) {
    //     return next();
    // } else {
    //     res.status(403).render('error/403');
    // }


    return next();
}

function getMessage(lang) {
    var path = "./config/i18n/message_" + lang + ".json";
    return jsonfile.readFileSync(path);
}

function getLanguage(lang) {
    var language = lang.split(",")[0];

    if(language == "ko" || language == "ko-KR" ) {
        language = "ko";
    } else {
        language = "en";
    }
    return language;
}




/*********************
 * Custom Middleware *
 *********************/
var auth = require("./routes/auth")(app, preFilter);
var characterMap = require("./routes/characterMap")(app);
var word = require("./routes/word")(app);
var kanji = require("./routes/kanji")(app);
var collector = require("./routes/collector")(app);
var test = require("./routes/test")(app);


app.use("/auth", auth);
app.use("/char", characterMap);
app.use("/word", word);
app.use("/kanji", kanji);
app.use("/test", test);
app.use("/collect", collector);





/*********
 * ROUTES
 *********/

app.get('/register', function(req, res, next) {
    res.render("auth/register");
});

app.post('/i18n', function(req, res, next){
    var lang = req.body.lang;

    if (utils.isEmpty(lang)){
        lang = req.headers["accept-language"];
        lang = getLanguage(lang);
    }
    var msg = getMessage(lang);
    res.json(msg);
});



/**********
 * mtm_jp *
 **********/
app.get('/', preFilter, function(req, res, next) {
    res.render("index");
});

app.get('/about', function(req, res, next) {
    res.render("about");
});

app.get('/char', function(req, res, next) {
    res.render("charMap/char-map");
});

app.get('/word', function(req, res, next) {
    res.render("word/word");
});

app.get('/kanji', function(req, res, next) {
    res.render("kanji/kanji");
});

app.get('/collect', function(req, res, next) {
    res.render("collector");
});








/*********
 * ERROR *
 *********/
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).render('error/500', {error: err});
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500).render('error/500', {error: err});
}

app.use(function (req, res) {
    res.status(404).render('error/404');
});
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

/* distinct environment
if ('development' == app.get('env')) {
    app.use(errorHandler);
}
//*/

process.on('uncaughtException', function (err) {
    //예상치 못한 예외 처리
    console.log('[UncaughtException]: ' + err.message);
    console.error(err.stack);

    //메일 또는 문자로 관리자에게 알림
    // var mailOptions = {
    //     from: 'kdcmobility@gmail.com>',
    //     to: 'estta39@gmail.com',
    //     subject: '[Open Study Japanese] Uncaught Error Occurred!!',
    //     text: err.message + "\n",
    //     html: '<p>' + err.stack + '</p>'
    // };
    // mailer.sendEmail(mailOptions);
    process.exit(1);
});






/*****************
 * SERVER SETTING
 *****************/

var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function(){
        console.info('Express server listening on port ' + app.get('port'));
    });
};

var shutdown = function() {
    server.close();
};

if (require.main === module) {
    boot();
} else {
    console.info('Running app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}

module.exports = app;