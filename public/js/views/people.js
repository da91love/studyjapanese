//alert("people");

function setProfileDetailClick() {

    $(".user-detail").click(function(){
        event.preventDefault();
        comm.loadPage("profile-detail");
    });

}

setProfileDetailClick();