// keycodes -> up: 38; down: 40; left: 37; right: 39

let game = {};

game.grid = 
    [
        ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
        ["/", "-", "-", "-", "-", "-", "-", "-", "/"],
        ["/", "-", "lockred", "-", "lockgreen", "-", "lockblue", "-", "/"],
        ["/", "-", "-", "-", "-", "-", "-", "-", "/"],
        ["exit", "-", "-", "-", "player", "-", "-", "-", "/"],
        ["/", "-", "chip", "-", "-", "-", "chip", "-", "/"],
        ["/", "-", "-", "-", "-", "-", "-", "-", "/"],
        ["/", "-", "keyred", "-", "keygreen", "-", "keyblue", "-", "/"],
        ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
    ];
    

// for more abstracted DOM appending
game.values = [{
        parent: false,
        value: "/",
        class: "game-boarder-block"
    },{
        parent: false,
        value: "-",
        class: "game-empty-block"
    },{
        parent: true,
        value: "player",
        class: "player",
        parentClass: "player-container"
    },{
        parent: true,
        value: "keyred",
        class: "hacker-key-red",
        parentClass: "hacker-key-container"
    },{
        parent: true,
        value: "keygreen",
        class: "hacker-key-green",
        parentClass: "hacker-key-container"
    },{
        parent: true,
        value: "keyblue",
        class: "hacker-key-blue",
        parentClass: "hacker-key-container"
    },{
        parent: true,
        value: "lockred",
        class: "hacker-lock-red",
        parentClass: "hacker-lock-container"
    },{
        parent: true,
        value: "lockgreen",
        class: "hacker-lock-green",
        parentClass: "hacker-lock-container"
    },{
        parent: true,
        value: "lockblue",
        class: "hacker-lock-blue",
        parentClass: "hacker-lock-container"
    },{
        parent: true,
        value: "chip",
        class: "hacker-chip",
        parentClass: "hacker-chip-container"
    },{
        parent: true,
        value: "exit",
        // value to change based on chips remaining to be collected
        class: "hacker-exit-closed",
        parentClass: "hacker-exit-container"
    },{
        parent: true,
        value: "x",
        class: "hacker-pillon",
        parentClass: "hacker-pillon-container"
    }
];

game.items = {
    escapeChips: {
        remaining: 2,
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
    }]
};

game.handleEvent = function() {

    $(document).keydown(function(event){
        // pass event to directionSelection() whcih determines movement direction
        game.directionSelection(event.which);
        // after player position value has been modified, render gameGrid in DOM
        game.renderGameBoard(game["grid"]);
    });
};

// receive event.which, route direction value accordingly
game.directionSelection = function(direction) {

    // pass the direction value to movePlayer() according to keypress
    if(direction === 38){
        this.movementRules("up", game["grid"]);

    } else if (direction === 40){
        this.movementRules("down", game["grid"]);

    } else if (direction === 37){
        this.movementRules("left", game["grid"]);
            
    } else if (direction === 39){
        this.movementRules("right", game["grid"]);
    };
};

// locate the player value in gameGrid
game.findPlayerPosition = function(gameGrid) {

    const indexY = gameGrid.findIndex(spaceY => spaceY.includes("player"));

    const indexX = gameGrid[indexY].findIndex(spaceX => spaceX.includes("player"));

    // return player position to caller in the form of co-ordinates; Y, X
    return [indexY, indexX];
};

// find key object that matches gameGrid value, change acquired status to true
game.updateAcquiredKeys = function(newKey, keys) {

    const acquiredKey = keys.find(key => key["id"] === newKey);
    
    acquiredKey["acquired"] = true;
};

// determins if locked blocks open based on key acquired status
game.checkKeyStatus = function(lock, keys) {

    const keyQuery = keys.find(key => key["lock"] === lock);

    return keyQuery["acquired"];
};

// updates chip count
game.updateChipCount = function(chipCount) {

    chipCount["remaining"] -= 1;
    chipCount["acquired"] += 1;

    chipCount["remaining"] === 0 ? game.openExit(chipCount, game["values"]) : null;
};

// set exitOpen to true, change append class; re-apprend board to reflect changes
game.openExit = function(exit, boardValues) {

    exit["exitOpen"] = true;

    const changeExitClass = boardValues.find(piece => piece["value"] === "exit");

    changeExitClass["class"] = "hacker-exit-open";

    this.renderGameBoard(game["grid"]);
};

// player escapes map
game.escapeMap = function(gameGrid, index) {

    const indexY = index[0];
    const indexX = index[1];

    gameGrid[indexY].splice(indexX, 1, "-");

    this.renderGameBoard(gameGrid);

    alert("Level Complete!");
};

