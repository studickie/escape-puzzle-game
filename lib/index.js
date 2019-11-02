"use strict";

// keycodes -> up: 38; down: 40; left: 37; right: 39
var game = {}; // game.grid can be changed to create any map without altering other JS values
// --> !!MUST HAVE straight verticle edges; fill blank space with boarder blocks

game.grid = [["/", "/", "/", "/", "exit", "/", "/", "/", "/"], ["/", "chip", "-", "/", "-", "/", "-", "chip", "/"], ["/", "-", "keyred", "/", "-", "lockgreen", "-", "-", "/"], ["/", "lockblue", "/", "/", "-", "/", "/", "/", "/"], ["/", "-", "-", "-", "-", "-", "-", "keygreen", "/"], ["/", "-", "/", "/", "/", "/", "/", "/", "/"], ["/", "-", "/", "keyblue", "-", "lockred", "-", "-", "/"], ["/", "player", "lockgreen", "-", "-", "/", "-", "chip", "/"], ["/", "/", "/", "/", "/", "/", "/", "/", "/"]]; // for more abstracted DOM appending

game.values = [{
  parent: false,
  value: "/",
  "class": "game-boarder-block"
}, {
  parent: false,
  value: "-",
  "class": "game-empty-block"
}, {
  parent: true,
  value: "player",
  "class": "player",
  parentClass: "player-container"
}, {
  parent: true,
  value: "keyred",
  "class": "hacker-key-red",
  parentClass: "hacker-key-container"
}, {
  parent: true,
  value: "keygreen",
  "class": "hacker-key-green",
  parentClass: "hacker-key-container"
}, {
  parent: true,
  value: "keyblue",
  "class": "hacker-key-blue",
  parentClass: "hacker-key-container"
}, {
  parent: true,
  value: "lockred",
  "class": "hacker-lock-red",
  parentClass: "hacker-lock-container"
}, {
  parent: true,
  value: "lockgreen",
  "class": "hacker-lock-green",
  parentClass: "hacker-lock-container"
}, {
  parent: true,
  value: "lockblue",
  "class": "hacker-lock-blue",
  parentClass: "hacker-lock-container"
}, {
  parent: true,
  value: "chip",
  "class": "hacker-chip",
  parentClass: "hacker-chip-container"
}, {
  parent: true,
  value: "exit",
  // value to change based on chips remaining to be collected; see function updateChipCount
  "class": "hacker-exit-closed",
  parentClass: "hacker-exit-container"
}];
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

game.handleStart = function () {
  var $start = $(".button-start");
  var $startMessage = $(".start-instructions");
  var $gameBoard = $(".game-board");
  var $arrowContainer = $(".action-arrows-container ");
  $start.on("click", function () {
    $startMessage.toggleClass("hidden");
    $gameBoard.toggleClass("hidden");
    game.getChipCount(game["grid"]);
    game.setStatusBarChipCount(game["items"]["escapeChips"]);
    game.setGameBoardContainerHeight();
    game.setArrowButtonDisplay($arrowContainer);
    game.renderGameBoard(game["grid"]);
  });
};

game.handleMoveEvents = function () {
  var $arrowButton = $(".arrow-container"); // keyboard arrow key events

  $(document).keydown(function (event) {
    // pass event to directionSelection() whcih determines movement direction
    game.directionSelection(event.which); // after player position value has been modified, render gameGrid in DOM

    game.renderGameBoard(game["grid"]);
  }); // on-screen arrow button events
  // can be slow --> too much going on? arrow keys work fine

  $arrowButton.on("click", function () {
    var direction = $(this).attr("id");
    game.directionSelection(direction);
    game.renderGameBoard(game["grid"]);
  });
}; // receive event.which, route direction value accordingly


game.directionSelection = function (direction) {
  // pass the direction value to movePlayer() according to keypress
  if (direction === 38 || direction === "up") {
    this.movementRules("up", game["grid"]);
  } else if (direction === 40 || direction === "down") {
    this.movementRules("down", game["grid"]);
  } else if (direction === 37 || direction === "left") {
    this.movementRules("left", game["grid"]);
  } else if (direction === 39 || direction === "right") {
    this.movementRules("right", game["grid"]);
  }

  ;
}; // locate the player value in gameGrid


game.findPlayerPosition = function (gameGrid) {
  var indexY = gameGrid.findIndex(function (spaceY) {
    return spaceY.includes("player");
  });
  var indexX = gameGrid[indexY].findIndex(function (spaceX) {
    return spaceX.includes("player");
  }); // return player position to caller in the form of co-ordinates; Y, X

  return [indexY, indexX];
}; // get chip count at start of game; allows any amount to be placed wihout altering game object item values


game.getChipCount = function (gameGrid) {
  var count = 0;
  gameGrid.forEach(function (itemY) {
    itemY.forEach(function (itemX) {
      itemX === "chip" ? count += 1 : null;
    });
  });
  this["items"]["escapeChips"]["remaining"] = count;
}; // find key object that matches gameGrid value, change acquired status to true


