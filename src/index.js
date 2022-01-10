import Stopwatch from './stopwatch.js';

const stopwatch = new Stopwatch();

let interval;
let isRunning = false;

const $timer = document.getElementById('timer');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $startStopBtn = document.getElementById('start-stop-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $laps = document.getElementById('laps');
let $maxLap, $minLap;

const formatString = (num) => (num < 10 ? '0' + num : num);

const formatTime = (centisecond) => {
    const min = parseInt(centisecond / 6000);
    const sec = parseInt((centisecond - 6000 * min) / 100);
    const centiSec = centisecond % 100;
    return `${formatString(min)}:${formatString(sec)}.${formatString(
        centiSec
    )}`;
};

function updateTime(time) {
    $timer.innerText = formatTime(time);
}

function toggleButtonStyle() {
    $startStopBtn.classList.toggle('bg-red-600');
    $startStopBtn.classList.toggle('bg-green-600');
}

function colorMinMax() {
    $minLap.classList.add('text-green-600');
    $maxLap.classList.add('text-red-600');
}

const onClickStartStopBtn = () => {
    if (isRunning) {
        onClickStopBtn();
    } else {
        onClickStartBtn();
    }
    isRunning = !isRunning;
    toggleButtonStyle();
};

const onClickStartBtn = () => {
    stopwatch.start();
    interval = setInterval(() => {
        updateTime(stopwatch.centisecond);
    }, 10);
    $startStopBtnLabel.innerText = '중단';
    $lapResetBtnLabel.innerText = '랩';
};

const onClickStopBtn = () => {
    stopwatch.pause();
    clearInterval(interval);
    $startStopBtnLabel.innerText = '시작';
    $lapResetBtnLabel.innerText = '리셋';
};

const onClickLapResetBtn = () => {
    if (isRunning) {
        onClickLapBtn();
    } else {
        onClickResetBtn();
    }
};

const onClickLapBtn = () => {
    const [lapCount, lapTime] = stopwatch.createLap();
    const $lap = document.createElement('li');
    $lap.setAttribute('data-time', lapTime);
    $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
    $lap.innerHTML += `
    <span>랩 ${lapCount}</span>
    <span>${formatTime(lapTime)}</span>
    `;
    $laps.insertBefore($lap, $laps.firstChild);

    // 1. 첫 Lap은 minLap으로 둔다.
    if (!$minLap) {
        $minLap = $lap;
        return;
    }

    // 2. 두번째 Lap은 첫번째 Lap과 비교해 (minLap) 최소, 최대를 정한다.
    if (!$maxLap) {
        if (lapTime < $minLap.dataset.time) {
            $maxLap = $minLap;
            $minLap = $lap;
        } else {
            $maxLap = $lap;
        }
        colorMinMax();
        return;
    }

    if (lapTime < $minLap.dataset.time) {
        $minLap.classList.remove('text-green-600');
        $minLap = $lap;
    } else if (lapTime > $maxLap.dataset.time) {
        $maxLap.classList.remove('text-red-600');
        $maxLap = $lap;
    }
    colorMinMax();
};

const onClickResetBtn = () => {
    stopwatch.reset();
    updateTime(0);
    $laps.innerHTML = '';
    $minLap = null;
    $maxLap = null;
};

const onKeydown = (e) => {
    // keyCode로 하는 이유 - 한영키
    switch (e.keyCode) {
        case 83:
            onClickStartStopBtn();
            break;
        case 76:
            onClickLapResetBtn();
            break;
    }
};

$startStopBtn.addEventListener(
    'click',
    onClickStartStopBtn // this가 stopwatch (메소드로써 실행)
);
$lapResetBtn.addEventListener('click', onClickLapResetBtn);
document.addEventListener('keydown', onKeydown);
