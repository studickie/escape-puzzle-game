// keycodes -> up: 38; down: 40; left: 37; right: 39

let game = {};

// game.grid can be changed to create any map without altering other JS values
// --> !!MUST HAVE straight verticle edges; fill blank space with boarder blocks
game.grid =
    [
        ["/", "/", "/", "/", "exit", "/", "/", "/", "/"],
        ["/", "chip", "-", "/", "-", "/", "-", "chip", "/"],
        ["/", "-", "keyred", "/", "-", "lockgreen", "-", "-", "/"],
        ["/", "lockblue", "/", "/", "-", "/", "/", "/", "/"],
        ["/", "-", "-", "-", "-", "-", "-", "keygreen", "/"],
        ["/", "-", "/", "/", "/", "/", "/", "/", "/"],
        ["/", "-", "/", "keyblue", "-", "lockred", "-", "-", "/"],
        ["/", "player", "lockgreen", "-", "-", "/", "-", "chip", "/"],
        ["/", "/", "/", "/", "/", "/", "/", "/", "/"],
    ];

game.items = {
    escapeChips: {
        // value to be set at page initilization; see function getChipCount
        remaining: 0,
        acquired: 0,
        exitOpen: false
    },

    keys: [{
        id: "keyred",
        lock: "lockred",
        statusClass: "red-dot",
        acquired: false
    }, {
        id: "keygreen",
        lock: "lockgreen",
        statusClass: "green-dot",
        acquired: false
    }, {
        id: "keyblue",
        lock: "lockblue",
        statusClass: "blue-dot",
        acquired: false
    }]
};

// for more abstracted DOM appending
game.values = [{
        value: "/",
        image: "Wall-Brick.svg"
    },{
        value: "-",
        image: "Floor-Wood.svg"
    },{
        value: "player",
        image: "Player.svg"
    },{
        value: "keyred",
        image: "Key-Red.svg"
    },{
        value: "keygreen",
        image: "Key-Green.svg"
    },{
        value: "keyblue",
        image: "Key-Blue.svg"
    },{
        value: "lockred",
        image: "Lock-Red.svg"
    },{
        value: "lockgreen",
        image: "Lock-Green.svg"   
    },{
        value: "lockblue",
        image: "Lock-Blue.svg"
    },{
        value: "chip",
        image: "Chip.svg"
    },{
        value: "exit",
        image: "Exit-Closed.svg"
    }
];

game.coordinates = {
    up: {
        x: 0,
        y: -1
    },
    down: {
        x: 0,
        y: 1
    },
    left: {
        x: -1,
        y: 0
    },
    right: {
        x: 1,
        y: 0
    }
}

game.handleStart = function() {
    
    const $start = $(".button-start");
    const $startMessage = $(".start-instructions");
    const $gameBoard = $(".game-board");
    const $arrowContainer = $(".action-arrows-container ");

    $start.on("click", function(){

        $startMessage.toggleClass("hidden");
        $gameBoard.toggleClass("hidden");

        game.getChipCount(game["grid"]);
        game.setStatusBarChipCount(game["items"]["escapeChips"]); 
        game.setGameBoardContainerHeight();
        game.setArrowButtonDisplay($arrowContainer);
        game.renderGameBoard(game["grid"]);

    });
};

game.handleMoveEvents = function() {

    const $arrowButton = $(".arrow-container");

    // keyboard arrow key events
    $(document).keydown(function (event) {
        // pass event to directionSelection() whcih determines movement direction
        game.directionSelection(event.which);
        // after player position value has been modified, render gameGrid in DOM
        game.renderGameBoard(game["grid"]);
    });

    // on-screen arrow button events
    // can be slow --> too much going on? arrow keys work fine
    $arrowButton.on("click", function () {

        const direction = $(this).attr("id");

        game.directionSelection(direction);
        game.renderGameBoard(game["grid"]);
    });
}

