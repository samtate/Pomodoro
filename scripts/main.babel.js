window.addEventListener('DOMContentLoaded', () => {

    const $breakUp = document.getElementById('breakup');
    const $breakDown = document.getElementById('breakdown');
    const $timerUp = document.getElementById('timerup');
    const $timerDown = document.getElementById('timerdown');

    const $breakSpan = document.getElementById('breakspan');
    const $timerSpan = document.getElementById('timerspan');

    const $button = document.getElementById('startreset')

    const maxBreak = 10;
    const minTimer = 15;
    const maxTimer = 35;

    $breakUp.addEventListener('click', () => {
        changeSpinner($breakSpan, 'up');
    }, false);

    $breakDown.addEventListener('click', () => {
        changeSpinner($breakSpan, 'down');
    }, false);

    $timerUp.addEventListener('click', () => {
        changeSpinner($timerSpan, 'up');
    }, false);

    $timerDown.addEventListener('click', () => {
        changeSpinner($timerSpan, 'down');
    }, false);

    $button .addEventListener('click', () => {
        document.getElementById('leaves').classList.add('animated');
    }, false);

    function showHide(bool, el) {
        bool ?
            el.style.display = 'none' :
            el.style.display = 'inline-block';
    }

    function changeSpinner(el, dir) {
        let spanNum = Number(el.innerHTML);
        (dir === 'up') ? spanNum += 1 : spanNum -= 1;
        el.innerHTML = spanNum;

        if (el === $breakSpan) {
            showHide(spanNum === 1, $breakDown);
            showHide(spanNum === maxBreak, $breakUp);
        }
        if (el === $timerSpan) {
            showHide(spanNum === minTimer, $timerDown);
            showHide(spanNum === maxTimer, $timerUp);
        }
    }

}, false);
