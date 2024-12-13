
const encodeBoardString = (boardString) => {

	// Condense the board string
	let condensedString = '';
	let count = 1;
	for (let i = 0; i < boardString.length; i++) {
		if (boardString[i] === boardString[i + 1]) {
			count++;
		} else {
			if (count > 1) {
				condensedString += count + boardString[i];
			} else {
				condensedString += boardString[i];
			}
			count = 1;
		}
	}

	return condensedString;
};

export default encodeBoardString;

function encodeBoardStringOld (objBoard) {
	let boardString = '';
	let color = '';
	let count = 0;
	for (var col = 0; col < 32; col++) {
		for (var row = 0; row < 16; row++) {
			// console.log(objBoard[col][row].c);
			if (objBoard[col][row].c === color) {
				// console.log(count);
				count++;
			} else {
				color = color === String(0) ? 'n' : color;
				const toAdd = count < 2 ? color : `${count}${color}`;
				boardString = boardString + toAdd;
				color = objBoard[col][row].c;
				count = 1;
			}
		}
	}
	color = color === String(0) ? 'n' : color;
	const toAdd = count < 2 ? color : `${count}${color}`;
	boardString = boardString + toAdd;
	return boardString;
}