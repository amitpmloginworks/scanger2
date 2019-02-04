$(document).ready(function(){

    $("#form_id").submit(function(){
        var flag = 1;
        var name = $('#email').val();
        var password = $('#password').val();
        if(name == ''){
            $('#email').addClass('error-form');
            flag = 0;
        }
        if(password == ''){
            $('#password').addClass('error-form');
            flag = 0;
        }
        if(flag == 0){
            return false;
        }
    });

    $("#form_reset").submit(function(){
        var flag = 1;
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        if(password1 == ''){
            $('#password1').addClass('error-form');
            //$('#password1').css('border-color: #a94442 !important');
            flag = 0;
        }
        if(password2 == ''){
            $('#password2').addClass('error-form');
            flag = 0;
        }
        if(password1 == password2 && password1 != ''){
             $('#passwrd-error').html("");
        }else{
            flag = 0;
            $('#passwrd-error').html("Password Not Matched");
        }
        if(flag == 0){
            return false;
        }
    });
});