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

// let tableMap = [];

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


let fc = 0;
tableMap = ['O', '', '', 'O', 'X', 'X', '', '', ''];
//--------------------------- AI ----------------------------

function minimax(tableMap, isHumanTurn, depth) {
    // fc++;
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
    
    let moves = [];
    for( let i = 0; i < availCells.length; i++ ) { //делает ход, вызывает рекурсию
        let move = {};
        setSymbol(tableMap, availCells[i], isHumanTurn);

        move.index = availCells[i];
        let result = minimax(tableMap, !isHumanTurn, depth); //рекурсия

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

function doMoveAI(tableMap) {
    // debugger;
    let isHumanTurn = getPlayerTurn();
    let aiMove = minimax(tableMap, isHumanTurn, 3);
    console.log(aiMove);
    setSymbol(tableMap, aiMove.index, getPlayerTurn());
}

//-----------------------------------------------------------



//------------------- Основной функционал -------------------

// Ставит "X" или "O" в зависимости от флага
// is firstPlayer
function setSymbol(tableMap, moveIndex, isFirstPlayerTurn) {
    if (isFirstPlayerTurn) {
        tableMap[moveIndex] = player1;
    }
    else {
        tableMap[moveIndex] = player2;
    }
}

function doMove(event) {
    let cell = event.target;
    let moveIndex;

    for(let i = 0; i < 9; i ++) {
        if(table[i] === cell) {
            moveIndex = i;
        }
    }
    // debugger;
    // Проверка на наличие символа в ячейке
    // и отсутствии победного хода
    if (tableMap[moveIndex] == '' && !isVictory) {
        setSymbol(tableMap, moveIndex, getPlayerTurn());
    }
    else {
        incorrectAction(cell);
        setTimeout(incorrectAction, 700, cell);
    }
    
    if (checkWinning(tableMap, getPlayer(isFirstPlayerTurn))) {
        isVictory = true;
    }

    changePlayerTurn();
    updateTable();

    if(!isPVP) {
        doMoveAI(tableMap);
        changePlayerTurn();
        updateTable();
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
    alert('pvp');
    isPVP = true;
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

updateTable();
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







// ---------------Расширенный код проверки-----------------
// let victoryTemplateSideDiagonal = function (matchCount) {
//     matchCount = 0;
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             if ( i != 2 && j != 2 ) {
//                 if ( i === j && table.rows[i].cells[i].innerText === table.rows[i + 1].cells[i + 1].innerText && table.rows[i].cells[i].innerText != '' ) {
//                     matchCount++;
//                 }
//             }
//             else {
//                 if ( i === j && table.rows[i].cells[i].innerText === table.rows[i - 1].cells[i - 1].innerText && table.rows[i].cells[i].innerText != '' ) {
//                     matchCount++;
//                 }
//             }
//         }
//     }
//     if (matchCount == 3) {
//         return true;
//     }
// } 