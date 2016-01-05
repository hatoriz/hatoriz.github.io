/**
 * Created by biggy on 5/21/15.
 */
jQuery(document).ready(function ($) {
    $('form#login-form, form#register-form').on('submit', function (e) {
        if (!$(this).valid()) return false;
        $('div.alert', this).removeClass('hidden');
        $('p.status', this).text(ajax_auth_object.loadingmessage);
        action = 'ajaxlogin';
        username = $('form#login-form #username').val();
        password = $('form#login-form #password').val();
        email = '';
        security = $('form#login-form #security').val();
        console.log($(this).attr('id'));
        if ($(this).attr('id') == 'register-form') {
            action = 'ajaxregister';
            username = $('form#register-form #username').val();
            password = $('form#register-form #password').val();
            email = $('form#register-form #email').val();
            security = $('form#register-form #security').val();
        }
        ctrl = $(this);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajax_auth_object.ajaxurl,
            data: {
                'action': action,
                'username': username,
                'password': password,
                'email': email,
                'security': security
            },
            success: function (data) {
                $('div.alert', this).removeClass('alert-info');
                $('div.alert', this).addClass('alert-danger');
                $('p.status', ctrl).text(data.message);
                if(data.message == 'This username is already registered.' || data.message == 'This email address is already registered.' || data.message == 'Wrong username or password.') {
                    $.each($('p.status').parent(), function(i, val) {
                        $(this).attr('class', 'alert alert-danger');
                    });
                } else if(data.message.indexOf('successful') > -1) {
                    $.each($('p.status').parent(), function(i, val) {
                        $(this).attr('class', 'alert alert-success');
                    });
                } else if(data.message.indexOf('Sending') > -1) {
                    $.each($('p.status').parent(), function(i, val) {
                        $(this).attr('class', 'alert alert-info');
                    });
                }
                if (data.loggedin == true) {
                    console.log('Login successful: ' + data);
                    //$('#btn-login').hide();
                    //$('#btn-logout').removeClass('hidden');
                    //$('#login2-popup').removeClass('in');
                    //$('#div-comment')
                    //document.location.href = ajax_auth_object.redirecturl;
                    location.reload();
                }
            }
        });
        e.preventDefault();
    });
});