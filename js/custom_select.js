jQuery(function ($) {
    $(document).ready(function () {
        //customselect
        customSelectActive();

        $(document).click(function (e) {
            $('.customselect-wrapper').find('.select-styled').removeClass('active');
            $('.customselect-wrapper').find('.select-options').hide();
        });

        $('body').on('click', '.customselect-wrapper .select-styled', function (e) {
            e.stopPropagation();
            let wrapper = $(this).parents('.customselect-wrapper');

            $('.customselect-wrapper').not(wrapper).find('.select-styled').removeClass('active');
            $('.customselect-wrapper').not(wrapper).find('.select-options').hide();

            let selected = wrapper.find('.select-styled');

            let docHeight = $(document).height();
            let selectPosition = $(selected).offset().top + $(selected).height();
            let listHeight = $(selected).next('ul.select-options').height()
            if ($('.preview-footer').length > 0) {
                docHeight -= $('.preview-footer').height();
            }
            if (docHeight < selectPosition + listHeight) {
                $(selected).next('ul.select-options').addClass('orient-top');
                $(selected).addClass('orient-top');
            } else {
                $(selected).next('ul.select-options').removeClass('orient-top');
                $(selected).removeClass('orient-top');
            }
            if (wrapper.hasClass('customselect-multiple')) {
                if ($(e.target).hasClass('remove-option')) {
                    let optionVal = $(e.target).parents('.selectvalue').attr('data-value');
                    $(e.target).parents('.select').find(`.select-options li[rel="${optionVal}"]`).click();
                } else {
                    $(selected).toggleClass('active').next('ul.select-options').toggle();
                }
            } else {
                $('div.select-styled.active').not(selected).each(function () {
                    $(selected).removeClass('active').next('ul.select-options').hide();
                });
                $(selected).toggleClass('active').next('ul.select-options').toggle();
            }
        });

        $('body').on('click', '.customselect-wrapper li', function (e) {
            e.stopPropagation();
            let wrapper = $(this).parents('.customselect-wrapper');
            $styledSelect = wrapper.find('.select-styled');
            $this = wrapper.find('select');
            $list = wrapper.find('.select-options');
            if (wrapper.hasClass('customselect-multiple')) {
                let currentLi = $(e.currentTarget);
                if (currentLi.hasClass('active')) {
                    currentLi.removeClass('active');
                    $styledSelect.find('.selectvalue[data-value="' + currentLi.attr('rel') + '"]').remove();
                    if ($styledSelect.find('.selectvalue').length == 0) {
                        $styledSelect.html('<div class="default">Выберите ответ</div>');
                    }
                    $this.find('option[value="' + currentLi.attr('rel') + '"]').prop("selected", false)
                    currentLi.removeClass('active');
                } else {
                    currentLi.addClass('active');
                    if ($styledSelect.find('.default').length > 0) {
                        $styledSelect.find('.default').remove();
                    }
                    $styledSelect.append(
                        `<div class="selectvalue" data-value="${$(e.currentTarget).attr('rel')}">
                            <div class="value">${$(e.currentTarget).attr('rel')}</div>
                            <div class="remove-option"></div>
                        </div>`);
                    $this.find('option[value="' + $(e.currentTarget).attr('rel') + '"]').prop("selected", true);
                    currentLi.addClass('active');
                }

            } else {
                $styledSelect.text($(this).text()).removeClass('active');
                $(this).parents('ul').find('li').removeClass('active');
                $this.val($(this).attr('rel'));
                $list.hide();
                $(this).addClass('active');
            }
            $this.change();
        });
    });
});

function customSelectActive() {
    $('.customselect').each(function () {
        if (!$(this).hasClass('select-hidden')) {
            $(this).parent().addClass('customselect-wrapper');
            var $this = $(this),
                numberOfOptions = $(this).children('option').length;
            $this.addClass('select-hidden');
            $this.wrap('<div class="select"></div>');
            $this.after('<div class="select-styled"></div>');
            var $styledSelect = $this.next('div.select-styled');
            if ($this.attr('multiple')) {
                $this.parents('.customselect-wrapper').addClass('customselect-multiple');
                if ($this.find('option:selected').length > 0) {
                    var SelectedOption = $this.find('option:selected');
                    console.log(SelectedOption);
                    SelectedOption.each(function (index, option) {
                        $styledSelect.append('<div class="selectvalue" data-value="' + $(option).text() + '">' + $(option).text() + '</div>');
                    });
                } else {
                    $styledSelect.html('<div class="default">Выберите ответ</div>');
                }

                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);

                for (var i = 0; i < numberOfOptions; i++) {
                    var lioption;
                    if ($this.children('option').eq(i)[0].selected) {
                        lioption = '<li rel="' + $this.children('option').eq(i).val() + '">' + $this.children('option').eq(i).text() + '</li>';
                    } else {
                        lioption = '<li rel="' + $this.children('option').eq(i).val() + '">' + $this.children('option').eq(i).text() + '</li>';
                    }
                    $(lioption).appendTo($list);
                }
            } else {

                if ($this.find('option:selected').length > 0) {
                    $styledSelect.text($this.find('option:selected').text());
                } else {
                    $styledSelect.text('Выберите ответ');
                }

                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);

                for (var i = 0; i < numberOfOptions; i++) {
                    if ($this.children('option').eq(i).attr('disabled') !== 'disabled') {
                        let className = '';
                        if ($this.children('option').eq(i).attr('selected')) {
                            className = 'active';
                        }
                        $('<li />', {
                            text: $this.children('option').eq(i).text(),
                            rel: $this.children('option').eq(i).val(),
                            class: className
                        }).appendTo($list);
                    }
                }
            }
        }
    });
}