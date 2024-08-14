
// Tic Tac Toe game program
let player1Name, player2Name, currentPlayerName;
const nameMatch = document.getElementById("nameMatch");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("statusText");
const resetBtn = document.getElementById("restart");
const xWins = document.getElementById('winx');
const oWins = document.getElementById('wino');
const draws = document.getElementById('draws');
const chars = document.querySelectorAll('.char');
const undoBtn = document.getElementById('undoBtn');
let moveHistory = [];
let redoStack = [];
const winConditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 4, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[2, 4, 6]
];

let options = Array(9).fill("");
let currentPlayer = 'X';
let running = false;

function startGame() {
            player1Name = document.getElementById('player1Name').value.trim();
            player2Name = document.getElementById('player2Name').value.trim();
            currentPlayerName = player1Name;
            document.getElementById('setupMenu').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            initializeGame();
}

function initializeGame() {
            const cells = document.querySelectorAll(".cell");
            const statusText = document.getElementById("statusText");
            let pname1 = document.getElementById('p1');
            let pname2 = document.getElementById('p2');
            pname1.textContent = `${player1Name} : `;
            pname2.textContent = `${player2Name} : `;
            cells.forEach(cell => cell.addEventListener('click', cellClicked));
            statusText.textContent = `${currentPlayerName}'s turn`;
            statusText.style.color = (currentPlayer === 'X') ? 'red' : 'blue';
            running = true;
        }

function cellClicked() {
	const cellIndex = this.getAttribute('cellIndex');
	
	if (options[cellIndex] != '' || !running){
		return;
	}
	else {
		moveHistory.push({ index:          cellIndex, player: currentPlayer });
        options[cellIndex] = currentPlayer;
        this.textContent = currentPlayer;
	    updateCell(this, cellIndex);
	    checkWinner();
	}
}

function updateCell(cell, index){
	options[index] = currentPlayer;
	cell.textContent = currentPlayer;
}

function changePlayer() {
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            currentPlayerName = (currentPlayer === 'X') ? player1Name : player2Name;
            document.getElementById('statusText').style.color = (currentPlayer === 'X') ? 'red' : 'blue';
            document.getElementById('statusText').textContent = `${currentPlayerName}'s turn`;
        }

function checkWinner() {
	let roundWon = false;
	
	for (let i = 0; i < winConditions.length; i++){
		const condition = winConditions[i];
		const cellA = options[condition[0]]
		const cellB = options[condition[1]]
		const cellC = options[condition[2]]
		
		if (cellA == '' || cellB == '' || cellC == ''){
			continue;
		}
		
		if (cellA == cellB && cellB == cellC){
			roundWon = true;
			setTimeout(() => {reset()}, 1000);
			break;
		}
	}
	
	if (roundWon) {
		if (currentPlayer == 'X'){
		statusText.style.color = 'red';
	    }
	    if (currentPlayer == 'O'){
		statusText.style.color = 'blue';
	    }
		statusText.textContent = `${currentPlayerName} wins`;
		if (currentPlayer == 'X'){
			xWins.textContent++;
			running = false;
			setTimeout(() => {reset()}, 1000);
		}
		else {
			oWins.textContent++;
			running = false;
			setTimeout(() => {reset()}, 1000);
		}
	}
	else if (!options.includes('')){
		statusText.style.color = 'yellow';
		statusText.textContent = 'Draw!';
		draws.textContent++;
		running = false;
		setTimeout(() => {reset()}, 1000);
	}
	else {
		changePlayer();
	}
}

function reset() {
	currentPlayer = 'X';
	currentPlayerName = player1Name;
	statusText.style.color = 'red';
	options = Array(9).fill("");
	statusText.textContent = `${currentPlayerName}'s turn`;
	cells.forEach(cell => cell.textContent = '');
	moveHistory.length = 0;
	running = true;
}

function resetData() {
	winX.textContent = '0';
	winO.textContent = '0';
	draws.textContent = '0';
}

function undoMove() {
    if (moveHistory.length === 0 || !running) {
        return;
    }

    const lastMove = moveHistory.pop();
    const { index, player } = lastMove;
    options[index] = "";
    document.querySelector(`.cell[cellIndex="${index}"]`).textContent = "";
    cells[lastMove.index].addEventListener("click", cellClicked);
    redoStack.push(lastMove);
    changePlayer();
    currentPlayer = player;
    
    
    document.getElementById('statusText').textContent = `${currentPlayerName}'s turn`;
    document.getElementById('statusText').style.color = (currentPlayer === 'X') ? 'red' : 'blue';
}

function changeNames() {
    Swal.fire({
        title: 'Create New?',
        text: "Do you want to change the player names?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reset player names and show the setup menu
            document.getElementById('player1Name').value = '';
            document.getElementById('player2Name').value = '';
            document.getElementById('setupMenu').style.display = 'flex';
            document.getElementById('gameContainer').style.display = 'none';
            reset();
        }
    });
}

document.querySelector('.play-button').addEventListener('click', () => {
	const player1Name = document.getElementById('player1Name');
	const player2Name = document.getElementById('player2Name');
	if (player1Name.value == '' || player1Name.value == ' ' || player1Name.value == null) {
            	Swal.fire({
            title: 'Something\'s missing',
            text: 'You need to enter both names',
            icon: 'warning'
        });
    }
    else if (player2Name.value == '' || player2Name.value == ' ' || player2Name.value == null) {
            	Swal.fire({
            title: 'Something\'s missing',
            text: 'You need to enter both names',
            icon: 'warning'
        });
    }
    else {
    	startGame();
    }
});

// Function to update progress bar and percentage display
function updateProgress(percentage) {
    const progressBar = document.getElementById('progress');
    const percentageDisplay = document.getElementById('percentageDisplay');
    percentage = Math.floor(percentage); // Round down to the nearest whole number
    progressBar.style.width = percentage + '%';
    percentageDisplay.textContent = percentage + '%';
}

// Simulate loading with randomized progress speed but ensure total time is 5 seconds
function simulateLoading() {
    const totalDuration = 5000; // Total duration of 5 seconds
    let startTime = Date.now();
    let percentage = 0;

    function step() {
        let elapsed = Date.now() - startTime;
        percentage = Math.min(100, (elapsed / totalDuration) * 100);

        // Randomize speed by adjusting the progress update interval
        let speedFactor = 1 + Math.random(); // Between 1 and 2 times the normal speed
        setTimeout(() => {
            updateProgress(percentage);
            if (percentage < 100) {
                requestAnimationFrame(step);
            } else {
                document.getElementById('loadingScreen').style.display = 'none'; // Hide the loading screen
                showMechanicsAlert(); // Show the mechanics alert after loading
            }
        }, 100 / speedFactor);
    }

    step(); // Start the loading simulation
}

// Function to show the mechanics alert
function showMechanicsAlert() {
    let message = `Enter both player names and click play. Get a consecutive three similar symbol in horizontals, verticals, and diagonals. You can clear the board, undo a move, and reset scoreboard. Enjoy playing! 😊`;
    
    Swal.fire({
        title: 'Mechanics',
        text: message,
        icon: 'info'
    });
}

// Start loading simulation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    simulateLoading(); // Start the loading simulation
});



if ('serviceWorker' in navigator) {
       window.addEventListener('load', () => {
         navigator.serviceWorker.register('/sw.js')
           .then((registration) => {
             console.log('ServiceWorker registration successful with scope: ', registration.scope);
           })
           .catch((error) => {
             console.log('ServiceWorker registration failed: ', error);
           });
       });
     }
     
     