game.updateAcquiredKeys = function (newKey, keys) {
  var acquiredKey = keys.find(function (key) {
    return key["id"] === newKey;
  });
  acquiredKey["acquired"] = true;
  this.setStatusBarKeys(acquiredKey);
}; // determins if locked blocks open based on key acquired status


game.checkKeyStatus = function (lock, keys) {
  var keyQuery = keys.find(function (key) {
    return key["lock"] === lock;
  });
  return keyQuery["acquired"];
}; // updates chip count when one is acquired, checks if all chips are collected, opens exit if true


game.updateChipCount = function (chipCount) {
  chipCount["remaining"] -= 1;
  chipCount["acquired"] += 1;
  game.setStatusBarChipCount(chipCount);
  chipCount["remaining"] === 0 ? game.openExit(chipCount, game["values"]) : null;
}; // set exitOpen to true, change append class


game.openExit = function (exit, boardValues) {
  exit["exitOpen"] = true;
  var changeExitClass = boardValues.find(function (piece) {
    return piece["value"] === "exit";
  });
  changeExitClass["class"] = "hacker-exit-open";
}; // player escapes map


game.escapeMap = function (gameGrid, index) {
  var $gameBoard = $(".game-board");
  var $endMessage = $(".completion-popup");
  var $arrowButtons = $(".action-arrows-container");
  var indexY = index[0];
  var indexX = index[1];
  gameGrid[indexY].splice(indexX, 1, "-");
  this.renderGameBoard(gameGrid);
  setTimeout(function () {
    $gameBoard.toggleClass("hidden");
    $endMessage.toggleClass("hidden");
    $arrowButtons.css("display", "none");
  }, 500);
}; // sets number of chip updates to the status bar


game.setStatusBarChipCount = function (chips) {
  var $totalChips = $(".total-chips");
  var $collectedChips = $(".collected-chips");
  $totalChips.text(chips["remaining"]);
  $collectedChips.text(chips["acquired"]);
}; // sets key status on the status bar


game.setStatusBarKeys = function (key) {
  $(".".concat(key["statusClass"])).toggleClass("false");
  $(".".concat(key["statusClass"])).toggleClass("true");
}; // without there is no variable height set on game-board-container, as it could be any size depending on gmae["grid"]; results in elements below placed incorrectly


game.setGameBoardContainerHeight = function () {
  var $gameBoard = $(".game-board-container");
  var $boardHeight = $gameBoard.outerWidth() / game["grid"][0].length * game["grid"].length;
  $gameBoard.css("height", $boardHeight);
};

game.setArrowButtonDisplay = function (arrowContainer) {
  var width = $(window).outerWidth();
  width < 1024 ? arrowContainer.css("display", "grid") : arrowContainer.css("display", "none");
}; // receives parameters, moves player value accordingly within game["grid"]


game.movePlayer = function (gameGrid, index, direction) {
  var indexY = index[0];
  var indexX = index[1];

  if (direction === "up") {
    gameGrid[indexY].splice(indexX, 1, "-");
    gameGrid[indexY - 1].splice(indexX, 1, "player");
  } else if (direction === "down") {
    gameGrid[indexY].splice(indexX, 1, "-");
    gameGrid[indexY + 1].splice(indexX, 1, "player");
  } else if (direction === "left") {
    gameGrid[indexY].splice(indexX, 1, "-");
    gameGrid[indexY].splice(indexX - 1, 1, "player");
  } else if (direction === "right") {
    gameGrid[indexY].splice(indexX, 1, "-");
    gameGrid[indexY].splice(indexX + 1, 1, "player");
  }
}; // set the rules for player movement


