document.addEventListener("DOMContentLoaded", function () {
    // Constants defining the game grid size and number of objects
    // extra function reference : code with harry javascript series youtube 
    const GRID_SIZE = 8;
    const OBSTACLE_COUNT = 10;
    const TREASURE_COUNT = 18;
    const TREASURE_VALUES = [1, 2, 3, 4, 5, 6];
    const TREASURES_PER_VALUE = 3;

    // Object representing the treasure hunter's state
    let hunter = { posX: 0, posY: 0, collectedTreasures: [], totalScore: 0 };
    let currentRound = 0; // Current round number
    let gameGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('empty')); // 2D array representing the grid

    // Function to place items (obstacles or treasures) on the grid
    function placeItems(itemType, itemCount) {
        for (let placed = 0; placed < itemCount;) {
            let randomX = Math.floor(Math.random() * GRID_SIZE);
            let randomY = Math.floor(Math.random() * GRID_SIZE);
            // Only place the item if the cell is empty
            if (gameGrid[randomX][randomY] === 'empty') {
                gameGrid[randomX][randomY] = itemType;
                placed++;
            }
        }
    }

    // Function to randomly place treasures on the grid
    function placeTreasures() {
        let placedTreasures = 0;
        while (placedTreasures < TREASURE_COUNT) {
            let randomX = Math.floor(Math.random() * GRID_SIZE);
            let randomY = Math.floor(Math.random() * GRID_SIZE);
            // Only place a treasure if the cell is empty
            if (gameGrid[randomX][randomY] === 'empty') {
                // Determine the value of the treasure based on the count placed so far
                let treasureValue = TREASURE_VALUES[Math.floor(placedTreasures / TREASURES_PER_VALUE)];
                gameGrid[randomX][randomY] = 'treasure' + treasureValue; // Label the cell with the treasure value
                placedTreasures++;
            }
        }
    }

    // Function to place the hunter on the grid at a random position within the first half of the grid
    function placeHunter() {
        while (true) {
            let randomX = Math.floor(Math.random() * (GRID_SIZE / 2));
            let randomY = Math.floor(Math.random() * (GRID_SIZE / 2));
            // Only place the hunter if the cell is empty
            if (gameGrid[randomX][randomY] === 'empty') {
                hunter.posX = randomX;
                hunter.posY = randomY;
                gameGrid[randomX][randomY] = 'hunter';
                break;
            }
        }
    }

    // Function to set up the initial game state
    function initializeGame() {
        gameGrid.forEach(row => row.fill('empty')); // Reset the grid to be empty
        placeHunter(); // Place the hunter
        placeItems('obstacle', OBSTACLE_COUNT); // Place obstacles
        placeTreasures(); // Place treasures
        updateGameDisplay(); // Update the game display
    }

    // Function to update the HTML display of the game grid and status
    function updateGameDisplay() {
        let gridHtml = '';
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                gridHtml += `<div class="${gameGrid[i][j]}"></div>`; // Add a div for each cell in the grid
            }
        }
        document.getElementById('grid').innerHTML = gridHtml; // Update the grid display

        // Update the status information
        document.getElementById('status').innerHTML = `
            <p>Round: ${currentRound}</p>
            <p>Bag: ${hunter.collectedTreasures.join(', ')}</p>
            <p>Score: ${hunter.totalScore}</p>
            <p>Treasures Left: ${countRemainingTreasures()}</p>
            <p>Move with keys: 'a', 'd', 'w', 's'</p>
        `;
    }

    // Function to count the remaining treasures on the grid
    function countRemainingTreasures() {
        let remainingTreasureCount = 0;
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (gameGrid[i][j].startsWith('treasure')) {
                    remainingTreasureCount++;
                }
            }
        }
        return remainingTreasureCount; // Return the count of treasures
    }

    // Function to check if the hunter can move to a specified position
    function isValidMove(x, y) {
        return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && gameGrid[x][y] !== 'obstacle';
    }

    // Function to handle key presses for moving the hunter
    function handleMove(event) {
        const moveDirections = {
            'a': { dx: 0, dy: -1 }, // Left
            'd': { dx: 0, dy: 1 },  // Right
            'w': { dx: -1, dy: 0 }, // Up
            's': { dx: 1, dy: 0 }   // Down
        };

        const move = moveDirections[event.key];
        if (!move) {
            displayStatus("Invalid move! Use 'a', 'd', 'w', 's' to move.");
            return;
        }

        const newX = hunter.posX + move.dx;
        const newY = hunter.posY + move.dy;

        // Check if the move is valid
        if (!isValidMove(newX, newY)) {
            displayStatus("Move not possible! Try a different direction.");
            return;
        }

        // Update the grid by removing the hunter from the old position
        gameGrid[hunter.posX][hunter.posY] = 'empty';
        // Update the hunter's position
        hunter.posX = newX;
        hunter.posY = newY;

        // Check if the hunter has found a treasure
        if (gameGrid[newX][newY].startsWith('treasure')) {
            let treasureValue = parseInt(gameGrid[newX][newY].replace('treasure', ''));
            hunter.collectedTreasures.push(treasureValue); // Add the treasure to the hunter's bag
            gameGrid[newX][newY] = 'empty'; // Remove the treasure from the grid

            // Randomly place either a new treasure with the same value or an obstacle
            if (Math.random() < 0.5) {
                placeTreasure(treasureValue); // Place a new treasure with the same value
            } else {
                placeItems('obstacle', 1); // Place a new obstacle
            }

            // If the hunter's bag is full (contains 3 treasures), calculate the score
            if (hunter.collectedTreasures.length === 3) calculateScore();
        }

        // Place the hunter in the new position on the grid
        gameGrid[newX][newY] = 'hunter';
        currentRound++; // Increment the round counter
        updateGameDisplay(); // Update the display
        checkEndCondition(); // Check if the game should end
    }

    // Function to place a new treasure with a specified value
    function placeTreasure(value) {
        while (true) {
            let randomX = Math.floor(Math.random() * GRID_SIZE);
            let randomY = Math.floor(Math.random() * GRID_SIZE);
            // Only place the treasure if the cell is empty
            if (gameGrid[randomX][randomY] === 'empty') {
                gameGrid[randomX][randomY] = 'treasure' + value;
                break;
            }
        }
    }

    // Function to calculate and update the score based on the hunter's collected treasures
    function calculateScore() {
        let treasures = [...hunter.collectedTreasures];
        hunter.collectedTreasures = []; // Empty the hunter's bag for new treasures
        let treasureSum = treasures.reduce((a, b) => a + b, 0); // Calculate the sum of treasure values
        let score = 0;
        let message = '';

        // Check for different scoring conditions
        if (treasures.every(val => val === treasures[0])) {
            score = 300 + treasureSum; // All three treasures have the same value
            message = "All three treasures have the same value.";
        } else if (new Set(treasures).size === 2) {
            score = 200 + treasureSum; // Two treasures have the same value
            message = "Two treasures have the same value.";
        } else if (treasures.length === 3 && treasures[0] + 1 === treasures[1] && treasures[1] + 1 === treasures[2]) {
            score = 100 + treasureSum; // The treasures form a run (consecutive values)
            message = "The treasures form a run.";
        } else {
            score = treasureSum; // No special pattern, just sum the values
            message = "All treasures have different values.";
        }

        hunter.totalScore += score; // Add the score to the total score
        displayStatus(`${message} Scored ${score} points.`);
    }

    // Function to display a status message
    function displayStatus(message) {
        document.getElementById('status').innerHTML += `<p>${message}</p>`;
    }

    // Function to check if the game should end
    function checkEndCondition() {
        if (countRemainingTreasures() === 0) {
            endGame("No treasures left. Game over!");
            return;
        }

        if (!canMoveInAnyDirection()) {
            endGame("Hunter cannot move. Game over!");
        }
    }

    // Function to check if the hunter can move in any direction
    function canMoveInAnyDirection() {
        const directions = [
            { dx: 0, dy: -1 }, // Left
            { dx: 0, dy: 1 },  // Right
            { dx: -1, dy: 0 }, // Up
            { dx: 1, dy: 0 }   // Down
        ];

        // Check if the hunter can move to any adjacent cell
        for (let dir of directions) {
            const newX = hunter.posX + dir.dx;
            const newY = hunter.posY + dir.dy;
            if (isValidMove(newX, newY)) {
                return true;
            }
        }
        return false; // No valid moves available
    }

    // Function to end the game and display the final status
    function endGame(message) {
        displayStatus(message);
        let performanceIndex = currentRound > 0 ? (hunter.totalScore / currentRound).toFixed(2) : 0;
        document.getElementById('status').innerHTML += `<p>Performance Index: ${performanceIndex}</p>`;
        document.removeEventListener('keypress', handleMove); // Remove the event listener to stop the game
    }

    // Function to end the play stage (triggered by a button)
    function endPlayStage() {
        endGame("Game ended by user.");
    }

    // Initialize the game and set up event listeners
    initializeGame();
    document.addEventListener('keypress', handleMove);
    document.getElementById('endButton').addEventListener('click', endPlayStage);
});
