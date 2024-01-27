import Stopwatch from "./stopwatch";

const stopwatch = new Stopwatch();

let isRunning = false;
let interval;

const $timer = document.getElementById('timer');

const $lapResetBtn = document.getElementById('lap-reset-btn');
const $startStopBtn = document.getElementById('start-stop-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $laps = document.getElementById('laps');

let $minLap, $maxLap;

const formatString = (num) => (num < 10 ? '0' + num : num);

const formatTime = (centisecond) => {
    let formattedString = '';
    const min = parseInt(centisecond / 6000);
    const sec = parseInt((centisecond - 6000 * min) / 100);
    const centisec = centisecond % 100;
    formattedString = `${formatString(min)}:${formatString(sec)}.${formatString(
        centisec
    )}`;
    return formattedString;
};

const updateTime = (time) => {
    $timer.innerText = formatTime(time);
};

const toggleBtnStyle = () => {
    $startStopBtn.classList.toggle('bg-green-600');
    $startStopBtn.classList.toggle('bg-red-600');
};

const onClickStartStopBtn = () => {
    if (isRunning) {
        onClickStopBtn();
    } else {
        onClickStartBtn();
    }
    isRunning = !isRunning;
    toggleBtnStyle();
};
const onClickStartBtn = () => {
    stopwatch.start();
    interval = setInterval(() => {
        updateTime(stopwatch.centisecond);
    }, 10);
    $lapResetBtnLabel.innerText = '랩';
    $startStopBtnLabel.innerText = '중단';
};

const onClickStopBtn = () => {
    stopwatch.pause();
    clearInterval(interval);
    $lapResetBtnLabel.innerText = '리셋';
    $startStopBtnLabel.innerText = '시작';
};

$startStopBtn.addEventListener('click', onClickStartStopBtn);

