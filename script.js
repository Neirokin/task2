var doc = document;



//-------------- Флаги и глобальные переменные --------------

// Флаг первого игрока
let isFirstPlayerTurn = true;
// Флаг победы
let isVictory = false;
// Флаг PVP
let isPVP = false; 

let player1 = 'X';
let player2 = 'O';

// Карта игровой таблицы
let tableMap = [];

//-----------------------------------------------------------



//------------------- Основной функционал -------------------

// Получаем список ячеек (игровое поле) и вешаем на них
// обработчик события doMove 
let table = doc.getElementsByTagName('td');
for (let i = 0; i < table.length; i++) {
    table[i].onclick = doMove;
}
// updateTable();
setTableMap();


// Заполнение карты игрового поля
function setTableMap() {
    for (let i = 0; i < 9; i++) {
        tableMap[i] = table[i].innerText;
    }
}


//Обновление таблицы
function updateTable() {
    for (let i = 0; i < 9; i++) {
        if(table[i].innerText != tableMap[i]) {
            table[i].innerText = tableMap[i];
        }
    }
}


// Вешаем на кнопку обработчик события restart
doc.getElementById('restartBtn').onclick = restart;
// Вешаем на кнопку обработчик события turnPvp
doc.getElementById('pvp').onclick = turnPVP;
// Вешаем на кнопку обработчик события turnPvc
doc.getElementById('pvc').onclick = turnPVC;
// Вешаем на кнопку обработчик события backToMenu
doc.getElementById('backBtn').onclick = backToMenu;


// Функция обработчик события нажатия на ячейку
function doMove(event) {
    let cell = event.target;
    let moveIndex;

    // Ищет индекс ячейки, а которой зафиксировано событие
    for(let i = 0; i < 9; i ++) {
        if(table[i] === cell) {
            moveIndex = i;
        }
    }

    if (tableMap[moveIndex] == '' && !isVictory) {
        setSymbol(tableMap, moveIndex, getPlayerTurn());
        updateTable();
        if (checkWinning(tableMap, getPlayer(isFirstPlayerTurn))) {
            isVictory = true;
            doc.getElementsByClassName('table')[0].classList.add('coloredCells');
            doc.getElementById('turnIndicator').classList.add('winMessage');
            doc.getElementById('turnIndicator').innerText = getPlayer(isFirstPlayerTurn) + " win!"
            return;
        }
        changePlayerTurn();
        if(!isPVP) {
            doMoveAI(tableMap);
            updateTable();
            if (checkWinning(tableMap, getPlayer(isFirstPlayerTurn))) {
                isVictory = true;
                doc.getElementsByClassName('table')[0].classList.add('coloredCells');
                doc.getElementById('turnIndicator').classList.add('winMessage');
                doc.getElementById('turnIndicator').innerText = getPlayer(isFirstPlayerTurn) + " win!"
                return;
            }
            changePlayerTurn();
        }
    }
    else {
        incorrectAction(cell);
        setTimeout(incorrectAction, 700, cell);
    }
}


// Ставит "X" или "O"
function setSymbol(tableMap, moveIndex, isFirstPlayerTurn) {
    if (isFirstPlayerTurn) {
        tableMap[moveIndex] = player1;
    }
    else {
        tableMap[moveIndex] = player2;
    }
}


// Меняет очередь игрока
function changePlayerTurn() {
    isFirstPlayerTurn = !isFirstPlayerTurn;
    let turnIndicator = doc.getElementById('turnIndicator');
    if (isFirstPlayerTurn) {
        turnIndicator.innerText = 'X';
    }
    else {
        turnIndicator.innerText = 'O';
    }
}


// Функция для получения текущего символа игрока
function getPlayer(player1Turn) {
    if (player1Turn) { 
        return player1;
    }
    else {
        return player2;
    }
}


// Получает ход игрока
function getPlayerTurn() {
    return isFirstPlayerTurn;
}


// Подсвечивает ячейку в случае выполнения
// запрещённых действий
function incorrectAction(elem) {
    elem.classList.toggle('incorrect');
}




//--------------------------- AI ----------------------------

// Функция оценки ходов
function minimax(tableMap, isHumanTurn) {    
    let availCells = checkMoves(tableMap); //массив свободных ячеек
    if ( checkWinning(tableMap, player2)) { //проверяет состояние доски
        return {result: 1};
    }
    else if ( checkWinning(tableMap, player1)) {
        return {result: -1};
    }
    else if ( availCells.length === 0 ) {
        return {result: 0};
    }
    
    let moves = [];
    for( let i = 0; i < availCells.length; i++ ) { //делает ход, вызывает рекурсию
        let move = {};
        setSymbol(tableMap, availCells[i], isHumanTurn);
        // updateTable();

        move.index = availCells[i];
        let result = minimax(tableMap, !isHumanTurn); //рекурсия
        move.result = result.result;
        
        tableMap[availCells[i]] = '';

        moves.push(move);
    }

    let bestMoveIndex;
    if (isHumanTurn) {
        let bestResult = 10;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].result < bestResult) {
                bestResult = moves[i].result;
                bestMoveIndex = i; 
            }
        }
    }
    else {
        let bestResult = -10;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].result > bestResult) {
                bestResult = moves[i].result;
                bestMoveIndex = i; 
            }
        }
    }
    return moves[bestMoveIndex];
  
}

