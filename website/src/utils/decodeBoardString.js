import { defaultDB } from "../components/state";

const decodeBoardString = (boardString) => {
	if (!boardString) return '';

	// Decode the board string from format 4c2n to ccccnn
	const boardArray = boardString.match(/[a-zA-Z]+|[0-9]+/g).map((val, index) => {
		if (isNaN(val)) {
			return val.split('');
		} else {
			return val;
		}
	}).flat();

	let longString = '';
	// If letter, repeat it by the number that precedes it
	// If prevous is not a number, repeat it by 1
	boardArray.forEach((val, index) => {
		const lastVal = index > 0 ? boardArray[index - 1] : 'n';
		if (isNaN(val)) {
			const num = isNaN(lastVal) ? 1 : lastVal;
			longString += val.repeat(num);
		}
	});

	return longString;
};

export default decodeBoardString;

function oldDecodeBoardString (boardString) {
	// Decode
	const newBoard = JSON.parse(JSON.stringify(defaultDB));
	let artArray = boardString.match(/[a-zA-Z]+|[0-9]+/g);
	artArray = artArray
		.map((val, index) => {
			if (isNaN(val)) {
				return val.split('');
			} else {
				return val;
			}
		})
		.flat();
	let num = 0;
	let color = '';
	let col = 0;
	let row = 0;
	for (var i = 0; i < artArray.length; i++) {
		const val = artArray[i];
		const lastVal = i > 0 ? artArray[i - 1] : 'n';
		if (isNaN(val)) {
			// It's a letter, so the previous one is the num
			color = val;
			if (isNaN(lastVal)) {
				num = 1;
			} else {
				num = lastVal;
			}
			for (var j = 0; j < num; j++) {
				newBoard[col][row]['c'] = color === 'n' ? 0 : color;
				row++;
				if (row > 15) {
					row = 0;
					col++;
				}
			}
		}
	}
	return newBoard;
}