// keycodes -> up: 38; down: 40; left: 37; right: 39

let gameGrid = 
    [
        ["/","/","/","/","/","/","/","/","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","-","-","-","player","-","-","-","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","-","-","-","-","-","-","-","/"],
        ["/","/","/","/","/","/","/","/","/"],
    ];

$(document).keydown(function(event){

    // pass event to directionSelection() whcih determines movement direction
    directionSelection(event.which);
    // after player position value has been modified, render gameGrid in DOM
    renderGameBoard(gameGrid);
});

// receive event.which, route direction value accordingly
const directionSelection = function(direction) {

    // pass the direction value to movePlayer() according to keypress
    if(direction === 38){
        movePlayer("up");

    } else if (direction === 40){
        movePlayer("down");

    } else if (direction === 37){
        movePlayer("left");
            
    } else if (direction === 39){
        movePlayer("right");
    };
}

// locate the player value in gameGrid
const findPlayerPosition = function() {

    const indexY = gameGrid.findIndex(spaceY => spaceY.includes("player"));

    const indexX = gameGrid[indexY].findIndex(spaceX => spaceX.includes("player"));

    // return player position to caller in the form of co-ordinates; Y, X
    return [indexY, indexX];
};

// move player value in gameGrid 
const movePlayer = function(direction) {

    const index = findPlayerPosition();

    const indexY = index[0];
    const indexX = index[1];

    if (direction === "up" && gameGrid[indexY - 1][indexX] != "/"){
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY - 1].splice(indexX, 1, "player");

    } else if (direction === "down" && gameGrid[indexY + 1][indexX] != "/"){
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY + 1].splice(indexX, 1, "player");

    } else if (direction === "left" && gameGrid[indexY][indexX - 1] != "/"){
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX - 1, 1, "player");

    } else if (direction === "right" && gameGrid[indexY][indexX + 1] != "/"){
        gameGrid[indexY].splice(indexX, 1, "-");
        gameGrid[indexY].splice(indexX + 1, 1, "player");
    };
};

// render gameGrid to DOM
const renderGameBoard = function(array) {

    // empty DOM, otherwise it will contain 1000's of layered elements
    $(".game-board").empty();

    // loop through gameGrid, create and append element based on content
    array.forEach(function(spaceY, indexY){
         spaceY.forEach(function(spaceX, indexX){
            
            if(spaceX === "/"){
                $("<div/>").addClass("game-board-border")
                .css(`left`, `${5 * indexX}rem`)
                .css(`top`, `${5 * indexY}rem`)
                .appendTo(".game-board")

            } else if (spaceX === "-"){
                $("<div/>").addClass("game-board-block")
                .css(`left`, `${5 * indexX}rem`)
                .css(`top`, `${5 * indexY}rem`)
                .appendTo(".game-board")

            } else if (spaceX === "player"){
                $("<div/>").addClass("player")
                .css(`left`, `${5 * indexX}rem`)
                .css(`top`, `${5 * indexY}rem`)
                .appendTo(".game-board")
            }
        })
    });
}