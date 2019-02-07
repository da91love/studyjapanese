/*
 * 뒤로가기 버튼때문에 만든 거지 같은 ㅠ 퓨....
 */

//*
module.exports = function () {
    var route = require('express').Router();

    route.get('/dashboard', function (req, res) {
        res.render('auth/template', {"pageId":"dashboard"});
    });

    route.get('/record', function (req, res) {
        res.render('auth/template', {"pageId":"record"});
    });

    route.get('/people', function (req, res) {
        res.render('auth/template', {"pageId":"people"});
    });


    return route;
};
//*/


//module.exports = route;