// receive event.which, route direction value accordingly
game.directionSelection = function(direction) {
   
    // pass the direction value to movePlayer() according to keypress
    if(direction === 38 || direction === "up"){
        this.movementRules("up", game["grid"]);

    } else if (direction === 40 || direction === "down"){
        this.movementRules("down", game["grid"]);

    } else if (direction === 37 || direction === "left"){
        this.movementRules("left", game["grid"]);
            
    } else if (direction === 39 || direction === "right"){
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

// get chip count at start of game; allows any amount to be placed wihout altering game object item values
game.getChipCount = function(gameGrid) {

    let count = 0;

    gameGrid.forEach((itemY) => {itemY.forEach((itemX) => {itemX === "chip" ? count += 1 : null})});

    this["items"]["escapeChips"]["remaining"] = count;
};

// find key object that matches gameGrid value, change acquired status to true
game.updateAcquiredKeys = function(newKey, keys) {

    const acquiredKey = keys.find(key => key["id"] === newKey);
    
    acquiredKey["acquired"] = true;

    this.setStatusBarKeys(acquiredKey)
};

// determins if locked blocks open based on key acquired status
game.checkKeyStatus = function(lock, keys) {

    const keyQuery = keys.find(key => key["lock"] === lock);

    return keyQuery["acquired"];
};

// updates chip count when one is acquired, checks if all chips are collected, opens exit if true
game.updateChipCount = function(chipCount) {

    chipCount["remaining"] -= 1;
    chipCount["acquired"] += 1;

    game.setStatusBarChipCount(chipCount);
    chipCount["remaining"] === 0 && game.openExit(chipCount, game["values"]);
};

// set exitOpen to true, change append class
game.openExit = function(exit, boardValues) {

    exit["exitOpen"] = true;

    const changeExitClass = boardValues.find(piece => piece["value"] === "exit");

    changeExitClass["class"] = "hacker-exit-open";
};

// player escapes map
game.escapeMap = function(gameGrid, index) {

    const $gameBoard = $(".game-board");
    const $endMessage = $(".completion-popup");
    const $arrowButtons = $(".action-arrows-container");

    const indexY = index[0];
    const indexX = index[1];

    gameGrid[indexY].splice(indexX, 1, "-");

    this.renderGameBoard(gameGrid);

    setTimeout(function(){

        $gameBoard.toggleClass("hidden");
        $endMessage.toggleClass("hidden");
        $arrowButtons.css("display", "none");

    }, 500)
};

// sets number of chip updates to the status bar
game.setStatusBarChipCount = function(chips) {

    const $totalChips = $(".total-chips");
    const $collectedChips = $(".collected-chips");

    $totalChips.text(chips["remaining"]);
    $collectedChips.text(chips["acquired"]);
};

// sets key status on the status bar
game.setStatusBarKeys = function(key) {
    
    $(`.${key["statusClass"]}`).toggleClass("false");
    $(`.${key["statusClass"]}`).toggleClass("true");
};

// without there is no variable height set on game-board-container, as it could be any size depending on gmae["grid"]; results in elements below placed incorrectly
game.setGameBoardContainerHeight = function() {
    const $gameBoard = $(".game-board-container")

    const $boardHeight = ($gameBoard.outerWidth() / game["grid"][0].length) 
        * game["grid"].length;
    
    $gameBoard.css("height", $boardHeight);
}

game.setArrowButtonDisplay= function(arrowContainer) {

    const width = $(window).outerWidth()

    width < 1024 ? arrowContainer.css("display", "grid") : arrowContainer.css("display", "none");
};

// receives parameters, moves player value accordingly within game["grid"]
game.movePlayer = function(gameGrid, index, direction) {

    const indexY = index[0];
    const indexX = index[1];
    const valueY = game.coordinates[direction].y;
    const valueX = game.coordinates[direction].x;

    gameGrid[indexY].splice(indexX, 1, "-");
    gameGrid[`${indexY + valueY}`].splice(`${indexX + valueX}`, 1, "player");
};

// set the rules for player movement
game.movementRules = function(direction, gameGrid){

    const index = this.findPlayerPosition(gameGrid);
    // player value location as co-ordinates
    const indexY = index[0];
    const indexX = index[1];
    const valueY = game.coordinates[direction].y;
    const valueX = game.coordinates[direction].x;
    const moveSpace = gameGrid[`${indexY + valueY}`][`${indexX + valueX}`]

    if(moveSpace !== "/") {
        if (moveSpace.includes("key")) {
            this.updateAcquiredKeys(moveSpace, this["items"]["keys"]);
            this.movePlayer(gameGrid, index, direction)

        } else if (moveSpace.includes("chip")) {
            this.updateChipCount(this["items"]["escapeChips"]);
            this.movePlayer(gameGrid, index, direction)

        } else if (moveSpace.includes("lock")) {
            this.checkKeyStatus(moveSpace, this["items"]["keys"])
                && this.movePlayer(gameGrid, index, direction);

        } else if (moveSpace === "exit") {
            this["items"]["escapeChips"]["exitOpen"]
                && this.escapeMap(gameGrid, index);

        } else {
            this.movePlayer(gameGrid, index, direction)
        }
    }
};

// render gameGrid to DOM
game.renderGameBoard = function(gameGrid) {

    const $gameBoard = $(".game-board");
    // width of board used to render game blocks at appropriate size for screen
    const $blockSize = $gameBoard.outerWidth() / game["grid"][0].length;
    const boardValues = game["values"];
    
    $gameBoard.empty();

    gameGrid.forEach((spaceY, indexY) => {
        spaceY.forEach((spaceX, indexX) => {
             
            // get appropriate object for gameGrid value
            const gamePiece = boardValues.find(piece => piece["value"] === spaceX)

            let $newDiv = $("<div/>").addClass("gamepiece")
                // resize font-size of parent to affect all individual box-shadow pixel sizes in child element
                .css(`fontSize`, `${$blockSize / 500}rem`)
                .css(`left`, `${$blockSize * indexX}px`)
                .css(`top`, `${$blockSize * indexY}px`)
                .css("backgroundImage", `url("./assets/${gamePiece['image']}")`);
            
            $newDiv.appendTo($gameBoard);
    })});

};

game.init = function() {

    game.handleStart(); 
    game.handleMoveEvents();
};

$(function(){

    game.init();
});