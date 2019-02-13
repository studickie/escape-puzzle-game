// keycodes -> up: 38; down: 40; left: 37; right: 39

let game = {
    gameGrid:
        [
            ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "-", "-", "lockblue", "-", "-", "-", "-", "/"],
            ["/", "-", "keyred", "-", "-", "-", "keyblue", "-", "/"],
            ["/", "-", "-", "-", "-", "-", "-", "lockred", "/"],
            ["/", "-", "-", "-", "player", "-", "-", "-", "/"],
            ["/", "lockgreen", "-", "-", "-", "-", "-", "-", "/"],
            ["/", "-", "chip", "-", "-", "-", "keygreen", "-", "/"],
            ["/", "-", "-", "-", "-", "-", "-", "-", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
        ],

    gameItems: {
        escapeChips: {
            remaining: 1,
            acquired: 0,
            exitOpen: false
        },

        keys: [{
            id: "keyred",
            lock: "lockred",
            acquired: false
        },{
            id: "keygreen",
            lock: "lockgreen",
            acquired: false
        },{
            id: "keyblue",
            lock: "lockblue",
            acquired: false
        }],
    }
};

$(document).keydown(function(event){
    // pass event to directionSelection() whcih determines movement direction
    directionSelection(event.which);
    // after player position value has been modified, render gameGrid in DOM
    renderGameBoard(game["gameGrid"]);
});

// receive event.which, route direction value accordingly
const directionSelection = function(direction) {

    // pass the direction value to movePlayer() according to keypress
    if(direction === 38){
        checkMoveToBlock("up", game["gameGrid"]);

    } else if (direction === 40){
        checkMoveToBlock("down", game["gameGrid"]);

    } else if (direction === 37){
        checkMoveToBlock("left", game["gameGrid"]);
            
    } else if (direction === 39){
        checkMoveToBlock("right", game["gameGrid"]);
    };
}

// locate the player value in gameGrid
const findPlayerPosition = function(gameGrid) {

    const indexY = gameGrid.findIndex(spaceY => spaceY.includes("player"));

    const indexX = gameGrid[indexY].findIndex(spaceX => spaceX.includes("player"));

    // return player position to caller in the form of co-ordinates; Y, X
    return [indexY, indexX];
};


const updateAcquiredKeys = function(newKey, keys) {

    const acquiredKey = keys.find(key => key["id"] === newKey);
    
    acquiredKey["acquired"] = true;
};


const checkKeyStatus = function(lock, keys) {

    const keyQuery = keys.find(key => key["lock"] === lock);

    return keyQuery["acquired"];
};


const updateChipCount = function(chipCount) {

    chipCount["remaining"] -= 1;
    chipCount["acquired"] += 1;

    chipCount["remaining"] === 0 ? chipCount["exitOpen"] = true : null;
};


const movePlayer = function(gameGrid, index, direction) {

    const indexY = index[0];
    const indexX = index[1];

    if (direction === "up") {
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY - 1].splice(indexX, 1, "player");

    } else if (direction === "down") {
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY + 1].splice(indexX, 1, "player");

    } else if (direction ==="left") {
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX - 1, 1, "player");

    } else if (direction === "right") {
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX + 1, 1, "player");

    }
};

