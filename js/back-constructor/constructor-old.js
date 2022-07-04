jQuery(function ($) {
    $(document).ready(function () {
        //function for autoresize textarea
        $.fn.autoResize = function () {
            let r = e => {
                e.style.height = '';
                e.style.height = e.scrollHeight + 'px'
            };
            return this.each((i, e) => {
                e.style.overflow = 'hidden';
                r(e);
                $(e).bind('input', e => {
                    r(e.target);
                })
            })
        };
        //local settings for datepicker
        $.datepicker.setDefaults({
            closeText: 'Закрыть',
            prevText: '',
            currentText: 'Сегодня',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ],
            monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
            ],
            dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            weekHeader: 'Не',
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        });

        // Restricts input for the set of matched elements to the given inputFilter function.
        $.fn.inputFilter = function (inputFilter) {
            return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    this.value = "";
                }
            });
        };
        //create unique ID
        function getUniqueID() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        //auto height for textarea
        $('.questions-box textarea').autoResize();
        //activation filter
        $('.content-wrap').on('change', '.filter-item select', function (e) {
            $(this).parents('.filter-item').addClass('picked');
        });
        //change mode view
        $('.content-wrap').on('click', '.mode-view', function (e) {
            if ($(this).hasClass('mode-full') && !$(this).hasClass('active')) {
                $('.listbox').removeClass('icons-mode');
                $('.mode-view.mode-icons').removeClass('active');
                $(this).addClass('active');
            } else if ($(this).hasClass('mode-icons') && !$(this).hasClass('active')) {
                $('.listbox').addClass('icons-mode');
                $('.mode-view.mode-full').removeClass('active');
                $(this).addClass('active');
            }
        });

        //set height for question-box
        setHeightBox();

        function setHeightBox() {
            let box = $('.questions-box');
            let viewHeight = window.innerHeight;
            let panelHeight = $('.top-panel').outerHeight(true);
            let wrapPad = 40;
            let navHeight = $('.top-nav').outerHeight(true);
            let filterHeiht = $('.filter-wrap').outerHeight(true);
            let boxHeight = parseInt(viewHeight - panelHeight - wrapPad - navHeight - filterHeiht);
            box.height(boxHeight + 'px');
        }
        $(window).resize(function () {
            $('.questions-box textarea').autoResize();
            setHeightBox();
        });
        //actions with question
        //sortable questions
        if ($(window).width() > 700) {
            let questionList = $('.questions-box .questions-list');
            new Sortable(questionList[0], {
                scroll: true,
                forceFallback: true,
                animation: 150,
                filter: 'input, a, button, textarea, .control-panel, .customselect-wrapper, .ranging-list',
                preventOnFilter: false,
                swapThreshold: 0.9,
                invertSwap: true,
                onEnd: function (evt) {
                    let questionsList = $(evt.target);
                    console.log(questionsList);
                    refreshQuestionsId(questionsList);
                },
            });
        }
        //drag question
        $('.listbox .list-item').draggable({
            helper: 'clone',
            cursor: 'move',
            connectToSortable: '.questions-box',
            containment: '.constr-wrap',
        });

        //dropped question
        $('.questions-box').droppable({
            drop: function (event, ui) {
                if ($(ui.draggable).hasClass('list-item')) {
                    var eventTop = event.pageY;
                    var offsetY = event.offsetY;
                    var children = $('.questions-box').find('.questions-list').children();
                    var appendInde = getAppendIndex(children, eventTop, offsetY);
                    var type = $(ui.draggable).attr('data-type');
                    let id = 1;
                    if (appendInde === 'last') {
                        id = children.length + 1;
                    } else if (appendInde < 0) {
                        id = 1;
                    } else {
                        id = appendInde + 1
                    }
                    if (type && id) {
                        addQuestion(type, appendInde, id);
                    }
                }
            }
        });

        //get index of dropable question
        function getAppendIndex(arr, top, offsetY) {
            if (arr.length === 0) {
                return 'last';
            } else {
                for (var i = 0; i < arr.length; i++) {
                    var elTop = $(arr[i]).offset().top,
                        elBottom = $(arr[i]).offset().top + $(arr[i]).outerHeight(true),
                        height = $(arr[i]).outerHeight(true);
                    if (top > elTop + height / 2 && top < elBottom + offsetY) {
                        return i;
                    } else if (top > elTop && top < elBottom) {
                        return (i - 1);
                    }
                }
                return arr.length - 1;
            }
        }

        //add question by click
        $('.constr-wrap').on('click', '.listbox .list-item', function (e) {
            let type = $(this).attr('data-type');
            let appendInde = "last";
            let id = $('.questions-box').find('.questions-list').children().length + 1;
            addQuestion(type, appendInde, id);
        });

        let termsObj = {
            termElement1: {
                termNmae: "Укажите Ваш пол",
                termOptions: [
                    'Выбрать все',
                    'Мужской',
                    'Женский'
                ]
            },
            termElement2: {
                termNmae: "Сколько лет Вам исполнилось в последний день рождения? ",
                termOptions: [
                    'Выбрать все',
                    'Младше 18 – отсев',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25'
                ]
            },
        }

        //add question to list
        function addQuestion(type, appendInde, id) {
            let uniqueId = getUniqueID();
            let children = $('.questions-box').find('.questions-list').children();
            let attchFiles =
                `<div class="attach-file">
                    <div class="attach-file-icon"></div>
                    <div class="attach-files-wrap">
                        <div class="files-list">
                            <div class="file-item file-video">
                                <input type="file" accept="video/mp4,video/x-m4v,video/*" name="uploadvideo_${id}"
                                    id="uploadvideo_${id}">
                                <label for="uploadvideo_${id}"></label>
                            </div>
                            <div class="file-item file-img">
                                <input type="file" accept="image/png, image/gif, image/jpeg" name="uploadimage_${id}"
                                    id="uploadimage_${id}">
                                <label for="uploadimage_${id}"></label>
                            </div>
                            <div class="file-item file-audio">
                                <input type="file" accept=".mp3,audio/*" name="uploadaudio_${id}" id="uploadaudio_${id}">
                                <label for="uploadaudio_${id}"></label>
                            </div>
                        </div>
                    </div>
                </div>`;
            let termsListTemplate = '';

            for (let element of Object.values(termsObj)) {
                let termsSubmenuTemplate = '';
                let counter = 1;
                for (let submenu of element.termOptions) {
                    termsSubmenuTemplate +=
                        `<li class="menu-item sub-menu-item">
                            <div>
                                <input type="checkbox" id="term_${id}_${counter}" name="term_${id}_${counter}" class="term-el" value="${submenu}" />
                                <label for="term_${id}_${counter}" title="text">${submenu}</label>
                            </div>
                        </li>`
                    counter++;
                }
                termsListTemplate += `<li class="menu-item main-menu-item">
                <div class="main-term">${element.termNmae}</div>
                <ul class="sub-menu">
                    <li class="menu-item sub-menu-item">
                        <div>
                            <input type="checkbox" id="term_${id}_0" name="term_${id}_0" class="term-el" value="Выбрать все" />
                            <label for="term_${id}_0" title="text">Выбрать все</label>
                        </div>
                    </li>
                    ${termsSubmenuTemplate}
                </ul>
            </li>`
            }

            let terms =
                `<div class="terms-wrapper">
                <div class="add-terms">Условия</div>
                <div class="terms-box">
                    <ul class="terms-main-menu menu">
                        <li class="menu-item main-menu-item">
                            <div class="main-term">Укажите Ваш пол</div>
                            <ul class="sub-menu">
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_0" name="term_${id}_0" class="term-el" value="Выбрать все" />
                                        <label for="term_${id}_0" title="text">Выбрать все</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_1" name="term_${id}_1" class="term-el" value="Мужской" />
                                        <label for="term_${id}_1" title="text">Мужской</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_2" name="term_${id}_2" class="term-el" value="Женский" />
                                        <label for="term_${id}_2" title="text">Женский</label>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item main-menu-item">
                            <div class="main-term">Сколько лет Вам исполнилось в последний день рождения? </div>
                            <ul class="sub-menu">
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_3" name="term_${id}_3" class="term-el" value="Выбрать все" />
                                        <label for="term_${id}_3" title="text">Выбрать все</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_4" name="term_${id}_4" class="term-el" value="Младше 18 – отсев" />
                                        <label for="term_${id}_4" title="text">Младше 18 – отсев</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_5" name="term_${id}_5" class="term-el" value="18" />
                                        <label for="term_${id}_5" title="text">18</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_6" name="term_${id}_6" class="term-el" value="19" />
                                        <label for="term_${id}_6" title="text">19</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_7" name="term_${id}_7" class="term-el" value="20" />
                                        <label for="term_${id}_7" title="text">20</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_8" name="term_${id}_8" class="term-el" value="21" />
                                        <label for="term_${id}_8" title="text">21</label>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li class="menu-item main-menu-item">
                            <div class="main-term">В каком городе Вы проживаете?</div>
                            <ul class="sub-menu">
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_9" name="term_${id}_9" class="term-el" value="Выбрать все" />
                                        <label for="term_${id}_9" title="text">Выбрать все</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_10" name="term_${id}_10" class="term-el" value="Абакан" />
                                        <label for="term_${id}_10" title="text">Абакан</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_11" name="term_${id}_11" class="term-el" value="Альметьевск" />
                                        <label for="term_${id}_11" title="text">Альметьевск</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_12" name="term_${id}_12" class="term-el" value="Ангарск" />
                                        <label for="term_${id}_12" title="text">Ангарск</label>
                                    </div>
                                </li>
                                <li class="menu-item sub-menu-item">
                                    <div>
                                        <input type="checkbox" id="term_${id}_13" name="term_${id}_13" class="term-el" value="Арзамас" />
                                        <label for="term_${id}_13" title="text">Арзамас</label>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>`
            let nameHtml =
                `<div class="question-name">
                    <textarea name="question_${id}"  rows="1" placeholder="Введите ваш вопрос" data-required="required">${id}. </textarea>
                </div>`;
            let topEL =
                `<div class="control-panel">
                    ${attchFiles}
                    <div class="show-settings"></div>
                    <div class="remove-question"></div>
                </div>
                <input type="hidden" name="type_${id}" value="${type}">
                <input type="hidden" name="id_${id}" value="${uniqueId}">
                <div class="display-checked-terms">Here will be checked terms</div>
                ${terms}
                ${nameHtml}`;
            let el;

            let required_Set =
                `<div class="switch-row">
                <div class="label">
                    Обязательность ответа
                </div>
                <label class="switch">
                    <input type="checkbox" name="required_${id}">
                    <span class="slider round"></span>
                </label>
            </div>`;

            switch (type) {
                case 'single':
                    el =
                        `<div class="question-wrap question-single question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="radio-btns-wrapper">
                                </div>
                                <div class="input-new-item-wrap">
                                    <input type="text" class="input-single-item" placeholder="Введите вариант ответа">
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить вариант ответа «Другое»
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="add-other" name="addOther_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить вариант ответа «Ничего из вышеперечисленного»
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="add-neither" name="addNeither_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Поле комментария
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="add-comment" name="addComment_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Несколько вариантов ответов
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" name="multiple_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'free-answer':
                    el =
                        `<div class="question-wrap question-free question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="free-answers">
                                    <div class="answer-wrap">
                                        <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="select-row">
                                    <div class="label">
                                        Несколько вариантов ответов
                                    </div>
                                    <div class="select-input">
                                        <select name="amount_${id}" class="customselect amount-select">
                                            <option value="dynamic">Автообновление</option>
                                            <option selected value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'scale':
                    el =
                        `<div class="question-wrap question-scale question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="scale-wrap scale-star scale-10">

                                    <input type="radio" id="scale_${id}_10" name="scale_${id}" value="10" />
                                    <label for="scale_${id}_10" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_9" name="scale_${id}" value="9" />
                                    <label for="scale_${id}_9" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_8" name="scale_${id}" value="8" />
                                    <label for="scale_${id}_8" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_7" name="scale_${id}" value="7" />
                                    <label for="scale_${id}_7" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_6" name="scale_${id}" value="6" />
                                    <label for="scale_${id}_6" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_5" name="scale_${id}" value="5" />
                                    <label for="scale_${id}_5" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_4" name="scale_${id}" value="4" />
                                    <label for="scale_${id}_4" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_3" name="scale_${id}" value="3" />
                                    <label for="scale_${id}_3" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_2" name="scale_${id}" value="2" />
                                    <label for="scale_${id}_2" title="text"></label>
                            
                                    <input type="radio" id="scale_${id}_1" name="scale_${id}" value="1" />
                                    <label for="scale_${id}_1" title="text"></label>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="scale-options">
                                    <div class="scale-row">
                                        <div class="options-item">
                                            <div class="option-label">
                                                Шкала
                                            </div>
                                            <div class="option-value">
                                                <select name="scaleAmount_${id}" class="customselect scale-amount">
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option selected value="10">10</option>
                                                    <option value="2">да/нет</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="options-item">
                                            <div class="option-label">
                                                Фигура
                                            </div>
                                            <div class="option-value">
                                                <select name="scaleType_${id}" class="customselect scale-type">
                                                    <option selected value="star">Звездочки</option>
                                                    <option value="face">Смайлики</option>
                                                    <option value="heart">Сердечки</option>
                                                    <option value="hand">Палец</option>
                                                    <option value="diapason">Диапазон</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="switch-row">
                                        <div class="label">
                                            Метки рейтинга
                                        </div>
                                        <label class="switch">
                                            <input type="checkbox" class="add-rateLabels" name="rateLabels_${id}" id="rateLabels_${id}">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'dropdown':
                    el =
                        `<div class="question-wrap question-dropdown question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="dropdown-wrap">
                                    <select class="customselect">
                                        <option value=""></option>
                                    </select>
                                </div>
                                <div class="optins-list">
                                    <div class="option-item">
                                        <div class="number">1.</div>
                                        <div class="value">
                                            <input type="text" name="inputpoint_${id}_1" value="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить вариант ответа «Другое»
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="add-other" id="addOther_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить вариант ответа «Ничего из вышеперечисленного»
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" class="add-neither" name="addNeither_${id}">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить поле для комментария
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" name="addComment_${id}" class="add-comment">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Несколько вариантов ответов
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" name="multiple_${id}" class="make-multiple">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'matrix':
                    el =
                        `<div class="question-wrap question-matrix question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="matrix-table">
                                    <table>
                                        <tr>
                                            <td></td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="matrix-options">
                                    <div class="matrix-row-list">
                                        <div class="matrix-row">
                                            <div class="value">
                                                <input type="text" name="inputRow_${id}_1" placeholder="Введите текст строки">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="matrix-col-list">
                                        <div class="matrix-col">
                                            <div class="value">
                                                <input type="text" name="inputCol_${id}_1" placeholder="Введите текст столбца">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="switch-row">
                                    <div class="label">
                                        Разрешить несколько ответов на строку
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" name="multiple_${id}" class="add-multipleChoice">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                <div class="switch-row">
                                    <div class="label">
                                        Добавить поле комментария
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" name="addComment_${id}" class="add-comment">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'ranging':
                    el =
                        `<div class="question-wrap question-ranging question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="ranging-list">
                                    <div class="ranging-item empty-item">
                                        <div class="grab-icon"></div>
                                        <div class="ranging-name">
                                            <textarea name="inputpoint_${id}_1" placeholder="Введите вариант ответа" rows="1"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'name':
                    el =
                        `<div class="question-wrap question-name question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="name-answers">
                                    <div class="answer-wrap">
                                        <textarea rows="1" placeholder="Имя"></textarea>
                                    </div>
                                    <div class="answer-wrap">
                                        <textarea rows="1" placeholder="Отчество"></textarea>
                                    </div>
                                    <div class="answer-wrap">
                                        <textarea rows="1" placeholder="Фамилия"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'date':
                    el =
                        `<div class="question-wrap question-date question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="data-list">
                                    <div class="date-answer">
                                        <input type="text" class="date-input" maxlength="10">
                                        <div class="icon-date"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                <div class="select-row">
                                    <div class="label">
                                        Несколько вариантов ответов
                                    </div>
                                    <div class="select-input">
                                        <select name="amount_${id}" class="customselect amount-select">
                                            <option value="dynamic">Автообновление</option>
                                            <option selected value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    </div>
                                </div>
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'email':
                    el =
                        `<div class="question-wrap question-email question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="email-answer">
                                    <input type="email" placeholder="Email">
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'phone':
                    el =
                        `<div class="question-wrap question-phone question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="phone-answer">
                                    <input class="code" type="text" value="+7" readonly>
                                    <input class="phone" type="tel" maxlength="11">
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                case 'file':
                    el =
                        `<div class="question-wrap question-file question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                                <div class="file-answer">
                                    <label>
                                        <input type="file" multiple>
                                    </label>
                                </div>
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
                    break;
                default:
                    el =
                        `<div class="question-wrap question-single question-new" data-id="${id}">
                            <div class="box-shadow question-content">
                                ${topEL}
                            </div>
                            <div class="box-shadow question-settings">
                                ${required_Set}
                            </div>
                        </div>`
            }

            let scrollTo = 0;
            if (appendInde === 'last') {
                $('.questions-box').find('.questions-list').append(el);
                scrollTo = $('.questions-box').find('.questions-list .question-wrap:last-child').offset().top;

            } else if (appendInde < 0) {
                $('.questions-box').find('.questions-list').prepend(el);
                scrollTo = $('.questions-box').find('.questions-list .question-wrap:first-child').offset().top;
            } else {
                $(children[appendInde]).after(el);
                scrollTo = $(children[appendInde]).offset().top;
            }
            $('.questions-box').removeClass('empty');
            $('.questions-box textarea').autoResize();
            //scroll to element 
            let container = $('.questions-box');
            container.scrollTop(
                scrollTo - container.offset().top + container.scrollTop()
            );
            customSelectActive();
            if (type = "ranging") {
                setSortbaleRanging();
            }
            if (type = "date") {
                setDatePicker();
            }
            if (type = "phone") {
                //set pick phone code
                $('.question-phone input.code').intlTelInput({
                    initialCountry: "ru",
                });
            }
            if (type = "single") {
                setSortbaleSingleItems();
            }
            refreshQuestionsId();
            setTimeout(() => {
                questionInFocus();
            }, 500);
        }

        function questionInFocus() {
            let question = $('.question-new');
            let questionName = question.find('.question-name textarea');
            questionName.focus();
            question.removeClass('question-new');
        }

        /** Show/hide terms */
        $('.constr-wrap').on('click', '.terms-wrapper .add-terms', function () {
            let menuAction = $(this).hasClass('active-terms');
            $(this).toggleClass('active-terms');
            $(this).parents('.terms-wrapper').find('.terms-box').fadeIn();

            if (menuAction == true) {
                $(this).parents('.terms-wrapper').find('.terms-box').hide();
            }
        })

        $('.constr-wrap').on('click', '.terms-box ul li div', function (e) {
            // remove the active class with every click
            let same = $(this).hasClass('active');
            let siblings = $(this).parent('.menu-item').parent().children();
            siblings.find('div.active + .sub-menu').hide();
            siblings.find('div').removeClass('active');

            if ($(this).next().hasClass('sub-menu') && !same) {
                e.preventDefault();
                $(this).addClass('active');
                $(this).next('.sub-menu').slideDown();
            }
        });

        let checkedTermsArrey = [];
        /**Logic for terms checked value */
        $('.constr-wrap').on('change', '.term-el', function () {
            if ($(this).is(":checked")) {
                let termVal = $(this).val();
                if (termVal == "Выбрать все") {
                    $(this).parents('.sub-menu').find('.term-el').prop('checked', true);
                    console.log($(this).parents('.sub-menu').find('.term-el'))
                }
                checkedTermsArrey.push(termVal)
            } else if ($(this).is(":checked") == false) {
                // console.log('unchecked')
                let termVal = $(this).val();
                if (termVal == "Выбрать все") {
                    $(this).parents('.sub-menu').find('.term-el').prop('checked', false);
                    checkedTermsArrey = [];
                }
                checkedTermsArrey.pop();
            }
            console.log(checkedTermsArrey)
        })
        /** Show/hide terms END*/


        //uneditable numbers in question name
        $('.constr-wrap').on('keypress, keydown', '.question-name textarea', function (e) {
            let $field = $(this);
            let value = $field.val().split('.');
            if (value.length > 0 && $.isNumeric(value[0])) {
                let readOnlyLength = value[0].length + 2;
                if ((event.which != 37 && (event.which != 39)) &&
                    ((this.selectionStart < readOnlyLength) ||
                        ((this.selectionStart == readOnlyLength) && (event.which == 8)))) {
                    return false;
                }
            }
        });
        //show settings for question
        $('.constr-wrap').on('click', '.show-settings', function (e) {
            let question = $(this).parents('.question-wrap');
            if ($(this).hasClass('active')) {
                question.find('.question-settings').fadeOut(300);
                $(this).removeClass('active');
            } else {
                question.find('.question-settings').fadeIn(300);
                $(this).addClass('active');
            }
        });
        // question in focus
        $('.constr-wrap').on('click', '.question-wrap', function (e) {
            if (!$(e.target).hasClass('remove-question')) {
                if (!$(this).hasClass('focus')) {
                    $('.constr-wrap .question-wrap').removeClass('focus');
                    $(this).addClass('focus');
                }
            }
        });

        //remove question
        $('.constr-wrap').on('click', '.question-wrap .remove-question', function (e) {
            let question = $(this).parents('.question-wrap');
            removeQuestion(question);
        });

        function removeQuestion(question) {
            $(question).remove();
            if ($('.questions-list').children('.question-wrap').length === 0) {
                $('.questions-box').addClass('empty');
            } else {
                refreshQuestionsId();
            }
        }

        //events for files

        //upload img
        $('.constr-wrap').on('change', '.file-img input[type=file]', function (e) {
            let input = this;
            let question = $(this).parents('.question-wrap');
            if (input.files && input.files[0]) {
                let fileWrap = question.find('.added-file-wrap');
                if (fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap = question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let imgHtml =
                    `<div class="img-wrap">
                        <img src="" alt="Img">
                        <div class="img-remove"></div>
                    </div>`;
                $(imgHtml).appendTo(fileWrap);
                let img = question.find('.added-file-wrap img');
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.attr('src', e.target.result);
                    setFileActive(input);
                };
                reader.readAsDataURL(input.files[0]);
            }
        });
        //upload audio
        $('.constr-wrap').on('change', '.file-audio input[type=file]', function (e) {
            let question = $(this).parents('.question-wrap');
            let fileWrap = question.find('.added-file-wrap');
            let input = this;
            let inputFile = e.target;
            if (inputFile.files && inputFile.files[0]) {
                if (fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap = question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let audioHtml =
                    `<div class="audio-wrap">
                        <div class="audio-control"></div>
                        <div class="audiowave" data-audiopath=""></div>
                        <div class="audio-duration"></div>
                        <div class="audio-remove"></div>
                    </div>`;
                $(audioHtml).appendTo(fileWrap);

                let audio = question.find('.added-file-wrap .audiowave');
                audio.stop();
                var reader = new FileReader();
                reader.onload = function (e) {
                    audio.attr('data-audiopath', e.target.result);
                    setAudioWave(audio[0], e.target.result);
                    setFileActive(input);
                };
                reader.readAsDataURL(inputFile.files[0]);
            }
        });
        //upload video
        $('.constr-wrap').on('change', '.file-video input[type=file]', function (e) {
            let question = $(this).parents('.question-wrap');
            let input = this;
            if (this.files && this.files[0]) {
                fileWrap = question.find('.added-file-wrap');
                if (fileWrap.length === 0) {
                    let wrapHtml = '<div class="added-file-wrap"></div>';
                    $(wrapHtml).insertAfter(question.find('.question-name'));
                    fileWrap = question.find('.added-file-wrap');
                } else {
                    fileWrap.html('');
                }
                let videoHtml =
                    `<div class="video-wrap">
                        <video-radio-star>
                            <video>
                                <source src="./files-for-test/video.mp4">
                                Your browser does not support HTML5 video.
                            </video>
                            <button type="button" class="video-play" data-play></button>
                        </video-radio-star>
                        <div class="video-remove"></div>
                    </div>`;
                $(videoHtml).appendTo(fileWrap);
                let source = fileWrap.find('source');
                source[0].src = URL.createObjectURL(this.files[0]);
                setFileActive(input);
            }
        });

        $('.constr-wrap').on('click', '.video-wrap video', function (e) {
            e.preventDefault();
            let videoWrap = $(this).parent();
            let video = videoWrap.find('video').get(0);
            if (video.paused) {
                $(video).prop('controls', true);
                video.play();
            } else {
                video.pause();
                $(video).prop('controls', false);
            }
        });

        //set active type of file
        function setFileActive(input) {
            let question = $(input).parents('.question-wrap');
            if ($(input).parents('.file-video').length === 0) {
                clear_form_elements(question.find('.file-video'));
                question.find('.file-video label').removeClass('active');
            }
            if ($(input).parents('.file-audio').length === 0) {
                clear_form_elements(question.find('.file-audio'));
                question.find('.file-audio label').removeClass('active');
            }
            if ($(input).parents('.file-img').length === 0) {
                clear_form_elements(question.find('.file-img'));
                question.find('.file-img label').removeClass('active');
            }
            $(input).parents('.file-item').find('label').addClass('active');
            $(input).parents('.attach-file').find('.attach-file-icon').addClass('active');
        }
        //remove img
        $('.constr-wrap').on('click', '.question-wrap .img-remove', function (e) {
            removeFile(this);
        });
        //remove audio
        $('.constr-wrap').on('click', '.question-wrap .audio-remove', function (e) {
            removeFile(this);
        });
        //remove video
        $('.constr-wrap').on('click', '.question-wrap .video-remove', function (e) {
            removeFile(this);
        });

        //remove file
        function removeFile(el) {
            let question = $(el).parents('.question-wrap');
            let fileWrap = question.find('.added-file-wrap');
            fileWrap.remove();
            clear_form_elements(question.find('.attach-files-wrap'));
            question.find('.attach-files-wrap label').removeClass('active')
            $(question).find('.attach-file-icon').removeClass('active');
        }
        //end events for files

        //settings for single question

        //single input point in focus
        $('.content-wrap').on('focus', '.question-single .radio-item textarea', function (e) {
            $(this).parents('.radio-item').addClass('focus');
        });

        //single input point out of focus
        $('.content-wrap').on('blur', '.question-single .radio-item textarea', function (e) {
            $(this).parents('.radio-item').removeClass('focus');
        });

        //add new single item
        $('.content-wrap').on('change', '.question-single .input-single-item', function (e) {
            let text = $(this).val();
            if (text) {
                let thisQuestion = $(this).parents('.question-wrap');
                let itemsList = thisQuestion.find('.radio-btns-wrapper');
                let questionId = thisQuestion.attr('data-id');
                let pointId = itemsList.children().length + 1;
                if (questionId && pointId && text && itemsList) {
                    addSingleOption(questionId, pointId, text, itemsList);
                }
                clear_form_elements($(this).parents('.input-new-item-wrap'));
            }
        });
        //click out of input single option
        $(document).click(function (event) {
            var $target = $(event.target);
            if (!$target.hasClass('input-single-item')) {
                $('.input-single-item').change();
            }
        });
        //click enter
        $(document).on('keypress', function (e) {
            if (e.which == 13) {
                if ($(e.target).hasClass('input-single-item')) {
                    e.preventDefault();
                    $(e.target).change();
                }
            }
        });

        function addSingleOption(questionId, pointId, text, itemsList, addClas = ' ') {
            let itemsName = "inputpoint_" + questionId + "_" + pointId;
            let itemHtml =
                '<div class="radio-item ' + addClas + '">' +
                '    <div class="remove-item"></div>' +
                '    <textarea name="' + itemsName + '" rows="1" placeholder="Вариант ответа">' + text + '</textarea>' +
                '</div>';
            $(itemsList).append(itemHtml);
            $(itemsList).find('textarea').autoResize();
        }

        // remove single item
        $('.content-wrap').on('click', '.question-single .radio-item .remove-item', function (e) {
            let itemEl = $(this).parents('.radio-item');
            removeSingleOption(itemEl);
        });

        function removeSingleOption(itemEl) {
            let itemQuestion = itemEl.parents('.question-wrap');
            let itemsList = itemEl.parents('.radio-btns-wrapper');
            if ($(itemEl).hasClass('neither')) {
                itemQuestion.find('.add-neither').prop('checked', false);;
            }
            if ($(itemEl).hasClass('other')) {
                itemQuestion.find('.add-other').prop('checked', false);;
            }
            $(itemEl).remove();
            refreshSingleOptionsId(itemsList);
        }

        //refresh id for single options
        function refreshSingleOptionsId(itemsList) {
            let options = itemsList.children();
            for (let i = 0; i < options.length; i++) {
                let id = i + 1;
                let textareas = $(options[i]).find('textarea');
                changeNameInput(textareas, id, 2);
            }
        }
        //show single options add other or comment
        $('.content-wrap').on('change', '.question-wrap .show-hidden-opt', function (e) {
            if ($(this).is(':checked')) {
                $(this).parents('.switch-group').find('.hidden-options').fadeIn(300);
            } else {
                $(this).parents('.switch-group').find('.hidden-options').fadeOut(300);
                clear_form_elements($(this).parents('.switch-group').find('.hidden-options'));
            }
        });

        //add single option other
        $('.content-wrap').on('change', '.question-single .add-other', function (e) {
            let thisQuestion = $(this).parents('.question-wrap');
            let itemsList = thisQuestion.find('.radio-btns-wrapper');
            let questionId = thisQuestion.attr('data-id');
            let pointId = itemsList.children().length + 1;
            let text = 'Другое';
            if ($(this).is(':checked')) {
                addSingleOption(questionId, pointId, text, itemsList, 'other');
            } else {
                let removeEl = itemsList.find('.other');
                removeSingleOption(removeEl);
            }
        });
        //add single option comment
        $('.content-wrap').on('change', '.question-single .add-comment', function (e) {
            let thisQuestion = $(this).parents('.question-wrap');
            if ($(this).is(':checked')) {
                let commnetHtml =
                    '<div class="option-comment">' +
                    '    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>' +
                    '</div>';
                $(commnetHtml).insertBefore(thisQuestion.find('.input-new-item-wrap'));
            } else {
                thisQuestion.find('.option-comment').remove();
            }
        });
        //add single option neither
        $('.content-wrap').on('change', '.question-single .add-neither', function (e) {
            let thisQuestion = $(this).parents('.question-wrap');
            let itemsList = thisQuestion.find('.radio-btns-wrapper');
            let questionId = thisQuestion.attr('data-id');
            let pointId = itemsList.children().length + 1;
            let text = 'Ничего из вышеперечисленного';
            if ($(this).is(':checked')) {
                addSingleOption(questionId, pointId, text, itemsList, 'neither');
            } else {
                let removeEl = itemsList.find('.neither');
                removeSingleOption(removeEl);
            }
        });

        //sortable for single items
        function setSortbaleSingleItems() {
            let questionList = $('.question-single .radio-btns-wrapper');
            for (let i = 0; i < questionList.length; i++) {
                if (!$(questionList[i]).hasClass('sortable')) {
                    $(questionList[i]).addClass('sortable');
                    new Sortable(questionList[i], {
                        scroll: true,
                        forceFallback: true,
                        animation: 150,
                        filter: 'a, .inFocus',
                        preventOnFilter: false,
                        onEnd: function (evt) {
                            let itemsList = $(evt.target);
                            refreshSingleOptionsId(itemsList);
                        },
                    });
                }
            }
        }
        setSortbaleSingleItems();

        $('.content-wrap').on('click', '.question-single .radio-btns-wrapper textarea', function (e) {
            $(this).parent('.radio-item').addClass('inFocus');
            $(this).parent('.radio-item').find('textarea').focus();
        });
        $('.content-wrap').on('blur', '.question-single .radio-btns-wrapper textarea', function (e) {
            $(this).parent('.radio-item').removeClass('inFocus');
        });
        //end settings for single question

        //settings for scale question

        //change type of scale
        $('.content-wrap').on('change', '.question-scale .scale-type', function (e) {
            let question = $(this).parents('.question-wrap');
            let type = $(this).val();
            if (type === 'diapason') {
                if (question.find('diapason'.length === 0)) {
                    addScaleDiapason(question);
                    setDiapasonMax(question);
                }
            } else {
                if (question.find('diapason'.length !== 0)) {
                    addScalePicture(question);
                }
                setClassForScale(question);
            }
        });

        function addScalePicture(question) {
            let amount = question.find('.scale-amount').val();
            if (amount === 'yesNot') {
                amount = 2;
            } else {
                amount = parseInt(amount);
            }
            let questionId = question.attr('data-id');
            let scaleHtml = `<div class="scale-wrap scale-star scale-10">`;
            for (let i = amount; i >= 1; i--) {
                scaleHtml +=
                    `<input type="radio" id="scale_${questionId}_${i}" name="scale_${questionId}" value="10" />
                    <label for="scale_${questionId}_${i}" title="text"></label>`;
            }
            scaleHtml +=
                `</div>`;

            let optionsHtml =
                `<div class="switch-row">
                    <div class="label">
                        Метки рейтинга
                    </div>
                    <label class="switch">
                        <input type="checkbox" class="add-rateLabels" name="rateLabels_${questionId}" id="rateLabels_${questionId}">
                        <span class="slider round"></span>
                    </label>
                </div>`;
            if (question.find('.diapason-answer').length > 0) {
                question.find('.diapason-answer').remove();
            }
            if (question.find('.scale-wrap').length === 0) {
                $(scaleHtml).appendTo('.question-content');
            }
            if (question.find('.add-rateLabels').length === 0) {
                $(optionsHtml).appendTo(question.find('.scale-options'));
            }
            setClassForScale(question);
        }

        function addScaleDiapason(question) {
            question.find('.scale-wrap').remove();
            question.find('.scale-labels-wrap').remove();
            question.find('.add-rateLabels').parents('.switch-row').remove();
            question.find('.labels-option').remove();
            if ($(question).find('.diapason-answer').length === 0) {
                let diapasonHtml =
                    `<div class="diapason-answer">
                    <div class="diapason">
                        <div class="label">
                            <div class="value">0</div>
                        </div>
                        <div class="input-box">
                            <input class="input-range" type="range" min="1" max="10" step="1" value="0"/>
                            <div class="bar"></div>
                            <div class="bar-filled"></div>
                        </div>
                    </div>
                </div>`
                $(diapasonHtml).appendTo($(question).find('.question-content'));
            }
        }

        $('.content-wrap').on('input', '.question-wrap .input-range', function (e) {
            setDiapasonValue(this);
        });

        //set width for input range background
        function setRangeBackground() {
            let ranges = $('.input-range');
            if (ranges.length > 0) {
                for (let i = 0; i < ranges.length; i++) {
                    let barFilled = $(ranges[i]).parents('.question-wrap').find('.bar-filled');
                    let barLenght = $(ranges[i]).width();
                    console.log(barLenght);
                    barFilled.css('background-size', barLenght + 'px');
                }
            }
        }
        setRangeBackground();
        $(window).resize(function () {
            setRangeBackground();
        });
        //set new diapsson value
        function setDiapasonValue(input) {
            var value = $(input).val();
            var max = $(input).attr('max');
            var min = $(input).attr('min');
            var range = max - min;
            var relvalue = value - min;
            var percent = (100 / range) * relvalue;
            var parents = $(input).parents('.diapason');
            var paddleft = (60 * percent) / 100;
            parents.find('.label').css('left', 'calc(' + percent + '% - ' + paddleft + 'px)');
            parents.find('.label .value').html(value);
            parents.find('.input-box .bar-filled').css('width', percent + '%');
            parents.find('.label').css('background-position', percent + '%');
        };

        //change amount of ratings
        $('.content-wrap').on('change', '.question-scale .scale-amount', function (e) {
            let amount = $(this).val();
            if (amount === 'yesNot') {
                amount = 2;
            } else {
                amount = parseInt(amount);
            }
            let question = $(this).parents('.question-wrap');
            if (question.find('.diapason-answer').length !== 0) {
                setDiapasonMax(question);
            } else {
                let scaleWrap = question.find('.scale-wrap');
                let questionId = question.attr('data-id');
                addScaleRate(scaleWrap, amount, questionId);
                setClassForScale(question);
                changeAmountLabel(question);
            }
        });

        //set max value for diapason
        function setDiapasonMax(question) {
            let max = parseInt(question.find('.scale-amount').val());
            if (max > 0) {
                let diapsonInput = question.find('.input-range');
                diapsonInput.attr('max', max);
                let diapasonValue = parseInt(diapsonInput.val());
                if (max < diapasonValue) {
                    diapsonInput.val(max)
                }
                setDiapasonValue(diapsonInput)
            }
        }

        //add class to scale-wrap
        function setClassForScale(question) {
            let type = question.find('.scale-type').val();
            let amount = question.find('.scale-amount').val();
            let scaleWrap = question.find('.scale-wrap');
            let labelWrap = question.find('.scale-labels-wrap');
            let classList = 'scale-wrap ' + 'scale-' + amount;
            let classListLabel = 'scale-labels-wrap ' + 'scale-' + amount;
            switch (type) {
                case 'star':
                    classList += ' scale-star'
                    break;
                case 'face':
                    classList += ' scale-face'
                    break;
                case 'heart':
                    classList += ' scale-heart'
                    break;
                case 'hand':
                    classList += ' scale-hands'
                    break;
            }
            scaleWrap.attr('class', classList);
            labelWrap.attr('class', classListLabel);
        }

        //add scale list
        function addScaleRate(scaleWrap, amount, questionId) {
            console.log(amount);
            let scaleHtml = '';
            for (let i = 1; i <= amount; i++) {
                scaleHtml +=
                    `<input type="radio" id="scale_${questionId}_${i}" name="scale_${questionId}" value="${i}" />
                 <label for="scale_${questionId}_${i}" title="text"></label>`;
            }
            scaleWrap.html(scaleHtml);
        }
        //chnage amount of labels under rate
        function changeAmountLabel(question) {
            let amount = parseInt(question.find('.scale-amount').val());
            let questionId = question.attr('data-id');
            let labelOptionsWrap = question.find('.labels-option');
            let labelsOption = labelOptionsWrap.children();
            let labelScaleWrap = question.find('.scale-labels-wrap');
            let labelsScale = labelScaleWrap.children();
            if (amount > labelsOption.length) {
                for (let i = labelsOption.length + 1; i < amount + 1; i++) {
                    if (!labelsOption[i]) {
                        let labelHtml =
                            `<div class="label-item">
                            <div class="number">${i}</div>
                            <div class="value">
                                <input type="text" name="inputpoint_${questionId}_${i}">
                            </div>
                        </div>`;
                        labelOptionsWrap.append(labelHtml);
                        let labelScaleHtml = `<div class="label-item"></div>`;
                        labelScaleWrap.append(labelScaleHtml);
                    }
                }
            } else {
                for (let i = amount; i < labelsOption.length; i++) {
                    labelsOption[i].remove();
                    labelsScale[i].remove();
                }
            }
        }

        //add\remove labels under rate
        $('.content-wrap').on('change', '.question-scale .add-rateLabels', function (e) {
            let question = $(this).parents('.question-wrap');
            if ($(this).is(':checked')) {
                let labelsScale = `<div class="scale-labels-wrap"></div>`;
                let labelsOption = `<div class="labels-option"></div>`;
                if (question.find('.scale-labels-wrap').length === 0) {
                    $(labelsScale).insertAfter(question.find('.scale-wrap'));
                }
                if (question.find('.labels-option').length === 0) {
                    $(labelsOption).insertAfter($(this).parents('.switch-row'));
                }
                changeAmountLabel(question);
                setClassForScale(question);
            } else {
                question.find('.scale-labels-wrap').remove();
                question.find('.labels-option').remove();
            }
        });
        //input scale label
        $('.content-wrap').on('input', '.question-scale .label-item input[type=text]', function (e) {
            let question = $(this).parents('.question-wrap');
            let labelsWrap = question.find('.scale-labels-wrap');
            let questionId = question.attr('data-id');
            let text = $(this).val();
            let optionId = $(this).parents('.label-item').index() + 1;
            labelsWrap.find(`.label-item:nth-child(${optionId})`).html(text);
        });

        //end settings for scale question

        //settings for dropdown question

        //input option for dropdown
        $('.content-wrap').on('input', '.question-dropdown .option-item input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let optionId = parseInt($(this).parents('.option-item').index()) + 1;
            if (newText && question && optionId) {
                setNewText(question, newText, optionId);
            }
            if (newText && optionId === question.find('.optins-list').children().length) {
                addNewOption(question);
            }
        });
        $('.content-wrap').on('change', '.question-dropdown .option-item input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let optionId = parseInt($(this).parents('.option-item').index()) + 1;
            let newOptionId = parseInt($(this).parents('.option-item').index()) + 1;
            if (!newText && optionId !== $(this).parents('.optins-list').children().length) {
                removeDropdownOption(question, newOptionId);
            }
        });
        //set new text for option select
        function setNewText(question, text, index) {
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');
            if (select.find(`option:nth-child(${index})`).length === 0) {
                let selectHtml = `<option value=""></option>`;
                $(selectHtml).insertAfter(select.find(`option:nth-child(${index - 1})`));

                let customSelectHtml = `<li rel=""></li>`;
                $(customSelectHtml).insertAfter(customSelect.find('.select-options').find(`li:nth-child(${index - 1})`));
            }

            if (customSelect.find(`li:nth-child(${index})`).hasClass('active') ||
                (index === 1 && customSelect.find('li.active').length === 0)) {
                if (customSelect.hasClass('customselect-multiple')) {
                    let optionVal = customSelect.find(`li:nth-child(${index})`).attr('rel');
                    let seletValue = customSelect.find(`.select-styled .selectvalue[data-value="${optionVal}"]`);
                    seletValue.attr('data-value', text);
                    seletValue.find('.value').text(text);
                } else {
                    customSelect.find('.select-styled').html(text);
                }
            }

            select.find(`option:nth-child(${index})`).html(text);
            select.find(`option:nth-child(${index})`).prop('value', text);

            customSelect.find(`li:nth-child(${index})`).html(text);
            customSelect.find(`li:nth-child(${index})`).attr('rel', text);
        }

        //add new option to select
        function addNewOption(question, className = "", value = "", last = true) {
            let optionList = question.find('.optins-list');
            let questionId = question.attr('data-id');
            let optionId = parseInt(optionList.children().length) + 1;
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');
            if (last === false) {
                optionId = optionId - 1;
            }
            let optionHtml =
                `<div class="option-item ${className}">
                    <div class="number">${optionId}.</div>
                    <div class="value">
                        <input type="text" name="inputpoint_${questionId}_${optionId}" value="${value}">
                    </div>
                </div>`;
            $(optionHtml).insertAfter(optionList.find(`.option-item:nth-child(${optionId - 1})`));
            let selectHtml = `<option value="${value}"></option>`;
            $(selectHtml).insertAfter(select.find(`option:nth-child(${optionId - 1})`));

            let customSelectHtml = `<li rel="${value}">${value}</li>`;
            $(customSelectHtml).insertAfter(customSelect.find('.select-options').find(`li:nth-child(${optionId - 1})`));
        }

        //remove option from select
        function removeDropdownOption(question, optionId) {
            let optionList = question.find('.optins-list');
            let select = question.find('.dropdown-wrap select');
            let customSelect = question.find('.customselect-wrapper');
            if (select.find(`option:nth-child(${optionId})`).length != 0) {
                select.find(`option:nth-child(${optionId})`).remove();
            }
            if (customSelect.find(`li:nth-child(${optionId})`).length != 0) {
                if (customSelect.find(`li:nth-child(${optionId})`).hasClass('active')) {
                    customSelect.find(`li:nth-child(${optionId})`).click();
                }
                customSelect.find(`li:nth-child(${optionId})`).remove();
            }
            if (optionList.find(`.option-item:nth-child(${optionId})`).length != 0) {
                optionList.find(`.option-item:nth-child(${optionId})`).remove();
            }
            refreshDropdownInputs(question.find('.optins-list'));
        }

        //add other option to select
        $('.content-wrap').on('change', '.question-dropdown .add-other', function (e) {
            let question = $(this).parents('.question-wrap');
            let text = 'Другое';
            if ($(this).is(':checked')) {
                addNewOption(question, 'other-option', text, false);
                refreshDropdownInputs(question.find('.optins-list'));
            } else {
                let index = question.find('.optins-list').find('.other-option').index() + 1;
                removeDropdownOption(question, index);
            }
        });

        //add neither option to select
        $('.content-wrap').on('change', '.question-dropdown .add-neither', function (e) {
            let question = $(this).parents('.question-wrap');
            let text = 'Ничего из вышеперечисленного';
            if ($(this).is(':checked')) {
                addNewOption(question, 'neither-option', text, false);
                refreshDropdownInputs(question.find('.optins-list'));
            } else {
                let index = question.find('.optins-list').find('.other-option').index() + 1;
                removeDropdownOption(question, index);
            }
        });

        //make dropdown multiple
        $('.content-wrap').on('click', '.question-dropdown .make-multiple', function (e) {
            let question = $(this).parents('.question-wrap');
            let selectWrap = question.find('.customselect-wrapper');
            if ($(this).is(':checked')) {
                selectWrap.addClass('customselect-multiple');
                selectWrap.find('select').attr('multiple', 'multiple');
                selectWrap.find('.select-styled').html('<div class="default">Выберите ответ</div>');
            } else {
                selectWrap.removeClass('customselect-multiple');
                selectWrap.find('select').removeAttr('multiple');
            }
            selectWrap.find('.select-options li.active').click();
        });

        //add to dropdown  comment
        $('.content-wrap').on('change', '.question-dropdown .add-comment', function (e) {
            let question = $(this).parents('.question-wrap');
            if ($(this).is(':checked')) {
                let commentHtml =
                    `<div class="option-comment">
                        <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                    </div>`
                $(commentHtml).insertAfter(question.find('.dropdown-wrap'));
            } else {
                question.find('.option-comment').remove();
            }
        });
        //refresh ids for input
        function refreshDropdownInputs(optionList) {
            let options = optionList.children();
            for (let i = 0; i < options.length; i++) {
                let id = i + 1;
                $(options[i]).find('.number').html(`${id}.`);
                let inputs = $(options[i]).find('input');
                changeNameInput(inputs, id, 2);
            }
        }
        //end settings for dropdown question

        //settings for matrix question

        //input name of row for matrix
        $('.content-wrap').on('input', '.question-matrix .matrix-row input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let rowItem = $(this).parents('.matrix-row');
            let rowIndex = parseInt(rowItem.index()) + 2;
            let rowHtml = question.find('.matrix-table').find(`tr:nth-child(${rowIndex})`);
            if (rowHtml.length > 0) {
                rowHtml.find('td:nth-child(1)').html(newText);
            } else {
                addMatrixRow(question, newText);
            }
        });
        //out of focus row input
        $('.content-wrap').on('blur', '.question-matrix .matrix-row input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let rowItem = $(this).parents('.matrix-row');
            let rowIndex = parseInt(rowItem.index()) + 1;
            if (!newText && rowIndex !== question.find('.matrix-row-list').children().length) {
                removeMatrixRow(question, rowIndex);
            }
        });
        //input name of col for matrix
        $('.content-wrap').on('input', '.question-matrix .matrix-col input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let colItem = $(this).parents('.matrix-col');
            let colIndex = parseInt(colItem.index()) + 2;
            let colHtml = question.find('.matrix-table').find(`tr:nth-child(1)`).find(`td:nth-child(${colIndex})`);
            if (colHtml.length > 0) {
                colHtml.html(newText);
            } else {
                addMatrixCol(question, newText);
            }
        });
        //out of focus col input
        $('.content-wrap').on('blur', '.question-matrix .matrix-col input[type=text]', function (e) {
            let newText = $(this).val();
            let question = $(this).parents('.question-wrap');
            let colItem = $(this).parents('.matrix-col');
            let colIndex = parseInt(colItem.index()) + 1;
            if (!newText && colIndex !== question.find('.matrix-col-list').children().length) {
                removeMatrixCol(question, colIndex);
            }
        });
        //add row to matrix table
        function addMatrixRow(question, text) {
            let table = question.find('.matrix-table');
            let questionId = question.attr('data-id');
            let rowHtml =
                `<tr>
                    <td>${text}</td>
                `;
            let rowIndex = table.find('tr').length;
            let colAmount = table.find('tr:nth-child(1)').find('td').length;

            for (let i = 1; i < colAmount; i++) {
                rowHtml +=
                    `<td>
                        <div class="matrix-check">
                            <input type="radio" name="q_${questionId}_${rowIndex}" id="q_${questionId}_${rowIndex}_${i}" placeholder="Введите текст строки">
                            <label for="q_${questionId}_${rowIndex}_${i}"></label>
                        </div>
                    </td>`;
            }
            rowHtml +=
                `   </tr>`;
            $(rowHtml).insertAfter(table.find('tr:last-child()'));

            //add empty input row
            let inputRowHtml =
                `<div class="matrix-row">
                    <div class="value">
                        <input type="text" name="inputRow_${questionId}_${rowIndex}" placeholder="Введите текст строки">
                    </div>
                </div>`;
            $(inputRowHtml).appendTo($(question).find('.matrix-row-list'));
        }

        //add col to matrix table
        function addMatrixCol(question, text) {
            let table = question.find('.matrix-table');
            let questionId = question.attr('data-id');
            let tableRows = table.find('tr');
            let colId = $(tableRows[0]).find('td').length;
            for (let i = 0; i < tableRows.length; i++) {
                if (i === 0) {
                    let colHeaderHtml = `<td>${text}</td>`;
                    $(colHeaderHtml).appendTo(tableRows[i]);
                } else {
                    let colHtml =
                        `<td>
                            <div class="matrix-check">
                                <input type="radio" name="q_${questionId}_${i}" id="q_${questionId}_${i}_${colId}" placeholder="Введите текст столбца">
                                <label for="q_${questionId}_${i}_${colId}"></label>
                            </div>
                        </td>`;
                    $(colHtml).appendTo(tableRows[i]);
                }
            }

            //add empty input col
            let inputColHtml =
                `<div class="matrix-col">
                <div class="value">
                    <input type="text" name="inputCol_${questionId}_${colId}" placeholder="Введите текст столбца">
                </div>
            </div>`;
            $(inputColHtml).appendTo($(question).find('.matrix-col-list'));
        }

        //remove matrix col
        function removeMatrixCol(question, colId) {
            let table = question.find('.matrix-table');
            let inputColList = question.find('.matrix-col-list');
            let tableRow = table.find('tr');
            let tableColId = colId + 1;
            for (let i = 0; i < tableRow.length; i++) {
                $(tableRow[i]).find(`td:nth-child(${tableColId})`).remove();
            }
            inputColList.find(`.matrix-col:nth-child(${colId}`).remove();
            refreshMatrixID(question);
        }

        //remove matrix row
        function removeMatrixRow(question, rowId) {
            let table = question.find('.matrix-table');
            let inputRowList = question.find('.matrix-row-list');
            let tableRowId = rowId + 1;
            let deletedRow = table.find(`tr:nth-child(${tableRowId})`);
            deletedRow.remove();
            inputRowList.find(`.matrix-row:nth-child(${rowId}`).remove();
            refreshMatrixID(question);
        }
        //refresh matrix ids
        function refreshMatrixID(question) {
            let table = question.find('.matrix-table');
            let rowTable = table.find('tr');
            let rowList = question.find('.matrix-row-list').children();
            let colList = question.find('.matrix-col-list').children();
            for (let i = 0; i < rowTable.length; i++) {
                if (i !== 0) {
                    let colTable = $(rowTable[i]).find('td')
                    let inputsRow = $(rowTable[i]).find('input');
                    let labelsRow = $(rowTable[i]).find('label');
                    // set row Id
                    changeNameInput(inputsRow, i, 2);
                    changeNameInput(labelsRow, i, 2);
                    for (let i2 = 0; i2 < colTable.length; i2++) {
                        if (i2 != 0) {
                            let inputs = $(colTable[i2]).find('input');
                            let labels = $(colTable[i2]).find('label');
                            //set col id
                            changeNameInput(inputs, i2, 3);
                            changeNameInput(labels, i2, 3);
                        }
                    }
                }
            }
            for (let i = 0; i < rowList.length; i++) {
                let inputs = $(rowList[i]).find('input');
                let id = i + 1;
                changeNameInput(inputs, id, 2);
            }
            for (let i = 0; i < colList.length; i++) {
                let inputs = $(colList[i]).find('input');
                let id = i + 1;
                changeNameInput(inputs, id, 2);
            }
        }
        //change multiple\single choice
        $('.content-wrap').on('change', '.question-matrix .add-multipleChoice', function (e) {
            let question = $(this).parents('.question-wrap');
            let table = question.find('.matrix-table');
            let inputs = table.find('input');
            if ($(this).is(':checked')) {
                for (let i = 0; i < inputs.length; i++) {
                    if ($(inputs[i]).attr('type') === 'radio') {
                        $(inputs[i]).attr('type', 'checkbox');
                        let inputId = $(inputs[i]).attr('id');
                        $(inputs[i]).attr('name', inputId);
                    }
                }
            } else {
                for (let i = 0; i < inputs.length; i++) {
                    if ($(inputs[i]).attr('type') === 'checkbox') {
                        let oldName = $(inputs[i]).attr('name').split("_");
                        oldName.pop();
                        let newId = oldName.join('_');
                        $(inputs[i]).attr('name', newId);
                        $(inputs[i]).attr('type', 'radio');
                    }
                }
            }
        });
        //add comment to matrix question
        $('.content-wrap').on('change', '.question-matrix .add-comment', function (e) {
            let question = $(this).parents('.question-wrap');
            if ($(this).is(':checked')) {
                let commnetHtml =
                    '<div class="option-comment">' +
                    '    <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>' +
                    '</div>';
                $(commnetHtml).insertAfter(question.find('.matrix-table'));
            } else {
                question.find('.option-comment').remove();
            }
        });
        //end settings for matrix question

        //settings for ranging question

        //dragable and sortable for ranging items
        function setSortbaleRanging() {
            $('.question-ranging .ranging-list').sortable({
                cancel: 'a, button, textarea, .empty-item, .customselect-wrapper',
                containment: 'parent',
                cursor: 'grab',
                stop: function (event, ui) {
                    let question = $(ui.item).parents('.question-wrap');
                    refreshRangeId(question);
                }
            });
        }
        setSortbaleRanging();
        //input new ranging item
        $('.content-wrap').on('input', '.question-ranging .empty-item textarea', function (e) {
            let question = $(this).parents('.question-wrap');
            let newText = $(this).val();
            let thisItem = $(this).parents('.ranging-item');
            let thisRangeList = thisItem.parents('.ranging-list');
            let questionID = question.attr('data-id');
            if (newText) {
                let newItemId = question.find('.ranging-list').children().length + 1;
                let newItemHtml =
                    `<div class="ranging-item empty-item">
                        <div class="grab-icon"></div>
                        <div class="ranging-name">
                            <textarea name="inputpoint_${questionID}_${newItemId}" placeholder="Введите вариант ответа" rows="1"></textarea>
                        </div>
                    </div>`;
                thisItem.removeClass('empty-item');
                $(newItemHtml).insertAfter(thisItem);
                $(thisRangeList).find('.empty-item').find('textarea').autoResize();
            }
        });

        $('.content-wrap').on('blur', '.question-ranging .ranging-item textarea', function (e) {
            let thisText = $(this).val();
            let thisItem = $(this).parents('.ranging-item');
            let question = $(this).parents('.question-wrap');
            if (!thisText && !thisItem.hasClass('empty-item')) {
                thisItem.remove();
                refreshRangeId(question);
            }
        });

        function refreshRangeId(question) {
            let rangeList = question.find('.ranging-list').children();
            if (rangeList.length > 0) {
                for (let i = 0; i < rangeList.length; i++) {
                    let id = i + 1;
                    let input = $(rangeList[i]).find('textarea');
                    console.log(input);
                    changeNameInput(input, id, 2);
                }
            }
        }
        //end settings for ranging question

        //settings for date question

        //mask for input date
        var dateInputMask = function dateInputMask(elm) {
            elm.addEventListener('keypress', function (e) {
                if (e.keyCode < 47 || e.keyCode > 57) {
                    e.preventDefault();
                }

                var len = elm.value.length;

                // If we're at a particular place, let the user type the slash
                // i.e., 12.12.1212
                if (len !== 1 || len !== 3) {
                    if (e.keyCode == 47) {
                        e.preventDefault();
                    }
                }

                // If they don't add the slash, do it for them...
                if (len === 2) {
                    elm.value += '.';
                }

                // If they don't add the slash, do it for them...
                if (len === 5) {
                    elm.value += '.';
                }
            });
        };
        //set input mask for date
        function setInputMaskDate() {
            var dateInputs = $('.date-input');
            for (let i = 0; i < dateInputs.length; i++) {
                dateInputMask(dateInputs[i]);
            }
        }
        setInputMaskDate();

        function setDatePicker() {
            //settings for date question
            $('.date-input').datepicker({
                gotoCurrent: true,
                showOtherMonths: false,
                altFormat: "mm.dd.yyyy",
                dateFormat: "mm.dd.yyyy",
            });
            setInputMaskDate();
        }
        //add few date input
        $('.content-wrap').on('change', '.question-date .amount-select', function (e) {
            let count = $(this).val();
            let question = $(this).parents('.question-wrap');
            let dataList = question.find('.data-list');
            let dataInputs = dataList.children();
            let curCount = parseInt(dataInputs.length);
            if (count === 'dynamic') {
                count = 1;
            }
            if (count > curCount) {
                for (let i = curCount; i < count; i++) {
                    let newInput =
                        `<div class="date-answer">
                        <input type="text" class="date-input" maxlength="10">
                        <div class="icon-date"></div>
                    </div>`;
                    $(newInput).appendTo(dataList);
                }
            }
            if (count < curCount) {
                for (let i = 0; i < curCount; i++) {
                    if (i >= count) {
                        dataInputs[i].remove();
                    }
                }
            }
            setDatePicker();
        });
        //end settings for date question

        //settings for free question
        $('.content-wrap').on('change', '.question-free .amount-select', function (e) {
            let question = $(this).parents('.question-wrap');
            let amount = $(this).val();
            let freeListWrap = question.find('.free-answers');
            let freeList = freeListWrap.children();
            let currentAmount = freeList.length;
            if (amount === 'dynamic') {
                amount = 1;
            }
            if (amount >= currentAmount) {
                for (let i = currentAmount; i < amount; i++) {
                    let freeHtml =
                        `<div class="answer-wrap">
                            <textarea rows="1" placeholder="Введите ваш комментарий"></textarea>
                        </div>`;
                    freeListWrap.append(freeHtml);
                }
            } else {
                for (let i = amount; i < currentAmount; i++) {
                    $(freeList[i]).remove();
                }
            }
        });
        //end settings for free question

        //settings for phone question
        $('.question-phone input.code').intlTelInput({
            initialCountry: "ru",
        });
        //end settings for phone question

        //settings for file question

        //add icons and names of uploaded files 
        $('.content-wrap').on('change', '.question-file input[type=file]', function (e) {
            let files = this.files;
            let question = $(this).parents('.question-wrap');
            if (question.find('.uploaded-list').length === 0) {
                let listHtml = `<div class="uploaded-list"></div>`
                $(listHtml).insertAfter($(this).parents('.file-answer'));
            }
            let filesWrap = question.find('.uploaded-list');
            let fileList = '';
            for (let i = 0; i < files.length; i++) {
                let fileName = files[i].name;
                let lastDot = fileName.lastIndexOf('.');
                let ext = fileName.substring(lastDot + 1);
                let iconClass = '';
                if (ext === 'doc' || ext === 'docx' || ext === 'dot' || ext === 'docm' || ext === 'dotx' || ext === 'dotm') {
                    iconClass = 'file-icon-word';
                } else if (ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'jpg' ||
                    ext === 'jpeg' || ext === 'webp' || ext === 'svg') {
                    iconClass = 'file-icon-img';
                } else if (ext === 'avi' || ext === 'mp4' || ext === 'webm' || ext === '3gp' || ext === '3gpp' ||
                    ext === 'flv' || ext === 'm4v' || ext === 'mkv' || ext === 'mov' || ext === 'mpeg' ||
                    ext === 'mpeg4' || ext === 'ogg' || ext === 'ogv' || ext === 'wmv') {
                    iconClass = 'file-icon-video';
                } else if (ext === 'wav' || ext === 'mp3' || ext === 'm4a' || ext === 'wma' || ext === 'flac' || ext === 'aiff') {
                    iconClass = 'file-icon-audio';
                } else if (ext === 'xlsx' || ext === 'xlsm' || ext === 'xltx' || ext === 'xls' || ext === 'xml') {
                    iconClass = 'file-icon-exel';
                } else if (ext === 'pdf') {
                    iconClass = 'file-icon-pdf';
                } else if (ext === 'pptx' || ext === 'pptm' || ext === 'pptm' || ext === 'ppt') {
                    iconClass = 'file-icon-pp';
                }
                let itemHtml =
                    `<div class="file-item">
                        <div class="file-icon ${iconClass}"></div>
                        <div class="file-name">
                            ${fileName}
                        </div>
                    </div>`;
                fileList += itemHtml;
            }
            filesWrap.html(fileList);
        });
        //end settings file for  question

        //function for clear inputs in block
        function clear_form_elements(block) {
            jQuery(block).find(':input').each(function () {
                switch (this.type) {
                    case 'password':
                    case 'text':
                    case 'textarea':
                    case 'file':
                    case 'select-one':
                    case 'select-multiple':
                    case 'date':
                    case 'number':
                    case 'tel':
                    case 'email':
                        jQuery(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                        this.checked = false;
                        break;
                }
                $(this).change();
            });
        }

        //refresh questions id
        function refreshQuestionsId() {
            let questions = $('.questions-box').find('.questions-list').children('.question-wrap');
            if (questions.length > 0) {
                for (let i = 0; i < questions.length; i++) {
                    let id = i + 1;
                    $(questions[i]).attr('data-id', id);
                    let textareas = $(questions[i]).find('textarea');
                    changeNameInput(textareas, id, 1);
                    let inputs = $(questions[i]).find('input');
                    changeNameInput(inputs, id, 1);
                    let labels = $(questions[i]).find('label');
                    changeNameInput(labels, id, 1);
                    let selects = $(questions[i]).find('select');
                    changeNameInput(selects, id, 1);

                    let questionName = $(questions[i]).find('.question-name textarea');
                    let valueName = questionName.val().split('. ');
                    if (!questionName.val()) {
                        let nameString = id + '. ';
                        questionName.val(nameString);
                    } else if (valueName.length > 1 && $.isNumeric(valueName[0])) {
                        valueName[0] = id;
                        let nameString = valueName.join(". ");
                        questionName.val(nameString);
                    } else if (!$.isNumeric(valueName[0]) || valueName.length === 1) {
                        let nameString = id + '. ' + valueName.join(". ");
                        questionName.val(nameString);
                    }
                }
            }
        }

        //change id in inputs name
        function changeNameInput(inputs, id, position) {
            for (let i = 0; i < inputs.length; i++) {
                if ($(inputs[i]).attr('name')) {
                    prevId = $(inputs[i]).attr('name').split("_");
                    if (prevId[position]) {
                        prevId[position] = id;
                        newId = prevId.join('_');
                        $(inputs[i]).attr('name', newId);
                    }
                }
                if ($(inputs[i]).attr('id')) {
                    prevId = $(inputs[i]).attr('id').split("_");
                    if (prevId[position]) {
                        prevId[position] = id;
                        newId = prevId.join('_');
                        $(inputs[i]).attr('id', newId);
                    }
                }
                if ($(inputs[i]).attr('for')) {
                    prevId = $(inputs[i]).attr('for').split("_");
                    if (prevId[position]) {
                        prevId[position] = id;
                        newId = prevId.join('_');
                        $(inputs[i]).attr('for', newId);
                    }
                }
            }
            return true;
        }

        //make audiowave
        $('.audiowave').each(function () {
            var path = $(this).attr('data-audiopath'); //path for audio
            setAudioWave(this, path);
        });

        // wavesurfer for audio elements
        function setAudioWave(el, path) {
            //Initialize WaveSurfer
            var wavesurfer = WaveSurfer.create({
                container: el,
                scrollParent: false,
                backgroundColor: '#FFFFFF',
                height: 40,
                barMinHeight: 1,
                barWidth: 1.5,
                cursorWidth: 0,
                barGap: 1.5,
                waveColor: '#E5E5E5',
                hideScrollbar: true,
                progressColor: "#000000"
            });

            //Load audio file
            wavesurfer.load(path);

            // Show video duration
            wavesurfer.on('ready', function () {
                $(el).parents('.audio-wrap').find('.audio-duration').html(formatTime(wavesurfer.getDuration()));
            });

            wavesurfer.on('pause', function () {
                $(el).parents('.audio-wrap').find('.audio-control').removeClass('pause');
            });

            wavesurfer.on('play', function () {
                $(el).parents('.audio-wrap').find('.audio-control').addClass('pause');
            });
            //Add button event
            $(el).parents('.audio-wrap').find('.audio-control').click(function () {
                wavesurfer.playPause();
            });
        }

        //seconds to time
        function formatTime(time) {
            return [
                Math.floor((time % 3600) / 60), // minutes
                ('00' + Math.floor(time % 60)).slice(-2) // seconds
            ].join(':');
        };

    });
});