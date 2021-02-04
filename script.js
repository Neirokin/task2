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

// Ставит "X" или "O"
function setSymbol(tableMap, moveIndex, isFirstPlayerTurn) {
    if (isFirstPlayerTurn) {
        tableMap[moveIndex] = player1;
    }
    else {
        tableMap[moveIndex] = player2;
    }
}

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
            return;
        }
        changePlayerTurn();
        if(!isPVP) {
            doMoveAI(tableMap);
            updateTable();
            if (checkWinning(tableMap, getPlayer(isFirstPlayerTurn))) {
                isVictory = true;
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

function changePlayerTurn() {
    isFirstPlayerTurn = !isFirstPlayerTurn;
}

function getPlayer(player1Turn) {
    if (player1Turn) { 
        return player1;
    }
    else {
        return player2;
    }
}

function getPlayerTurn() {
    return isFirstPlayerTurn;
}

// Подсвечивает ячейку в случае выполнения
// запрещённых действий
function incorrectAction(elem) {
    elem.classList.toggle('incorrect');
}

// Обработчик события кнопки Restart
// Если ходы ещё есть, то требуется согласие
// пользователя для перезапуска
function restart() {
    if( checkMoves(tableMap).length > 0 && !isVictory ) {
        if( confirm('Вы уверены?') ) {
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
    setTableMap();
}

function turnPVP() {
    // alert('pvp');
    isPVP = true;
    doc.getElementsByClassName('table')[0].classList.toggle('d-none');
    doc.getElementById('pvp').classList.toggle('buttonMoveRight');
    doc.getElementById('pvc').classList.toggle('buttonMoveLeft');
    doc.getElementById('logo').classList.toggle('reduceLogoSize');
}

function turnPVC() {
    alert('pvc');
    isPVP = false;
}

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
// Вешаем на кнопку обработчик события pvp
doc.getElementById('pvp').onclick = turnPVP;
// Вешаем на кнопку обработчик события pvc
doc.getElementById('pvc').onclick = turnPVC;

//-----------------------------------------------------------



// Игровая карта для тестирования работы алгоритма
// tableMap = ['O', '', 'X', 'X', '', 'X', '', 'O', 'O'];
//--------------------------- AI ----------------------------

function minimax(tableMap, isHumanTurn, depth) {    
    let availCells = checkMoves(tableMap); //массив свободных ячеек
    if ( checkWinning(tableMap, player2) == 1) { //проверяет состояние доски
        return {result: 1};
    }
    else if ( checkWinning(tableMap, player1) == -1 ) {
        return {result: -1};
    }
    else if ( availCells.length === 0 ) {
        return {result: 0};
    }
    
    if (depth > 0) {
        let moves = [];
        for( let i = 0; i < availCells.length; i++ ) { //делает ход, вызывает рекурсию
            let move = {};
            setSymbol(tableMap, availCells[i], isHumanTurn);
            // updateTable();
    
            move.index = availCells[i];
            let result = minimax(tableMap, !isHumanTurn, depth - 1); //рекурсия
    
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
    else {
        console.log('достигнута глубина 4');
        return { result: 0 };
    }
}

function doMoveAI(tableMap) {
    // debugger;
    let isHumanTurn = false;
    let aiMove = minimax(tableMap, isHumanTurn, 3); //2
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

        if( isFirstPlayerTurn ) {
            return -1;
        }
        else {
            return 1;
        }
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














