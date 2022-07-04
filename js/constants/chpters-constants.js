let chapterHead = `
<div class="chapter-head">
    <div class="chapter-desciption-wrapper">
        <span class="chapter-number"></span>
        <textarea name="" id=""></textarea>
    </div>  
    <div class="chapter-control-panel">
    <div class="remove-chapter"></div>
    <div class="show-chapter-setting show-settings"></div>
    </div>
</div>
<div class="chapter-settings">
    <div class="chapter-settings-row">
        <span>После раздела 1:</span>
        <div class="option-value">
            <select name="chapter-options" class="customselect scale-amount">
                <option selected value="Перейти к следующему разделу">Перейти к следующему разделу</option>
                <option value="Перейти к разделу 2">Перейти к разделу 2: "Название раздела"</option>
                <option value="Перейти к разделу 3">Перейти к разделу 3: "Название раздела"</option>
                <option value="Отправить анкету">Отправить анкету</option>
            </select>
        </div>
    </div>
</div>`

export const chapterWrapper = `<div class="chapter-wrapper" style="border: 1px solid blue;">
    ${chapterHead}
    <div class="chapter-questions-list"></div>
</div>`;