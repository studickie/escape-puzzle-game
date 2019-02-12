// keycodes -> up: 38; down: 40; left: 37; right: 39

let game = {
    gameGrid:
        [
            ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
            ["/", "-", "-", "lockblu", "-", "/", "-", "-", "/"],
            ["/", "-", "keyred", "/", "-", "lockred", "keyblu", "-", "/"],
            ["/", "/", "/", "/", "-", "/", "/", "/", "/"],
            ["/", "-", "-", "-", "player", "-", "-", "-", "/"],
            ["/", "lockgrn", "/", "/", "-", "-", "-", "-", "/"],
            ["/", "-", "hkrchp", "/", "-", "-", "keygrn", "-", "/"],
            ["/", "-", "-", "/", "-", "-", "-", "-", "/"],
            ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
        ],

    player: {
        hackerChips: 0,
        keys: {
            red: false,
            green: false,
            blue: false
        }
    },

    gameStatus: {
        exit: false
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
        movePlayer("up", game["gameGrid"]);

    } else if (direction === 40){
        movePlayer("down", game["gameGrid"]);

    } else if (direction === 37){
        movePlayer("left", game["gameGrid"]);
            
    } else if (direction === 39){
        movePlayer("right", game["gameGrid"]);
    };
}

// locate the player value in gameGrid
const findPlayerPosition = function(gameGrid) {

    const indexY = gameGrid.findIndex(spaceY => spaceY.includes("player"));

    const indexX = gameGrid[indexY].findIndex(spaceX => spaceX.includes("player"));

    // return player position to caller in the form of co-ordinates; Y, X
    return [indexY, indexX];
};

// move player value in gameGrid 
const movePlayer = function(direction, gameGrid) {

    const index = findPlayerPosition(gameGrid);

    const indexY = index[0];
    const indexX = index[1];

    if (direction === "up" && gameGrid[indexY - 1][indexX] != "/"){
        updateState(gameGrid[indexY - 1][indexX], game["player"]["keys"])

        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY - 1].splice(indexX, 1, "player");

    } else if (direction === "down" && gameGrid[indexY + 1][indexX] != "/"){
        updateState(gameGrid[indexY + 1][indexX], game["player"]["keys"])

        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY + 1].splice(indexX, 1, "player");

    } else if (direction === "left" && gameGrid[indexY][indexX - 1] != "/"){
        updateState(gameGrid[indexY][indexX - 1], game["player"]["keys"])

        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX - 1, 1, "player");

    } else if (direction === "right" && gameGrid[indexY][indexX + 1] != "/"){
        updateState(gameGrid[indexY][indexX + 1], game["player"]["keys"])

        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX + 1, 1, "player");
    };
};

const updateState = function(gameSpace, keys) {

    gameSpace.includes("key") ? updatePlayerKeys(gameSpace, keys) : null;

    gameSpace.includes("hkrchp") ? updatePlayerChips() : null;
};

const updatePlayerKeys = function(gameSpace, keys) {

    if (gameSpace.includes("red")) {
        keys["red"] = true;

    } else if (gameSpace.includes("grn")) {
        keys["green"] = true

    } else if (gameSpace.includes("blu")) {
        keys["blue"] = true
    }
};

const updatePlayerChips = function() {

    game["player"]["hackerChips"] += 1;
};

// render gameGrid to DOM
const renderGameBoard = function(gameGrid) {

    const $gameBoard = $(".game-board")
    // empty DOM, otherwise it will contain 1000's of layered elements
    $gameBoard.empty();

    // loop through gameGrid, create and append element based on content
    gameGrid.forEach(function(spaceY, indexY){
        spaceY.forEach(function(spaceX, indexX){
            
            if(spaceX === "/"){
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

            } else if (spaceX === "hkrchp"){
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

                } else if (spaceX.includes("blu")) {
                    $("<div/>").addClass("hacker-key-blue").appendTo($keyDiv);

                } else if (spaceX.includes("grn")) {
                    $("<div/>").addClass("hacker-key-green").appendTo($keyDiv);
                }

                $keyDiv.appendTo($gameBoard)

            } else if (spaceX.includes("lock")) {
                let $lockDiv = $("<div/>").addClass("hacker-lock-container")
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`)

                if (spaceX.includes("red")) {
                    $("<div/>").addClass("hacker-lock-red").appendTo($lockDiv);

                } else if (spaceX.includes("blu")) {
                    $("<div/>").addClass("hacker-lock-blue").appendTo($lockDiv);

                } else if (spaceX.includes("grn")) {
                    $("<div/>").addClass("hacker-lock-green").appendTo($lockDiv);
                }

                $lockDiv.appendTo($gameBoard)
            }
        })
    });
}

