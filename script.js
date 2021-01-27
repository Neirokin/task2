var doc = document;



//-------------- Флаги и глобальные переменные --------------

// Флаг первого игрока
let isFirstPlayer = true;
// Флаг победы
let isVictory = false;

//-----------------------------------------------------------



//-------------------- Функции проверки  --------------------

// Проверка победного хода на главной диагонали
let checkMainDiagonal = function () {
    if( table.rows[1].cells[1].innerText === table.rows[0].cells[0].innerText &&
        table.rows[1].cells[1].innerText === table.rows[2].cells[2].innerText &&
        table.rows[1].cells[1].innerText != '' ) {
        return true;
    }
} 

// Проверка победного хода на побочной диагонали
let checkSideDiagonal = function () {
    if( table.rows[1].cells[1].innerText === table.rows[0].cells[2].innerText &&
        table.rows[1].cells[1].innerText === table.rows[2].cells[0].innerText &&
        table.rows[1].cells[1].innerText != '' ) {
       return true;
   }
}

// Проверка победного хода в строках
let checkRows = function () {
    for( let i = 0; i < 3; i++ ) {
        let matchCount = 0;
        for( let j = 0; j < 3; j++ ) {
            if(j != 2 ) {
                if( table.rows[i].cells[j].innerText === table.rows[i].cells[j + 1].innerText &&
                    table.rows[i].cells[j].innerText != '' ) {
                    matchCount++;
                }
            }
            else {
                if (table.rows[i].cells[j].innerText === table.rows[i].cells[j - 1].innerText &&
                    table.rows[i].cells[j].innerText != '') {
                    matchCount++;
                }
            }

            if (matchCount === 3) {
                return true;
            }
        }
    } 
}

// Проверка победного хода в столбцах
let checkCols = function () {
    for( let j = 0; j < 3; j++ ) {
        let matchCount = 0;
        for( let i = 0; i < 3; i++ ) {
            if(i != 2 ) {
                if( table.rows[i].cells[j].innerText === table.rows[i + 1].cells[j].innerText &&
                    table.rows[i].cells[j].innerText != '' ) {
                    matchCount++;
                }
            }
            else {
                if (table.rows[i].cells[j].innerText === table.rows[i - 1].cells[j].innerText &&
                    table.rows[i].cells[j].innerText != '') {
                    matchCount++;
                }
            }

            if (matchCount === 3) {
                return true;
            }
        }
    } 
}

// Проверка на наличие ходов
let checkMoves = function () {
    if( !isVictory ) {
        let movesCount = 0;
        for( let i = 0; i < 3; i++ ) {
            for( let j = 0; j < 3; j++ ) {
                if( table.rows[i].cells[j].innerText != '') {
                    movesCount++;
                }
            }
        }

        if( movesCount === 9) {
            return true;
        }
    }
}

//-----------------------------------------------------------



//------------------- Основной функционал -------------------

//Обработчик события onclick по ячейке.
//Ставит "X" или "O" в зависимости от флага
//is firstPlayer
let setSymbol = function (event) {
    // Проверка на наличие символа в ячейке
    // и отсутствии победного хода
    if( event.target.innerText == '' && !isVictory ) {
        if( isFirstPlayer ) {
            event.target.innerText = "X";
        }
        else {
            event.target.innerText = "O";
        }
        getResult();
        isFirstPlayer = !isFirstPlayer;
    }
    else {
        incorrectAction(event.target);
        setTimeout(incorrectAction, 700, event.target);
    }
}

//Функция проверки победного хода
let getResult = function () {
    if( checkMainDiagonal() || checkSideDiagonal() ||
                checkRows() || checkCols () ) {
        isVictory = true;
        if( isFirstPlayer ) {
            alert('пабеда игрока1');
        }
        else {
            alert('пабеда игрока2');
        }
    }
    else if( checkMoves() ) {
        alert('опа, ничья');
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
    if( !checkMoves() ) {
        if( confirm('Вы уверены?') ) {
            isVictory = false;
            for( let i = 0; i < 3; i++ ) {
                for( let j = 0; j < 3; j++ ) {
                    table.rows[i].cells[j].innerText = '';
                }
            }
        }
    }  
}

// Получаем таблицу (игровое поле) и вешаем на него
// обработчик события setSymbol 
let table = doc.getElementsByTagName('table')[0];
for( let i = 0; i < 3; i ++ ) {
    for( let j = 0; j < 3; j++ ) {
        table.rows[i].cells[j].onclick = setSymbol;
    }    
}

// Вешаем на кнопку обработчик события restart
doc.getElementById('restartBtn').onclick = restart;

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