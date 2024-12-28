/*
Gameboard
-getboard
-makeMove
-resetBoard
-checkWinner

GameController
-setPlayers
-switchPlayer
-getActivePlayer
-get players
-playRound

ScreenController
-get all DOM elements
-updateScreen
-resetBoard
*/

const Gameboard = (() => {
    const size = 3;
    let board = []
    const setGameUp=()=>{
        for (let i = 0; i < size; i++) {
            board[i] = []
            for (let j = 0; j < size; j++) {
                board[i][j] = null;
            }
        }
    }

    const getBoard = () => board;

    const makeMove = (row, column, player) => {
        if (board[row][column] != null) {
            return false; //already occupied
        }
        else {
            board[row][column] = player;
        }
        return true;
    }

    const resetBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j] = null;
            }
        }
    }

    const checkWinner = (() => {
        // horizontal and vertical winner
        for (let i = 0; i < size; i++) {
            let horizontalWinner = true, verticalWinner = true;
            for (let j = 0; j < size - 1; j++) {
                if (board[i][j] != board[i][j + 1] || board[i][j] === null) {
                    horizontalWinner = false;
                }
                if (board[j][i] != board[j + 1][i] || board[j][i] === null) {
                    verticalWinner = false;
                }
            }
            if (horizontalWinner === true) {
                return board[i][0];
            }
            else if (verticalWinner === true) {
                return board[0][i];
            }
        }

        //diagonal winners
        let mainDiagWinner = true, sideDiagWinner = true;
        for (let i = 0; i < size - 1; i++) {
            if (board[i][i] != board[i + 1][i + 1] || board[i][i] == null) {
                mainDiagWinner = false;
            }
            if (board[i][size - i - 1] != board[i + 1][size - i - 2] || board[i][size - i - 1] == null) {
                sideDiagWinner = false;
            }
        }
        if (mainDiagWinner === true || sideDiagWinner === true) {
            return board[1][1];
        }
        
        let gameDraw=true;
        for(let i=0; i<size; i++){
            for(let j=0; j<size; j++){
                if(board[i][j]==null){
                    gameDraw=false;
                }
            }
        }
        if(gameDraw){
            return 'draw';
        }
        return null;
    })
    return { getBoard, makeMove, checkWinner };
})()

const GameController = (() => {
    return (player1name, player2name) => {
        const board = Gameboard;

        const players = [
            {
                'name': player1name,
                'token': 'X',
                'score': 0
            },
            {
                'name': player2name,
                'token': 'O',
                'score': 0
            }
        ];

        let activePlayer = players[0];

        const switchPlayer = () => {
            activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
        };

        const playRound = (row, col) => {
            if (!board.makeMove(row, col, activePlayer.token)) {
                return false;
            }
            const result = board.checkWinner();
            if (result) {
                if (result !== 'draw') {
                    activePlayer.score++;
                }
                switchPlayer();
                return result;
            }
            return null;
        };

        const getActivePlayer = () => activePlayer;
        const getPlayers = () => players;
        const getBoard = board.getBoard;

        return { getActivePlayer, getPlayers, getBoard, playRound };
    };
})();


document.addEventListener('DOMContentLoaded', () => {
    const ScreenController = () => {
        const modal = document.getElementById("modal");
        const player1name = document.getElementById("player1");
        const player2name = document.getElementById("player2");
        const submitBtn = document.getElementById("submit_button");

        let game;

        modal.showModal();

        submitBtn.addEventListener('click', () => {
            const name1 = player1name.value.trim();
            const name2 = player2name.value.trim();
        
            if (name1 && name2) {
                game = GameController(name1, name2); 
                Gameboard.setGameUp(); 
                modal.close();
                updateScreen(); 
            } else {
                alert("Please provide names for both players.");
            }
        });
        

        const player1div = document.querySelector(".player1");
        const player2div = document.querySelector(".player2");
        const cells = document.querySelectorAll('.cell');

        cells.forEach((cell) => {
            const row = parseInt(cell.id[2]);
            const col = parseInt(cell.id[3]);
            cell.addEventListener('click', () => {
                const result = game.playRound(row, col); 
                if (result) {
                    if (result === 'draw') {
                        alert("It's a draw!");
                        Gameboard.resetBoard(); 
                    } else {
                        alert(`${result} wins!`);
                        updateScores(); 
                        Gameboard.resetBoard(); 
                    }
                }
                updateScreen();
            });
        });

        const updateScores = () => {
            const players = game.getPlayers();
            player1div.textContent = `${players[0].name}: ${players[0].score}`;
            player2div.textContent = `${players[1].name}: ${players[1].score}`;
        }

        const updateScreen = () => {
            const board = game.getBoard(); 
            cells.forEach((cell) => {
                const row = parseInt(cell.id[2], 10);
                const col = parseInt(cell.id[3], 10);
                if (board[row][col] != null) {
                    cell.textContent = board[row][col];
                }
            });
        }
    }

    ScreenController();
});
