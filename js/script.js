
jQuery(function ($) {
    $(document).ready(function () {
        $('.page-wrap').on('mouseenter', '.pools-table .pool-menu-wrap', function(e){
            let heightMenu = parseInt($(this).find('.menu-wrap').outerHeight());
            let heightPanel = parseInt($('.top-panel').outerHeight());
            let scrollTop = parseInt($(window).scrollTop());
            let elTop = parseInt($(this).parents('.table-row').offset().top);
            let posTop = elTop + heightMenu - heightPanel - scrollTop + 150;
            if($( window ).height() < posTop){
                $(this).find('.hidden-menu').addClass('to-top');
            } else {
                $(this).find('.hidden-menu').removeClass('to-top');
            }
        });

        //mobile menu
        $('.constr-wrap').on('click', '.mobile-aside', function(e){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                $(this).parents('.left-side').removeClass('open');
            } else {
                $(this).addClass('active');
                $(this).parents('.left-side').addClass('open');
            }
        });

        // preloader
        $('.load-wrapper').fadeOut();
    });
});