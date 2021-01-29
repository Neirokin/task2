var doc = document;



//-------------- Флаги и глобальные переменные --------------

// Флаг первого игрока
let isFirstPlayerTurn = true;
// Флаг победы
let isVictory = false;
// Флаг PVP
let isPVP = true; 

let player1 = 'X';
let player2 = 'O';


//-----------------------------------------------------------



//-------------------- Функции проверки  --------------------

//Функция проверки победного хода
let checkWinning = function (table, player) {
    if( table[0].innerText == player && table[1].innerText == player && table[2].innerText == player ||
        table[3].innerText == player && table[4].innerText == player && table[5].innerText == player ||
        table[6].innerText == player && table[7].innerText == player && table[8].innerText == player ||
        table[0].innerText == player && table[3].innerText == player && table[6].innerText == player ||
        table[1].innerText == player && table[4].innerText == player && table[7].innerText == player ||
        table[2].innerText == player && table[5].innerText == player && table[8].innerText == player ||
        table[0].innerText == player && table[4].innerText == player && table[8].innerText == player ||
        table[2].innerText == player && table[4].innerText == player && table[6].innerText == player ) {

        if( isFirstPlayerTurn ) {
            return -1;
        }
        else {
            return 1;
        }
    }
    else {
        return false;
    }
}

// Проверка на наличие ходов
let checkMoves = function (table) {
    let availCells = {index: ''};
    debugger;
    for( let i = 0; i < 9; i++ ) {
        if(table[i].innerText == '') {
            availCells.index = i;   
        }
    }

    return availCells;
}

//-----------------------------------------------------------



//--------------------------- AI ----------------------------

// let minimax = function (newTable, isFirstPlayer) {
//     let isHuman = isFirstPlayer;
//     let availCells = checkMoves();

//     if ( checkWinning() == 1) {
//         return 1;
//     }
//     else if ( checkWinning() == -1 ) {
//         return -1;
//     }
//     else if ( availCells.length === 0 ) {
//         return 0;
//     }
//     debugger;
//     for( let i = 0; i < availCells.length; i++ ) {
//         newTable[availCells[i]] = setMove();
//     }
// }

// let moveAI = function () {
//     let bestMove = minimax(table, isFirstPlayer);
// }

//-----------------------------------------------------------



//------------------- Основной функционал -------------------

// Обработчик события onclick по ячейке.
// Ставит "X" или "O" в зависимости от флага
// is firstPlayer
let setSymbol = function (cell) {
    if (isFirstPlayerTurn) {
        cell.innerText = player1;
    }
    else {
        cell.innerText = player2;
    }
}

let doMove = function (event) {
    let cell = event.target;
    // Проверка на наличие символа в ячейке
    // и отсутствии победного хода
    // debugger;
    if (cell.innerText == '' && !isVictory) {
        if (isPVP) {
            setSymbol(cell);
        }
        else {
            setSymbol(cell);
            moveAI();
        }
    }
    else {
        incorrectAction(cell);
        setTimeout(incorrectAction, 700, cell);
    }
    
    if (checkWinning(table, getPlayer()) != false) {
        isVictory = true;
    }
    changePlayerTurn();
}


let changePlayerTurn = function () {
    isFirstPlayerTurn = !isFirstPlayerTurn;
}

let getPlayer = function () {
    if (isFirstPlayerTurn) { 
        return player1;
    }
    else {
        return player2;
    }
}

// Подсвечивает ячейку в случае выполнения
// запрещённых действий
let incorrectAction = function (elem) {
    elem.classList.toggle('incorrect');
}

// Обработчик события кнопки Restart
// Если ходы ещё есть, то требуется согласие
// пользователя для перезапуска
let restart = function () {
    debugger;
    if( checkMoves(table).length <= 9 ) {
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
}

let turnPVP = function () {
    isPVP = true;
}

let turnPVC = function () {
    isPVP = false;
}

// Получаем список ячеек (игровое поле) и вешаем на них
// обработчик события doMove 
let table = doc.getElementsByTagName('td');
for (let i = 0; i < table.length; i++) {
    table[i].onclick = doMove;
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