// Ход компьютера
function doMoveAI(tableMap) {
    let isHumanTurn = false;
    let aiMove = minimax(tableMap, isHumanTurn); //2
    console.log(aiMove);
    setSymbol(tableMap, aiMove.index, getPlayerTurn());
}

//-----------------------------------------------------------



//-------------------- Функции проверки  --------------------

//Функция проверки победного хода
function checkWinning(tableMap, player) {
    if( tableMap[0] == player && tableMap[1] == player && tableMap[2] == player ||
        tableMap[3] == player && tableMap[4] == player && tableMap[5] == player ||
        tableMap[6] == player && tableMap[7] == player && tableMap[8] == player ||
        tableMap[0] == player && tableMap[3] == player && tableMap[6] == player ||
        tableMap[1] == player && tableMap[4] == player && tableMap[7] == player ||
        tableMap[2] == player && tableMap[5] == player && tableMap[8] == player ||
        tableMap[0] == player && tableMap[4] == player && tableMap[8] == player ||
        tableMap[2] == player && tableMap[4] == player && tableMap[6] == player ) {

       return true;
    }
}


// Проверка на наличие ходов
function checkMoves(tableMap) {
    let availCells = [];
    
    for( let i = 0; i < 9; i++ ) {
        if(tableMap[i] == '') {
            availCells.push(i);   
        }
    }

    return availCells;
}

//-----------------------------------------------------------



//------------------------ Кнопки ---------------------------

// Обработчик события кнопки Restart
// Если ходы ещё есть, то требуется согласие
// пользователя для перезапуска
function restart() {
    if( checkMoves(tableMap).length > 0 && !isVictory ) {
        if( confirm('Are you sure?') ) {
            isVictory = false;
            isFirstPlayerTurn = true;
            for (let i = 0; i < 9; i++) {
                table[i].innerText = '';
            }
        }
    }
    else {
        isVictory = false;
        isFirstPlayerTurn = true;
        for (let i = 0; i < 9; i++) {
            table[i].innerText = '';
        }
    }
    doc.getElementsByClassName('table')[0].classList.remove('coloredCells');
    doc.getElementById('turnIndicator').innerText = 'X';
    doc.getElementById('turnIndicator').classList.remove('winMessage');
    setTableMap();
}


// Режим "игрок против игрока"
function turnPVP() {
    isPVP = true;
    doc.getElementsByClassName('table')[0].classList.add('tableAppear');
    doc.getElementById('pvp').classList.add('buttonMoveRight');
    doc.getElementById('pvc').classList.add('buttonMoveLeft');
    doc.getElementById('logo').classList.add('reduceLogoSize');
}


// Режим "игрок против компьютера"
function turnPVC() {
    isPVP = false;
    doc.getElementsByClassName('table')[0].classList.add('tableAppear');
    doc.getElementById('pvp').classList.add('buttonMoveRight');
    doc.getElementById('pvc').classList.add('buttonMoveLeft');
    doc.getElementById('logo').classList.add('reduceLogoSize');
}


// Возврат в меню
function backToMenu() {
    if( checkMoves(tableMap).length > 0 && !isVictory ) {
        if( confirm('Are you sure?') ) {
            isVictory = false;
            isFirstPlayerTurn = true;
            for (let i = 0; i < 9; i++) {
                table[i].innerText = '';
            }
            setTableMap();
            doc.getElementsByClassName('table')[0].classList.remove('coloredCells');  
            doc.getElementsByClassName('table')[0].classList.remove('tableAppear');
            doc.getElementById('pvp').classList.remove('buttonMoveRight');
            doc.getElementById('pvc').classList.remove('buttonMoveLeft');
            doc.getElementById('logo').classList.remove('reduceLogoSize');
        }
    }
    else {
        isVictory = false;
        isFirstPlayerTurn = true;
        for (let i = 0; i < 9; i++) {
            table[i].innerText = '';
        }
        setTableMap();
        doc.getElementsByClassName('table')[0].classList.remove('coloredCells');  
        doc.getElementsByClassName('table')[0].classList.remove('tableAppear');
        doc.getElementById('pvp').classList.remove('buttonMoveRight');
        doc.getElementById('pvc').classList.remove('buttonMoveLeft');
        doc.getElementById('logo').classList.remove('reduceLogoSize');
    }
    doc.getElementById('turnIndicator').innerText = 'X';
    doc.getElementById('turnIndicator').classList.remove('winMessage');
}
//-----------------------------------------------------------





















