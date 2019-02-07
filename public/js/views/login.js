$(document).ready(init);


function init() {
    comm.setI18nMessage(DEFAULT_LANG);
    comm.applyI18n("container");
    $(".login-body").hide();
}

setInterval("$('.arrow').fadeOut(2000).fadeIn(2000);");

$( ".arrow" ).click(function() {
    $(".login-body").fadeIn(2000);
    $('.arrow').detach();
});


$("#login").click(function () {
    var params = {};
    params.id = $('#user-email').val();
    params.password = $('#user-pwd').val();

    if(params.id == ""){
        alert(i18n_MSG["login.login.nonIdPwd"]);
    } else if (params.password == "") {
        alert(i18n_MSG["login.login.nonPwd"]);
    } else {
        function successHandler(resultData) {
            var url = "";
            if (resultData.isAuthenticated) {
                alert("로그인 성공");
                url = "./auth/welcome";
            } else {
                if(resultData.unregistered){
                    alert("가입되지 않은 사용자 입니다.");
                } else if(resultData.standby) {
                    alert("이메일인증을 하지 않은 사용자 입니다.");
                } else {
                    alert("로그인 실패");
                }
                url = "/";
            }
            $(location).attr('href', url);
        }
        service.login(params, successHandler);
    }

});