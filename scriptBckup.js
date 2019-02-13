if (spaceX === "/") {
    $("<div/>").addClass("game-boarder-block")
        .css(`left`, `${5 * indexX}rem`)
        .css(`top`, `${5 * indexY}rem`)
        .appendTo($gameBoard)

} else if (spaceX === "-") {
    $("<div/>").addClass("game-empty-block")
        .css(`left`, `${5 * indexX}rem`)
        .css(`top`, `${5 * indexY}rem`)
        .appendTo($gameBoard)

} else if (spaceX === "player") {
    let $playerDiv = $("<div/>").addClass("player-container")
        .css(`left`, `${5 * indexX}rem`)
        .css(`top`, `${5 * indexY}rem`)

    $("<div/>").addClass("player").appendTo($playerDiv);

    $playerDiv.appendTo($gameBoard)

} else if (spaceX === "chip") {
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