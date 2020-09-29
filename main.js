const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    audio = document.createElement('audio');

audio.src = 'audio.ogg';
audio.type = 'audio/ogg';
audio.style.cssText = `position: absolute; top: -200px`;
audio.loop = true;

car.classList.add('car');

const maxEnemy = 5,
    heightElem = 100;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(event) {

    start.classList.add('hide');
    gameArea.innerHTML = '';
    for (let i = 0; i < getQuantityElements(heightElem); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 115) + 'px';
        line.style.height = (heightElem / 2) + 'px';
        line.y = i * 120;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(heightElem * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * maxEnemy) + 1;
        enemy.classList.add('enemy');
        let enemyPeriod = -heightElem * setting.traffic * (i + 1);
        enemy.y = enemyPeriod < 100 ? -100 * setting.traffic * (i + 1) : enemyPeriod;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - heightElem / 2)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(../img/enemy_${randomEnemy}.png) center / cover no-repeat`;
        gameArea.append(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.append(car);
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '0';
    gameArea.append(audio);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = 'Score: ' + setting.score;
        moveRoad();
        moveEnemy();
        audio.play();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        car.style.top = setting.y + 'px';
        car.style.left = setting.x + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}

function stopRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -heightElem;
        }
    });
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            audio.remove();
            let crash = new Audio('crash.ogg');
            crash.play();
            start.classList.remove('hide');
            score.style.top = start.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -heightElem * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
        }
    });
}