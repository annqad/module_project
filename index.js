const $button = document.querySelector('button');
const $circles = document.getElementsByClassName('circle');
const $pointsAmount = document.getElementById('pointsAmount');
const $spinsAmount = document.getElementById('spinsAmount');
const $modalWindow = document.getElementById('modalWindow');
const $openWindow = document.getElementById('openWindow');
const $closeModal = document.getElementById('closeModal');
const $number = document.getElementById('number');
const $priceAmount = document.getElementById('priceAmount');
const $minusButton = document.getElementById('minusButton');
const $plusButton = document.getElementById('plusButton');
const $buyButton = document.getElementById('buyButton');

let needGet = false;
let getAmount = 0;

let pointsAmount = +localStorage.getItem('pointsAmount') || 1000;
let spinsAmount = +localStorage.getItem('spinsAmount') || 0;

let buyingSpins = 0;

$pointsAmount.innerText = pointsAmount;
$spinsAmount.innerText = spinsAmount;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getClick = async (e) => {
    needGet = false;
    pointsAmount += getAmount;
    localStorage.setItem('pointsAmount', pointsAmount);
    $pointsAmount.innerText = pointsAmount;
    $button.innerText = 'CLICK ME'
    for (let i = 0; i < $circles.length; i++) {
        $circles[i].classList.remove('active');
    }
}

const spinClick = async (e) => {
    $spinsAmount.innerText = --spinsAmount;
    localStorage.setItem('spinsAmount', spinsAmount);
    const winPosition = randomIntFromInterval(113, 125);

    let ms = 50;
    let i = 0;

    while (i <= winPosition) {
        const index = i % $circles.length;
        const $circle = $circles[index];
        const points = $circle.innerText;
        $circle.classList.add('active');
        await delay(ms);
        if (winPosition !== i) {
            $circle.classList.remove('active');
        }
        if (winPosition === i) {
            $button.innerText = points === '0' ? 'YOU LOSE' : `GET ${$circle.innerText}`;
            needGet = true;
            getAmount = +$circle.innerText;
        }
        ms = winPosition - i <= 12 ? ms + 50 : ms;
        i++;
    }
}

const handleClick = async (e) => {
    $button.disabled = true;
    if (needGet) {
        await getClick();
    } else if (spinsAmount <= 0) {
        toggleModal();
    } else {
        await spinClick();
    }
    $button.disabled = false;
}

const toggleModal = () => {
    $modalWindow.classList.toggle('opened');
}

const changeValue = (amount) => () => {
    const newAmount = +$number.value + amount;
    buyingSpins = newAmount < 0 ? 0 : newAmount;
    $number.value = buyingSpins;
    $priceAmount.innerText = buyingSpins * 250;
}

$button.addEventListener('click', handleClick);

$closeModal.addEventListener('click', toggleModal);

$openWindow.addEventListener('click', toggleModal);

$number.addEventListener('keyup', (e) => {
    buyingSpins = +e.target.value;
    $number.value = buyingSpins;
    $priceAmount.innerText = buyingSpins * 250;
});

$minusButton.addEventListener('click', changeValue(-1))
$plusButton.addEventListener('click', changeValue(1))

$buyButton.addEventListener('click', () => {
    if (buyingSpins <= 0 || buyingSpins * 250 > pointsAmount) return;
    pointsAmount -= buyingSpins * 250;
    spinsAmount += buyingSpins;
    localStorage.setItem('pointsAmount', pointsAmount);
    localStorage.setItem('spinsAmount', spinsAmount);
    $spinsAmount.innerText = spinsAmount;
    $pointsAmount.innerText = pointsAmount;
    toggleModal();
})