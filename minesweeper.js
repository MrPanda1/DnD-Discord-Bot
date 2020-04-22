// Credit for code goes to "Nommiin" (https://twitter.com/Nommiin/status/1177782730794385408): https://pastebin.com/fyuHxEbw

const Names = [
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine"
];

function irandom(i) {
	return Math.floor(Math.random() * Math.floor(i));
}

function CheckBoard(board, x, y, xoff, yoff) {
	try {
		return board.Grid[x + xoff][y + yoff] == 0;
	} catch (e) {
		return false;
	}
}

function CreateBoard(size) {
	let Board = {
		Grid: [],
		Width: size,
		Height: size,
		String: "",
		Count: Math.max(Math.floor((size * size) / 4), irandom(Math.floor((size * size) / 2)))
	}

	// Create Squares
	for(var yy = 0; yy < Board.Height; yy++) {
		Board.Grid[yy] = [];
		for(var xx = 0; xx < Board.Width; xx++) {
			Board.Grid[yy][xx] = -1;
		}
	}

	// Create Bombs
	for(var i = 0; i < Board.Count; i++) {
        var x = irandom(Board.Width);
        var y = irandom(Board.Height);
        if (Board.Grid[x][y] === 0) {
            i--;
        }
        else {
            Board.Grid[x][y] = 0;
        }
	}
	
	// Create Counters
	for(var yy = 0; yy < Board.Height; yy++) {
		for(var xx = 0; xx < Board.Width; xx++) {
			if (Board.Grid[xx][yy] == -1) {
				let Count = 0;
				if (CheckBoard(Board, xx, yy, 1, 0) == true) Count++;
				if (CheckBoard(Board, xx, yy, -1, 0) == true) Count++;
				if (CheckBoard(Board, xx, yy, 0, -1) == true) Count++;
				if (CheckBoard(Board, xx, yy, 0, 1) == true) Count++;
				if (CheckBoard(Board, xx, yy, -1, -1) == true) Count++;
				if (CheckBoard(Board, xx, yy, 1, -1) == true) Count++;
				if (CheckBoard(Board, xx, yy, -1, 1) == true) Count++;
				if (CheckBoard(Board, xx, yy, 1, 1) == true) Count++;
				if (Count > 0) Board.Grid[xx][yy] = Count;
			}
		}
	}

	// Stringify Board
	for(var i = 0; i < Board.Width * Board.Height; i++) {
		Board.String += "||:";
		switch (Board.Grid[i % Board.Width][Math.floor(i / Board.Height)]) {
			case -1: Board.String += "white_large_square"; break;
			case 0: Board.String += "bomb"; break;
			default: {
				Board.String += Names[Board.Grid[i % Board.Width][Math.floor(i / Board.Height)] - 1];
				break;
			}
		}
		Board.String += ":||";
		if (i % Board.Width == Board.Width - 1) Board.String += "\n";
	}
	return Board;
}

module.exports = {
    CreateBoard
}