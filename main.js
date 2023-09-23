import {CELL_VALUE, GAME_STATUS, TURN} from './constants.js';
import { getCellElementList,getCurrentTurnElement,getGameStatusElement,getCellElementAtIdx,getReplayButton } from "./selectors.js";
import { checkGameStatus } from './utils.js';
// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getGameStatusElement());
// console.log(getCellElementAtIdx());
console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let GameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function updateGameStatus(newGameStatus){
    GameStatus = newGameStatus;
    const GameStatusElement = getGameStatusElement();
    if (GameStatusElement) GameStatusElement.textContent = newGameStatus;
}
function showReplayButton(){
    const replayButton = getReplayButton();
    if (replayButton) replayButton.classList.add("show");
}
function highlightWinCell(winPositions){
    if (!Array.isArray(winPositions) || winPositions.length !== 3){
        throw new Error('Invalid Positions')
    }
    for (const position of winPositions){
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add("win");
    }
}

function toggleTurn(){
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    //update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement){
        currentTurnElement.classList.remove(TURN.CROSS,TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }
}

function HandleCellClick(cell,index){
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = GameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return;

    //set selected cell
    cell.classList.add(currentTurn);
    //update cellvalue
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //toggle turn
    toggleTurn();
    //check game status
    const game = checkGameStatus(cellValues);
    switch(game.status){
        case GAME_STATUS.ENDED:{
            //update game status
            //show replay button
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:{
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCell(game.winPositions);
            break;
        }
        default:
            
    }

    console.log("click",cell,index);
}

function initCellElementList(){
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell,index)=> {
        cell.addEventListener("click",()=> HandleCellClick(cell,index));
    })
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(()=>{
    //bind click envent for all li element
    initCellElementList();
    //bind click event for replay button
})()