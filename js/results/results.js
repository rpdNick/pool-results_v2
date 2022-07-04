jQuery(function ($) {
    $(document).ready(function () {
        // preloader
        $('.load-wrapper').fadeOut();
    });
});

let windowSize = window.innerWidth;

let dropdownPercentageValEl = $('.progress-chart-container .percentage-count span');

function drowDropdownProgressChartLines(percentageEl) {
    for (let i = 0; i < percentageEl.length; i++) {
        const percentageVal = percentageEl[i].innerText;
        $(percentageEl[i]).parents('.progress-percentage-wrapper').find('.progress-loader-color').css('width', percentageVal + '%');
    }
}

drowDropdownProgressChartLines(dropdownPercentageValEl);




let rangingProgressEl = $('.ranging-item-percentage .ranging-percentage-value');

function drowRangingProgressChartLines(percentageEl, size) {
    for (let i = 0; i < percentageEl.length; i++) {
        const percentageVal = percentageEl[i].innerText * 1;
        if (percentageVal < 10 && size < 450) {
            $(percentageEl[i]).parents('.ranging-item-percentage').find('.ranging-percentage-box').css('opacity', '0');
        }
        if (percentageVal < 4 && size > 450) {
            $(percentageEl[i]).parents('.ranging-item-percentage').find('.ranging-percentage-box').css('opacity', '0');
        } else {
            $(percentageEl[i]).parents('.ranging-item-percentage').find('.ranging-percentage-box').css('opacity', '1');
        }
        $(percentageEl[i]).parents('.ranging-item-percentage').find('.progress-loader-color').css('width', percentageVal + '%');
    }
}

drowRangingProgressChartLines(rangingProgressEl, windowSize);