game.movementRules = function (direction, gameGrid) {
  var index = this.findPlayerPosition(gameGrid); // player value location as co-ordinates

  var indexY = index[0];
  var indexX = index[1]; // move player up rules

  if (direction === "up" && gameGrid[indexY - 1][indexX] != "/") {
    if (gameGrid[indexY - 1][indexX].includes("key")) {
      this.updateAcquiredKeys(gameGrid[indexY - 1][indexX], this["items"]["keys"]);
      this.movePlayer(gameGrid, index, "up");
    } else if (gameGrid[indexY - 1][indexX].includes("chip")) {
      this.updateChipCount(this["items"]["escapeChips"]);
      this.movePlayer(gameGrid, index, "up");
    } else if (gameGrid[indexY - 1][indexX].includes("lock")) {
      this.checkKeyStatus(gameGrid[indexY - 1][indexX], this["items"]["keys"]) ? this.movePlayer(gameGrid, index, "up") : null;
    } else if (gameGrid[indexY - 1][indexX] === "exit") {
      this["items"]["escapeChips"]["exitOpen"] ? this.escapeMap(gameGrid, index) : null;
    } else {
      this.movePlayer(gameGrid, index, "up");
    } // move player down rules

  } else if (direction === "down" && gameGrid[indexY + 1][indexX] != "/") {
    if (gameGrid[indexY + 1][indexX].includes("key")) {
      this.updateAcquiredKeys(gameGrid[indexY + 1][indexX], this["items"]["keys"]);
      this.movePlayer(gameGrid, index, "down");
    } else if (gameGrid[indexY + 1][indexX].includes("chip")) {
      this.updateChipCount(this["items"]["escapeChips"]);
      this.movePlayer(gameGrid, index, "down");
    } else if (gameGrid[indexY + 1][indexX].includes("lock")) {
      this.checkKeyStatus(gameGrid[indexY + 1][indexX], this["items"]["keys"]) ? this.movePlayer(gameGrid, index, "down") : null;
    } else if (gameGrid[indexY + 1][indexX] === "exit") {
      this["Items"]["escapeChips"]["exitOpen"] ? this.escapeMap(gameGrid, index) : null;
    } else {
      this.movePlayer(gameGrid, index, "down");
    } // move player left rules

  } else if (direction === "left" && gameGrid[indexY][indexX - 1] != "/") {
    if (gameGrid[indexY][indexX - 1].includes("key")) {
      this.updateAcquiredKeys(gameGrid[indexY][indexX - 1], this["items"]["keys"]);
      this.movePlayer(gameGrid, index, "left");
    } else if (gameGrid[indexY][indexX - 1].includes("chip")) {
      this.updateChipCount(this["items"]["escapeChips"]);
      this.movePlayer(gameGrid, index, "left");
    } else if (gameGrid[indexY][indexX - 1].includes("lock")) {
      this.checkKeyStatus(gameGrid[indexY][indexX - 1], this["items"]["keys"]) ? this.movePlayer(gameGrid, index, "left") : null;
    } else if (gameGrid[indexY][indexX - 1] === "exit") {
      this["items"]["escapeChips"]["exitOpen"] ? this.escapeMap(gameGrid, index) : null;
    } else {
      this.movePlayer(gameGrid, index, "left");
    } // move player right rules

  } else if (direction === "right" && gameGrid[indexY][indexX + 1] != "/") {
    if (gameGrid[indexY][indexX + 1].includes("key")) {
      this.updateAcquiredKeys(gameGrid[indexY][indexX + 1], this["items"]["keys"]);
      this.movePlayer(gameGrid, index, "right");
    } else if (gameGrid[indexY][indexX + 1].includes("chip")) {
      this.updateChipCount(this["items"]["escapeChips"]);
      this.movePlayer(gameGrid, index, "right");
    } else if (gameGrid[indexY][indexX + 1].includes("lock")) {
      this.checkKeyStatus(gameGrid[indexY][indexX + 1], this["items"]["keys"]) ? this.movePlayer(gameGrid, index, "right") : null;
    } else if (gameGrid[indexY][indexX + 1] === "exit") {
      this["items"]["escapeChips"]["exitOpen"] ? this.escapeMap(gameGrid, index) : null;
    } else {
      this.movePlayer(gameGrid, index, "right");
    }
  }
}; // render gameGrid to DOM


game.renderGameBoard = function (gameGrid) {
  var $gameBoard = $(".game-board"); // width of board used to render game blocks at appropriate size for screen

  var $blockSize = $gameBoard.outerWidth() / game["grid"][0].length;
  var boardValues = game["values"];
  $gameBoard.empty(); // loop through gameGrid, create and append element based on content

  gameGrid.forEach(function (spaceY, indexY) {
    spaceY.forEach(function (spaceX, indexX) {
      // get appropriate object for gameGrid value
      var gamePiece = boardValues.find(function (piece) {
        return piece["value"] === spaceX;
      }); // two options are needed to accomodate a design mistake made early on -> fix if time allows!!

      if (gamePiece["parent"] === false) {
        $("<div/>").addClass("".concat(gamePiece["class"])).css("width", "".concat($blockSize, "px")).css("height", "".concat($blockSize, "px")).css("left", "".concat($blockSize * indexX, "px")).css("top", "".concat($blockSize * indexY, "px")).appendTo($gameBoard);
      } else if (gamePiece["parent"] === true) {
        var $newDiv = $("<div/>").addClass("".concat(gamePiece["parentClass"])) // resize font-size of parent to affect all individual box-shadow pixel sizes in child element
        // did some math.. still not 100% sure why 500 seems relativley static; still problems at small sizes
        .css("fontSize", "".concat($blockSize / 500, "rem")).css("left", "".concat($blockSize * indexX, "px")).css("top", "".concat($blockSize * indexY, "px"));
        $("<div/>").addClass("".concat(gamePiece["class"])).appendTo($newDiv);
        $newDiv.appendTo($gameBoard);
      }
    });
  });
};

game.init = function () {
  game.handleStart();
  game.handleMoveEvents();
};

$(function () {
  game.init();
});