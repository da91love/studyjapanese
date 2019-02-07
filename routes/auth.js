//*
module.exports = function (app, preFilter) {

    // library
    var route = require('express').Router();
    var pbkdf2Password = require("pbkdf2-password");
    var hasher = pbkdf2Password();
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var KakaoStrategy = require('passport-kakao').Strategy;
    var InstagramStrategy = require('passport-instagram').Strategy;

    // custom module
    var orm = require("../config/orm");
    var mailer = require("../config/mailer");
    var utils = require("../config/utils");

    // mapper
    var userMapper = require("../config/sql/user-mapper");




    route.post("/login", function (req, res, next) {
        var id = req.body.id;
        var pwd = req.body.password;

        var qParams = {};
        qParams.id = id;
        var sql_select_userById = userMapper.select_userById(qParams);
        var user = orm.exeQuerySync(sql_select_userById);

        if(user.data.rows.length == 1) {
            var userInfo = user.data.rows[0];
            var salt = userInfo.salt;
            var opts = {password: pwd, salt:salt};

            hasher(opts, function(err, pass, salt, hash) {
                var qParamsAuth = {};
                qParamsAuth.id = id;
                qParamsAuth.password = hash;
                var sql_select_authUser = userMapper.select_authUser(qParamsAuth);
                var authUser = orm.exeQuerySync(sql_select_authUser);
                if (authUser.data.rows.length == 1 && authUser.data.rows[0].user_status == 1) {
                    //로그인 완료
                    req.session.userId = userInfo.user_id;
                    req.session.userName = userInfo.user_name;
                    req.session.userType = userInfo.user_type;
                    req.session.isAuthenticated = true;
                    req.session.save(function () {
                        res.json(req.session);
                    });
                } else if(authUser.data.rows.length == 1 && authUser.data.rows[0].user_status == 2) {
                    //인증대기중
                    res.json({'standby':true});
                } else {
                    //비밀번호 틀림
                    req.session.isAuthenticated = false;
                    req.session.save(function () {
                        res.json(req.session);
                    });
                }
            });
        } else {
            res.json({'unregistered':true});
        }
    });

    route.get("/welcome", preFilter, function (req, res, next) {
        var pageName = "record";
        if(req.query.pId){
            pageName = req.query.pId;
        }
        res.render('auth/template', {"pId":pageName});
    });

    route.post('/register', function (req, res) {
        var email = req.body.email;
        var pwd = req.body.password;

        var opts = {password: pwd};
        hasher(opts, function(err, pass, salt, hash) {
            qParams = {};
            qParams.id = email;
            qParams.email = email;
            qParams.password = hash;
            qParams.salt = salt;
            qParams.authType = "local";
            qParams.status = 1;
            var sql_insert_authUser = userMapper.insert_user(qParams);

            function queryCallback(resultData) {
                if (resultData.affectedRows = 1) {
                    req.session.isAuthenticated = true;
                    req.session.save(function () {
                        res.json(resultData);
                    })
                } else {
                    //등록 실패
                }
            }
            orm.exeQuery(sql_insert_authUser, queryCallback);
        });
    });

    route.post("/registerWithEmail", function (req, res, next) {
        var username = req.body.user_name;
        var email = req.body.user_email;
        var pwd = req.body.password;
        var userType = req.body.userType;


        var qParams = {};
        qParams.id = email;
        var sql_select_userById = userMapper.select_userById(qParams);
        var user = orm.exeQuerySync(sql_select_userById);

        if(user.data.rows.length == 1) {
            res.json({'isRegistered' : true});
        } else {
            var opts = {password: pwd};
            hasher(opts, function(err, pass, salt, hash) {
                //console.log(error, pass, salt, hash);
                var qParams = {};
                qParams.id = email;
                qParams.email = email;
                qParams.username = username;
                qParams.userType = userType;
                qParams.password = hash;
                qParams.salt = salt;
                qParams.authType = 0;
                qParams.status = 2;
                var sql_insert_user = userMapper.insert_user(qParams);

                function queryCallback(resultData) {
                    if (resultData.affectedRows = 1) {
                        var hashEsc = utils.escapeGetParam(hash);
                        sendVerificationMail(email, hashEsc);
                        insertVerificationInfo(email, hashEsc);
                        res.json({'sentAuthMail' : true});
                    }
                }
                orm.exeQuery(sql_insert_user, queryCallback);
            });
        }

    });

    var sendVerificationMail = function(email, hash) {
        var address = 'http://localhost:3001/auth/verify/?email=' + email + '&key='+ hash;
        var html = "<h3>아래 URL로 접속해 이메일 주소를 인증해 주십시오.</h3><br>" +
                   "<a href='" + address + "'><button>인증하기</button></a><br><br><hr>";

        var mailOptions = {
            from: 'kdcmobility@gmail.com',
            to: email,
            subject: 'MTM 계정 인증 메일',
            html: html
        };
        mailer.sendEmail(mailOptions);
    };

    var insertVerificationInfo = function(email, hash) {
        var qParams = {};
        qParams.email = email;
        qParams.hash = hash;
        var sql_insert_verification = userMapper.insert_verification(qParams);
        function queryCallback(resultData) {
            if (resultData.affectedRows = 1) {
                console.log("Verification info is inserted.");
            }
        }
        orm.exeQuery(sql_insert_verification, queryCallback);
    };

    route.get('/verify/', function (req, res, next) {
        var qParams = {};
        qParams.email = req.param('email');
        qParams.key = req.param('key');
        //* console.log(qParams.email + qParams.key);
        var sql_select_emailAuth = userMapper.select_emailAuth(qParams);
        var emailAuthUser = orm.exeQuerySync(sql_select_emailAuth);

        if(emailAuthUser.data.rows.length == 1){
            qParams.status = 1;
            var sql_update_userStatus = userMapper.update_userStatus(qParams);
            function queryCallback(resultData) {
                if (resultData.affectedRows = 1) {
                    console.log("User is activated.");
                    res.send(
                        "<script type='text/javascript'>" +
                        "alert('인증이 완료되었습니다.');" +
                        "document.location.href='/'" +
                        "</script>"
                    );
                }
            }
            orm.exeQuery(sql_update_userStatus, queryCallback);
        } else {
            console.log("User is not activated.")
        }
    });





    /******************
     * 3rd PARTY AUTH *
     ******************/

    /*
     * 각 Strategy 에서 인증 절차를 마치고, 성공하면(=return 하는 done 함수의 두번째 인자가 false가 아니면) serializeUser 실행.
     * 넘겨준 파라메터를 가지고 세션에 user 정보를 저장함.
     */
    passport.serializeUser(function(user, done) {
        console.log('[PASSPORT:serialize-user]: ', JSON.stringify(user));
        if(user.user_id.length > 0) {
            done(null, user);
        } else {
            done('3rd party authentication failed', false);
        }
    });

    /*
     * 페이지 접근할때마다 호출되면서, serializeUser 에서 저장한 User의 식별자를 가지고, 등록된 사용자인지 여부를 다시 확인함.
     */
    passport.deserializeUser(function(user, done) {
        console.log('[PASSPORT:deserialize-user]: ', JSON.stringify(user));
        done(null, user);
    });


    route.get("/logout", function (req, res, next) {
        //console.log("[req.session]: ", JSON.stringify(req.session));
        //facebootk logout URL ->https://www.facebook.com/logout.php?next=[http:site.com]&access_token=[token]
        req.session.destroy();
        res.redirect('/');
    });



    /************
     * Facebook *
     ************/
    // 패이스북으로 가는 인증 요청
    route.get('/facebook', passport.authenticate('facebook',
            {scope:'email'}
        )
    );

    // 페이스북에서 오는 인증 요청
    route.get('/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: '/'}),
        function (req, res) {
            // Successful authentication, redirect home.
            if(req.session.passport.user.success || req.session.passport.user.user_id.length > 0) {
                req.session.isAuthenticated = true;
                req.session.save(function () {
                    res.redirect('../welcome');
                });
            } else {
                res.redirect('/');
            }
        }
    );

    passport.use(new FacebookStrategy({
            clientID: '1275881072493408',
            clientSecret: '4404c4a9209afa03362e0397355962ce',
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
        },
        function(accessToken, refreshToken, profile, done) {
            //console.log("access:" + accessToken + "\nprofile: " + profile);
            var userInfo = {};
            userInfo.id = profile.id;
            userInfo.email = profile.emails[0].value;
            userInfo.authType = profile.provider;
            userInfo.username = profile.displayName;
            userInfo.photo = profile.photos[0].value;
            userInfo.gender = profile.gender;
            userInfo.status = 1;
            userInfo.accessToken = accessToken;

            var sql_select_userById = userMapper.select_userById(userInfo);
            var user = orm.exeQuerySync(sql_select_userById);

            //console.log(user.data.rows.length ==0 );
            if(user.data.rows.length == 0 ){
                var insert_facebookUser = userMapper.insert_facebookUser(userInfo);

                function queryCallback(resultData) {
                    if (resultData.affectedRows = 1) {
                        done(null, userInfo);
                    }
                }
                orm.exeQuery(insert_facebookUser, queryCallback);
            } else {
                //* 3rd provider 도 로그아웃 할거면 accessToken set
                //user.data.rows[0].accessToken = accessToken;
                done(null, user.data.rows[0]);
            }
        }
    ));



    /**********
     * Google *
     **********/
    // route.get('/google', passport.authenticate('google',
    //     {scope:'profile'}
    //     )
    // );
    //
    // route.get('/google/callback',
    //     passport.authenticate('google', {failureRedirect: '/'}),
    //     function (req, res) {
    //         // Successful authentication, redirect home.
    //         console.log("[Google Callback Request Session]:  ", JSON.stringify(req.session));
    //         if(req.session.passport.user.success || req.session.passport.user.id.length > 0){
    //             req.session.isAuthenticated = true;
    //             req.session.save(function () {
    //                 res.redirect('../welcome');
    //             });
    //         } else {
    //             res.redirect('/');
    //         }
    //     }
    // );
    //
    // passport.use(new GoogleStrategy({
    //         clientID: '470129296499-a6mb488sdhb454eerbouufvdml77m8ss.apps.googleusercontent.com',
    //         clientSecret: 'XQ6B8EVQReMaHtKE1I9c4i49',
    //         callbackURL: "/auth/google/callback",
    //         profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
    //     },
    //     function(token, tokenSecret, profile, done) {
    //         console.log("token:" + token + "\ntokenSecret: " + tokenSecret, + "\nprofile: " + profile);
    //         var userInfo = {};
    //         userInfo.id = profile.id;
    //         userInfo.email = profile.emails[0].value;
    //         userInfo.authType = profile.provider;
    //         userInfo.username = profile.displayName;
    //         userInfo.photo = profile.photos[0].value;
    //         userInfo.gender = profile.gender;
    //         userInfo.status = 1;
    //         userInfo.accessToken = accessToken;
    //
    //         var sql_select_userById = userMapper.select_userById(userInfo);
    //         var user = orm.exeQuerySync(sql_select_userById);
    //
    //         //console.log(user.data.rows.length ==0 );
    //         if(user.data.rows.length == 0 ){
    //             var sql_insert_googleUser = userMapper.insert_googleUser(userInfo);
    //
    //             function queryCallback(resultData) {
    //                 if (resultData.affectedRows = 1) {
    //                     done(null, userInfo);
    //                 }
    //             }
    //             orm.exeQuery(sql_insert_googleUser, queryCallback);
    //         } else {
    //             //* 3rd provider 도 로그아웃 할거면 accessToken set
    //             //user.data.rows[0].accessToken = accessToken;
    //             done(null, user.data.rows[0]);
    //         }
    //     }
    // ));

    /*************
     * instagram *
     *************/
    route.get('/instagram', passport.authenticate('instagram'));

    route.get('/instagram/callback',
        passport.authenticate('instagram', {failureRedirect: '/'}),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log("[instagram Callback Request Session]:  ", JSON.stringify(req.session));
            if(req.session.passport.user.success || req.session.passport.user.user_id.length > 0){
                req.session.isAuthenticated = true;
                req.session.save(function () {
                    res.redirect('../welcome');
                });
            } else {
                res.redirect('/');
            }
        }
    );

    passport.use(new InstagramStrategy({
            clientID: 'cd9a48697eb84de48f74e1a7ec38ac57',
            clientSecret: '0292ef38de584ca0a0cec5d2b6e8613f',
            callbackURL: "/auth/instagram/callback"
            //profileFields: ['id', 'displayName', 'provider', 'email']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("token:" + accessToken + "\ntokenSecret: " + refreshToken + "\nprofile: " + JSON.stringify(profile));
            var userInfo = {};
            userInfo.id = profile.id;
            userInfo.authType = profile.provider;
            userInfo.username = profile.displayName;
            userInfo.status = 1;
            userInfo.accessToken = accessToken;

            var sql_select_userById = userMapper.select_userById(userInfo);
            var user = orm.exeQuerySync(sql_select_userById);

            //console.log(user.data.rows.length ==0 );
            if(user.data.rows.length == 0 ){
                var sql_insert_instagramUser = userMapper.insert_instagramUser(userInfo);

                function queryCallback(resultData) {
                    if (resultData.affectedRows = 1) {
                        done(null, userInfo);
                    }
                }
                orm.exeQuery(sql_insert_instagramUser, queryCallback);
            } else {
                //* 3rd provider 도 로그아웃 할거면 accessToken set
                //user.accessToken = accessToken;
                done(null, user.data.rows[0]);
            }
        }
    ));





    /*********
     * kakao *
     *********/
    route.get('/kakao', passport.authenticate('kakao',
        {scope:'profile'}
        )
    );

    route.get('/kakao/callback',
        passport.authenticate('kakao', {failureRedirect: '/'}),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log("[kakao Callback Request Session]:  ", JSON.stringify(req.session));
            if(req.session.passport.user.success || req.session.passport.user.user_id.length > 0){
                req.session.isAuthenticated = true;
                req.session.save(function () {
                    res.redirect('../welcome');
                });
            } else {
                res.redirect('/');
            }
        }
    );

    passport.use(new KakaoStrategy({
            clientID: '1c4b97230f5e25e895d4aeab2eed74df',
            callbackURL: "/auth/kakao/callback"
            //profileFields: ['id', 'displayName', 'provider', 'email']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("token:" + accessToken + "\ntokenSecret: " + refreshToken + "\nprofile: " + JSON.stringify(profile));
            var userInfo = {};
            userInfo.id = profile.id.toString();
            userInfo.authType = profile.provider;
            userInfo.username = profile.displayName;
            userInfo.status = 1;
            userInfo.accessToken = accessToken;

            var sql_select_userById = userMapper.select_userById(userInfo);
            var user = orm.exeQuerySync(sql_select_userById);

            //console.log(user.data.rows.length ==0 );
            if(user.data.rows.length == 0 ){
                var sql_insert_kakaoUser = userMapper.insert_kakaoUser(userInfo);

                function queryCallback(resultData) {
                    if (resultData.affectedRows = 1) {
                        done(null, userInfo);
                    }
                }
                orm.exeQuery(sql_insert_kakaoUser, queryCallback);
            } else {
                //* 3rd provider 도 로그아웃 할거면 accessToken set
                //user.accessToken = accessToken;
                done(null, user.data.rows[0]);
            }
        }
    ));




    return route;
};
//*/
//module.exports = route;