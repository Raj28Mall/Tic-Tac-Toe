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
-updateScores
-updateScreen
-resetBoard
*/

const Gameboard= (()=>{
    const size=3;
    board=[]
    for(let i=0; i<size; i++){
        board[i]=[]
        for(let j=0; j<size; j++){
            board[i][j]=null;
        }
    }

    const getBoard=() => board;

    const makeMove=(row, column, player) =>{
        if(board[row][column]!=null){
            return false; //already occupied
        }
        else{
            board[row][column]=player;
        }
    }

    const resetBoard=()=>{
        for(let i=0; i<size; i++){
            for(let j=0; j<size; j++){
                board[i][j]=null;
            }
        }
    }

    const checkWinner=(()=>{
        // horizontal and vertical winner
        for(let i=0; i<size; i++){
            let horizontalWinner=true, verticalWinner=true;
            for(let j=0; j<size-1; j++){
                if(board[i][j]!=board[i][j+1] || board[i][j]===null){
                    horizontalWinner=false;
                }
                if(board[j][i]!=board[j+1][i] || board[j][i]===null){
                    verticalWinner=false;
                }
            }
            if(horizontalWinner===true){
                return board[i][0];
                break;
            }
            else if(verticalWinner===true){
                return board[0][i];
                break;
            }
        }

        //diagonal winners
        let mainDiagWinner=true, sideDiagWinner=true;
        for(let i=0; i<size-1; i++){
            if(board[i][i]!=board[i+1][i+1] || board[i][i]==null){
                mainDiagWinner=false;
            }
            if(board[i][size-i-1]!=board[i+1][size-i-2] || board[i][size-i-1]==null){
                sideDiagWinner=false;
            }
        }
        if(mainDiagWinner===true || sideDiagWinner===true){
            return board[1][1];
        }
        return 'draw';
    })
    return { getBoard, makeMove, checkWinner };
})()

const GameController=((player1name, player2name)=>{
    const board=Gameboard;

    const players=[
        {
            'name':player1name,
            'token':'X',
            'score':0
        },
        {
            'name':player2name,
            'token':'O',
            'score':0
        }
    ]

    const activePlayer=players[0];

    const switchPlayer=()=>{
        if(activePlayer===players[0]){
            activePlayer=players[1];
        }
        else{
            activePlayer=players[0];
        }
    }

    const playRound=((row,col)=>{
        if(!(board.makeMove(row,col,activePlayer.token))){
            return false;
        }
        const result=board.checkWinner();
        if(result!='draw'){
            activePlayer.score++;
        }
        switchPlayer();
        return result;
    })

    const getActivePlayer = () => activePlayer;
    const getPlayers = () => players;
    const getBoard = board.getBoard;
    return {getActivePlayer, getPlayers, getBoard, playRound};
})()

document.addEventListener('DOMContentLoaded', ()=>{
    const board=GameController.getBoard();
    const players=GameController.getPlayers();
    const activePlayer=GameController.getActivePlayer();

    const cells=document.querySelectorAll('.cell');
    
})