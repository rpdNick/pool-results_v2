import {
    chapterWrapper
} from './constants/chpters-constants.js';

export let hasChapter = false;
export let chapterList = [];

export function showChaptersList() {
    console.log('test');
}

export function addChapter() {
    hasChapter = true;
    createChapter();
}

function createChapter() {
    updateQuestionsBox();
    const $questions = $('.questions-list')
        .find('.question-wrap')
        .clone();
    const $chapterWRP = $($.parseHTML(chapterWrapper)[0]);
    $chapterWRP.attr('data-index', chapterList.length)
    $chapterWRP.find('.chapter-head .chapter-number').text(`${chapterList.length + 1}.`);
    $('.btn-preview-wrap').show();

    if (!chapterList.length) {
        $('.questions-list').find('.question-wrap').remove();
        $chapterWRP.find('.chapter-questions-list').append($questions);
        updateChapterQuestionsIndex($chapterWRP);
        $('.questions-list').prepend($chapterWRP);
        $('.chapter').show();
    } else {
        $chapterWRP.insertAfter(chapterList[chapterList.length - 1]);
    }

    chapterList.push($chapterWRP);
}

function updateQuestionsBox() {
    const $qBox = $('.questions-box.empty');
    $qBox.removeClass('empty');
}

function updateChaptersIndex() {
    chapterList.forEach(($chapter, newIndex) => {
        $chapter.attr('data-index', newIndex);
        $chapter.find('.chapter-head .chapter-number').text(`${newIndex+1}.`);
        $chapter.attr('data-index', newIndex);
        updateChapterQuestionsIndex($chapter);
    });
}

function updateChapterQuestionsIndex($chapter) {
    const $questions = $chapter.find('.question-wrap');
    const chapterIndex = $chapter.attr('data-index') * 1 + 1;

    $questions.map((index, qustion) => {
        $(qustion).find('.chapter').text(`${chapterIndex}/`);
        $(qustion).find('.question-name textarea').val(`${index + 1}.`);
    });
    $('.chapter').show();
}

export function deleteChapter($chapter) {
    const deleteChapterIndex = $chapter.attr('data-index');
    chapterList = chapterList.filter($chapter => $chapter.attr('data-index') !== deleteChapterIndex);
    $chapter.remove();
    updateChaptersIndex();
    if (chapterList.length == 0) {
        hasChapter = false;
        $('.btn-preview-wrap').hide();
    }
}

export function addQuestionToChapter(questionTXT) {
    let $lastChapter = chapterList[chapterList.length - 1];
    $lastChapter.find('.chapter-questions-list').append(questionTXT);
    updateChapterQuestionsIndex($lastChapter);
    $('.chapter').show();
}