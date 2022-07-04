jQuery(function ($) {
    $(document).ready(function () {
        
        let loginForm = $('.send-form').find('form');
        loginForm.submit(function (e) {
           return validForm();
        });

        if($('.interests-content').length === 0){
            $('form').on('change, input', 'input', function(e){
                if(validForm()){
                    $(this).parents('form').find('.btn-submit').addClass('active');
                }
            });
        }
        if($('.interests-content').length === 0){
            if(validForm()){
                $('form').find('.btn-submit').addClass('active');
            }
        }
        $('.interests-content').on('change', '.interest-item input', function(e){
            $(this).parents('form').find('.btn-submit').addClass('active');
        });
        if($('.text-popUp').length > 0){
            setTimeout(function(){ $('.text-popUp').fadeOut(300); }, 3000);
        }
        $('input[type=email]').change(function(e){
            let email = $(this).val();
            loginInput = $(this).parents('.login-input');
            if(isEmail(email)){
                if(loginInput.hasClass('has-error')){
                    loginInput.removeClass('has-error');
                    loginInput.find('.error-text').remove();
                }
            } else {
                if(loginInput.find('.error-text').length === 0){
                    let errorHtml = 
                    `<div class="error-text">
                        Введите корректный e-mail
                    </div>`;
                    $(errorHtml).appendTo(loginInput);
                }
                loginInput.addClass('has-error');
            }
        });
        $('input[type=password]').change(function(e){
            let password = $(this).val();
            loginInput = $(this).parents('.login-input');
            if(password.length > 2){
                if(loginInput.hasClass('has-error')){
                    loginInput.removeClass('has-error');
                    loginInput.find('.error-text').remove();
                }
            } else {
                if(loginInput.find('.error-text').length === 0){
                    let errorHtml = 
                    `<div class="error-text">
                       Пароль слишком короткий
                    </div>`;
                    $(errorHtml).appendTo(loginInput);
                }
                loginInput.addClass('has-error');
            }
        });
        function validForm(){
            var erroreArrayElemnts = [];
            var el = loginForm.find('[data-reqired]');
            for (let i = 0; i < el.length; i++) {
                if(el[i].type === 'checkbox'){
                    if(el[i].checked == false){
                        erroreArrayElemnts.push(el[i]);
                    }
                } else {
                    if (el[i].value === '' || el[i].value === ' ' || el[i].value === '-') {
                        erroreArrayElemnts.push(el[i]);
                    }
                }
            }
            let emails = loginForm.find('input[type=email]');
            for (let i = 0; i < emails.length; i++) {
                if(!isEmail($(emails[i]).val())){
                    erroreArrayElemnts.push(emails[i]);
                } else {
                    loginInput = $(emails[i]).parents('.login-input');
                    loginInput.removeClass('has-error');
                    loginInput.find('.error-text').remove();
                }
            }
            let passwords = loginForm.find('input[type=password]');
            for (let i = 0; i < passwords.length; i++) {
                if($(passwords[i]).val().length < 2){
                    erroreArrayElemnts.push(emails[i]);
                } else {
                    loginInput = $(passwords[i]).parents('.login-input');
                    loginInput.removeClass('has-error');
                    loginInput.find('.error-text').remove();
                }
            }
            if(erroreArrayElemnts.length > 0){
                return false;
            }
            else {
                return true;
            }
        }
        function isEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }
        // preloader
        $('.load-wrapper').fadeOut();
        
        if(validForm()){
            $('form').find('.btn-submit').addClass('active');
        }
    });
});