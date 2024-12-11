
export default function encodeBoardString (objBoard) {
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