// move player value in gameGrid 
const checkMoveToBlock = function(direction, gameGrid) {

    const index = findPlayerPosition(gameGrid);

    const indexY = index[0];
    const indexX = index[1];
            
    if (direction === "up" && gameGrid[indexY - 1][indexX] != "/") {
        if (gameGrid[indexY - 1][indexX].includes("key")){
            updateAcquiredKeys(gameGrid[indexY - 1][indexX], game["gameItems"]["keys"]);
            movePlayer(gameGrid, index, "up")

        } else if (gameGrid[indexY - 1][indexX].includes("chip")){
            updateChipCount(game["gameItems"]["escapeChips"]);
            movePlayer(gameGrid, index, "up")

        } else if (gameGrid[indexY - 1][indexX].includes("lock")){
            checkKeyStatus(gameGrid[indexY - 1][indexX], game["gameItems"]["keys"]) 
                ? movePlayer(gameGrid, index, "up") : null;

        } else {
            movePlayer(gameGrid, index, "up")

        }

    } else if (direction === "down" && gameGrid[indexY + 1][indexX] != "/") {
        if (gameGrid[indexY + 1][indexX].includes("key")) {
            updateAcquiredKeys(gameGrid[indexY + 1][indexX], game["gameItems"]["keys"]);
            movePlayer(gameGrid, index, "down")

        } else if (gameGrid[indexY + 1][indexX].includes("chip")) {
            updateChipCount(game["gameItems"]["escapeChips"]);
            movePlayer(gameGrid, index, "down")

        } else if (gameGrid[indexY + 1][indexX].includes("lock")) {
            checkKeyStatus(gameGrid[indexY + 1][indexX], game["gameItems"]["keys"])
                ? movePlayer(gameGrid, index, "down") : null;

        } else {
            movePlayer(gameGrid, index, "down")

        }

    } else if (direction === "left" && gameGrid[indexY][indexX - 1] != "/") {
        if (gameGrid[indexY][indexX - 1].includes("key")) {
            updateAcquiredKeys(gameGrid[indexY][indexX - 1], game["gameItems"]["keys"]);
            movePlayer(gameGrid, index, "left")

        } else if (gameGrid[indexY][indexX - 1].includes("chip")) {
            updateChipCount(game["gameItems"]["escapeChips"]);
            movePlayer(gameGrid, index, "left")

        } else if (gameGrid[indexY][indexX - 1].includes("lock")) {
            checkKeyStatus(gameGrid[indexY][indexX - 1], game["gameItems"]["keys"])
                ? movePlayer(gameGrid, index, "left") : null;

        } else {
            movePlayer(gameGrid, index, "left")

        }

    } else if (direction === "right" && gameGrid[indexY][indexX + 1] != "/") {
        if (gameGrid[indexY][indexX + 1].includes("key")) {
            updateAcquiredKeys(gameGrid[indexY][indexX + 1], game["gameItems"]["keys"]);
            movePlayer(gameGrid, index, "right")

        } else if (gameGrid[indexY][indexX + 1].includes("chip")) {
            updateChipCount(game["gameItems"]["escapeChips"]);
            movePlayer(gameGrid, index, "right")

        } else if (gameGrid[indexY][indexX + 1].includes("lock")) {
            checkKeyStatus(gameGrid[indexY][indexX + 1], game["gameItems"]["keys"])
                ? movePlayer(gameGrid, index, "right") : null;

        } else {
             movePlayer(gameGrid, index, "right")
             
        } 
    }
};

// render gameGrid to DOM
const renderGameBoard = function(gameGrid) {

    const $gameBoard = $(".game-board")
    // empty DOM, otherwise it will contain 1000's of layered elements
    $gameBoard.empty();

    // loop through gameGrid, create and append element based on content
    gameGrid.forEach(function(spaceY, indexY){
        spaceY.forEach(function(spaceX, indexX){
            
            if (spaceX === "/"){
                $("<div/>").addClass("game-board-border")
                .css(`left`, `${5 * indexX}rem`)
                .css(`top`, `${5 * indexY}rem`)
                .appendTo($gameBoard)

            } else if (spaceX === "-"){
                $("<div/>").addClass("game-board-block")
                .css(`left`, `${5 * indexX}rem`)
                .css(`top`, `${5 * indexY}rem`)
                .appendTo($gameBoard)

            } else if (spaceX === "player"){
                let $playerDiv = $("<div/>").addClass("player-container")
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`)

                $("<div/>").addClass("player").appendTo($playerDiv);

                $playerDiv.appendTo($gameBoard)

            } else if (spaceX === "chip"){
                let $hackerChipDiv = $("<div/>").addClass("hacker-chip-container")
                    .css("left", `${5 * indexX}rem`)
                    .css("top", `${5 * indexY}rem`)

                $("<div/>").addClass("hacker-chip").appendTo($hackerChipDiv);

                $hackerChipDiv.appendTo($gameBoard)

            } else if (spaceX.includes("key")) {
                let $keyDiv = $("<div/>").addClass("hacker-key-container")
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`)

                if (spaceX.includes("red")) {
                    $("<div/>").addClass("hacker-key-red").appendTo($keyDiv);

                } else if (spaceX.includes("blue")) {
                    $("<div/>").addClass("hacker-key-blue").appendTo($keyDiv);

                } else if (spaceX.includes("green")) {
                    $("<div/>").addClass("hacker-key-green").appendTo($keyDiv);
                }

                $keyDiv.appendTo($gameBoard)

            } else if (spaceX.includes("lock")) {
                let $lockDiv = $("<div/>").addClass("hacker-lock-container")
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`)

                if (spaceX.includes("red")) {
                    $("<div/>").addClass("hacker-lock-red").appendTo($lockDiv);

                } else if (spaceX.includes("blue")) {
                    $("<div/>").addClass("hacker-lock-blue").appendTo($lockDiv);

                } else if (spaceX.includes("green")) {
                    $("<div/>").addClass("hacker-lock-green").appendTo($lockDiv);
                }

                $lockDiv.appendTo($gameBoard)
            }
        })
    });
}