// receives parameters, moves player accordingly
game.movePlayer = function(gameGrid, index, direction) {

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

// set the rules for player movement
game.movementRules = function(direction, gameGrid){

    const index = this.findPlayerPosition(gameGrid);
    // player value location as co-ordinates
    const indexY = index[0];
    const indexX = index[1];
    
    // move player up rules
    if (direction === "up" && gameGrid[indexY - 1][indexX] != "/") {
        if (gameGrid[indexY - 1][indexX].includes("key")){
            this.updateAcquiredKeys(gameGrid[indexY - 1][indexX], this["items"]["keys"]);
            this.movePlayer(gameGrid, index, "up")

        } else if (gameGrid[indexY - 1][indexX].includes("chip")){
            this.updateChipCount(this["items"]["escapeChips"]);
            this.movePlayer(gameGrid, index, "up")

        } else if (gameGrid[indexY - 1][indexX].includes("lock")){
            this.checkKeyStatus(gameGrid[indexY - 1][indexX], this["items"]["keys"]) 
                ? this.movePlayer(gameGrid, index, "up") : null;

        } else if (gameGrid[indexY - 1][indexX] === "exit") {
            this["items"]["escapeChips"]["exitOpen"] === true 
                ? this.escapeMap(gameGrid, index) : null;

        } else {
            this.movePlayer(gameGrid, index, "up")
        }
    // move player down rules
    } else if (direction === "down" && gameGrid[indexY + 1][indexX] != "/") {
        if (gameGrid[indexY + 1][indexX].includes("key")) {
            this.updateAcquiredKeys(gameGrid[indexY + 1][indexX], this["items"]["keys"]);
            this.movePlayer(gameGrid, index, "down")

        } else if (gameGrid[indexY + 1][indexX].includes("chip")) {
            this.updateChipCount(this["items"]["escapeChips"]);
            this.movePlayer(gameGrid, index, "down")

        } else if (gameGrid[indexY + 1][indexX].includes("lock")) {
            this.checkKeyStatus(gameGrid[indexY + 1][indexX], this["items"]["keys"])
                ? this.movePlayer(gameGrid, index, "down") : null;

        } else if (gameGrid[indexY + 1][indexX] === "exit") {
            this["Items"]["escapeChips"]["exitOpen"] === true
                ? this.escapeMap(gameGrid, index) : null;

        } else {
            this.movePlayer(gameGrid, index, "down")
        }
    // move player left rules
    } else if (direction === "left" && gameGrid[indexY][indexX - 1] != "/") {
        if (gameGrid[indexY][indexX - 1].includes("key")) {
            this.updateAcquiredKeys(gameGrid[indexY][indexX - 1], this["items"]["keys"]);
            this.movePlayer(gameGrid, index, "left")

        } else if (gameGrid[indexY][indexX - 1].includes("chip")) {
            this.updateChipCount(this["items"]["escapeChips"]);
            this.movePlayer(gameGrid, index, "left")

        } else if (gameGrid[indexY][indexX - 1].includes("lock")) {
            this.checkKeyStatus(gameGrid[indexY][indexX - 1], this["items"]["keys"])
                ? this.movePlayer(gameGrid, index, "left") : null;
            
        } else if (gameGrid[indexY][indexX - 1] === "exit") {
            this["items"]["escapeChips"]["exitOpen"] === true
                ? this.escapeMap(gameGrid, index) : null;

        } else {
            this.movePlayer(gameGrid, index, "left")
        }
    // move player right rules
    } else if (direction === "right" && gameGrid[indexY][indexX + 1] != "/") {
        if (gameGrid[indexY][indexX + 1].includes("key")) {
            this.updateAcquiredKeys(gameGrid[indexY][indexX + 1], this["items"]["keys"]);
            this.movePlayer(gameGrid, index, "right")

        } else if (gameGrid[indexY][indexX + 1].includes("chip")) {
            this.updateChipCount(this["items"]["escapeChips"]);
            this.movePlayer(gameGrid, index, "right")

        } else if (gameGrid[indexY][indexX + 1].includes("lock")) {
            this.checkKeyStatus(gameGrid[indexY][indexX + 1], this["items"]["keys"])
                ? this.movePlayer(gameGrid, index, "right") : null;

        } else if (gameGrid[indexY][indexX + 1] === "exit") {
            this["items"]["escapeChips"]["exitOpen"] === true
                ? this.escapeMap(gameGrid, index) : null;

        } else {
             this.movePlayer(gameGrid, index, "right")  
        } 
    }
};

// render gameGrid to DOM
game.renderGameBoard = function(gameGrid) {

    const $gameBoard = $(".game-board");
    const $blockSize = $gameBoard.outerWidth() / game["grid"][0].length;
    const boardValues = game["values"];
    // empty DOM, otherwise it will contain 1000's of layered elements
    $gameBoard.empty();
    // loop through gameGrid, create and append element based on content
    gameGrid.forEach(function(spaceY, indexY){
        spaceY.forEach(function(spaceX, indexX){
             
            // get appropriate object for gameGrid value
            const gamePiece = boardValues.find(piece => piece["value"] === spaceX)

            // two options are needed to accomodate a design mistake made early in the process -> fix if time allows!!
            if (gamePiece["parent"] === false) {
                $("<div/>").addClass(`${gamePiece["class"]}`)
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`)
                    .appendTo($gameBoard);

            } else if (gamePiece["parent"] === true) {
                let $newDiv = $("<div/>").addClass(`${gamePiece["parentClass"]}`)
                    .css(`fontSize`, `${$blockSize / 500}rem`)
                    .css(`left`, `${5 * indexX}rem`)
                    .css(`top`, `${5 * indexY}rem`);

                $("<div/>").addClass(`${gamePiece["class"]}`).appendTo($newDiv);

                $newDiv.appendTo($gameBoard);
            }
        })
    });
};

game.init = function() {

    game.renderGameBoard(game["grid"]);
    game.handleEvent();
};

$(function(){

    game.init();
});