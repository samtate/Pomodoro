window.addEventListener('DOMContentLoaded', () => {

    const $breakUp = document.getElementById('breakup');
    const $breakDown = document.getElementById('breakdown');
    const $timerUp = document.getElementById('timerup');
    const $timerDown = document.getElementById('timerdown');

    const $breakSpan = document.getElementById('breakspan');
    const $timerSpan = document.getElementById('timerspan');

    const $startResetButton = document.getElementById('startreset');
    const $playPauseButton = document.getElementById('playpause');
    const $PWAButton = document.getElementById('PWAButton');
    const $spinners = document.getElementById('spinners');
    const $clock = document.getElementById('clock');
    const $clockLabel = document.getElementById('clocklabel');

    const $leaves = document.getElementById('leaves');

    const $notificationModal = document.getElementById('notificationModal');
    const $notificationModalClose = document.getElementById('notification-modal-close');
    const $startBreakModal = document.getElementById('startBreakModal');
    const $workModal = document.getElementById('workModal');
    const $PWAModal = document.getElementById('PWAModal');

    const minBreak = 1;
    const maxBreak = 10;
    const minTimer = 20;
    const maxTimer = 30;

    let time, currentStatus, oneSec,
        paused = false;


    function retrieveLocalStorage() {

        if (localStorage.getItem('breakSpan') === null ||
            localStorage.getItem('timerSpan') === null) {
                localStorage.setItem('timerSpan', 25);
                localStorage.setItem('breakSpan', 5);
            }

        $breakSpan.innerHTML = localStorage.getItem('breakSpan');
        $timerSpan.innerHTML = localStorage.getItem('timerSpan');

        checkArrows($breakSpan, Number($breakSpan.innerHTML));
        checkArrows($timerSpan, Number($timerSpan.innerHTML));
    }

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        $PWAModal.style.display = 'flex';
    });

    $PWAButton.addEventListener('click', () => {
        $PWAModal.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    }, false);

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

    $startResetButton.addEventListener('click', () => {
        if (!$startResetButton.classList.contains('reset')) {
            $startResetButton.classList.add('reset');
            $startResetButton.innerHTML = 'Reset';
            startTimer($timerSpan);
        } else {
            reset();
        }
    }, false);

    $playPauseButton.addEventListener('click', () => {
        playPause();
    }, false);

    $notificationModalClose.addEventListener('click', () => {
        $notificationModal.style.display = 'none';
    }, false);

    $PWAModalClose.addEventListener('click', () => {
        $PWAModal.style.display = 'none';
    }, false);

    //hides the up/down arrows if the spinner value is at its max/min respectively
    function showHide(bool, el) {
        bool ?
            el.style.display = 'none' :
            el.style.display = 'inline-block';
    }

    function checkArrows(el, spanNum) {
        if (el === $breakSpan) {
            showHide(spanNum <= minBreak, $breakDown);
            showHide(spanNum >= maxBreak, $breakUp);
        } else if (el === $timerSpan) {
            showHide(spanNum <= minTimer, $timerDown);
            showHide(spanNum >= maxTimer, $timerUp);
        }
    }

    function changeSpinner(el, dir) {
        let spanNum = Number(el.innerHTML);
        (dir === 'up') ? spanNum += 1 : spanNum -= 1;
        el.innerHTML = spanNum;

        if (el === $breakSpan) {
            checkArrows($breakSpan, spanNum);
            localStorage.setItem('breakSpan', spanNum);
        }
        else if (el === $timerSpan) {
            checkArrows($timerSpan, spanNum);
            localStorage.setItem('timerSpan', spanNum);
        }
    }

    //returns time from spinners in seconds
    function getTime(el) {
        return el.innerHTML * 60;
    }

    //converts seconds to minutes and seconds and updates clock
    function updateClock(time) {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        $clock.children[0].innerHTML = `${minutes}:${seconds}`;
    }

    function changeStatus() {

        //if work timer just finished, start break timer
        if (currentStatus === $timerSpan) {
            document.body.style.backgroundColor = '#52ff7d'
            $clockLabel.innerHTML = 'BREAK';
            new Notification('Start your break!');
            $startBreakModal.style.display = 'flex';
            setTimeout(() => {
                $startBreakModal.style.display = 'none';
            }, 3000)
            startTimer($breakSpan);

        }
        //if break timer just finished, start work timer
        else {
            document.body.style.backgroundColor = '#ff5050'
            $clockLabel.innerHTML = 'WORK';
            new Notification('Get back to work!');
            $workModal.style.display = 'flex';
            setTimeout(() => {
                $workModal.style.display = 'none';
            }, 3000)
            startTimer($timerSpan);
        }
    }

    function tick(firstTime, el) {
        if (!paused) {
            if (time!==0) {
                time -= 1;
                updateClock(time);
            } else {
                changeStatus();
            }
        }
    }

    function startTimer(el) {
        currentStatus = el;
        clearInterval(oneSec);

        $leaves.classList.add('animated');
        $spinners.style.display = 'none';
        $clock.style.display = 'block';

        time = getTime(el);
        updateClock(time);

        oneSec = setInterval(tick, 1000);

    }
    function playPause() {
        if ($playPauseButton.classList.contains('paused')) {
            $playPauseButton.innerHTML = 'Pause';
            paused = !paused;
            $playPauseButton.classList.remove('paused');
            $leaves.classList.add('animated');
        } else {
            $playPauseButton.innerHTML = 'Resume';
            paused = !paused;
            $playPauseButton.classList.add('paused');
            $leaves.classList.remove('animated');
        }
    }

    function reset() {
        clearInterval(oneSec);

        $startResetButton.classList.remove('reset');
        $startResetButton.innerHTML = 'Start';
        $leaves.classList.remove('animated');
        $clockLabel.innerHTML = 'WORK';
        document.body.style.backgroundColor = '#ff5050'

        $spinners.style.display = 'flex';
        $clock.style.display = 'none';
    }

    retrieveLocalStorage();

    Notification.requestPermission().then(function(result) {
        if (result === 'denied') {
            $notificationModal.style.display ='flex'
        }
    });

}, false);
