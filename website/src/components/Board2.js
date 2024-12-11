import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { boardState } from './state';
import Row from './Row';
import { cloneDeep } from 'lodash';
import createBoardString from '../utils/encodeBoardString';
import decodeBoardString from '../utils/decodeBoardString';
import { Box } from '@chakra-ui/react';


const Board = ({ boardString, readOnly = true, chosenColor }) => {

	const numRows = 16;
	const numCols = 32;
	const gap = 2;

	const [board, setBoard] = useRecoilState(boardState);

	const rowNumArray = Array.from(Array(numRows).keys());

	useEffect(() => {
		if (boardString) {
			const str = decodeBoardString(boardString);
			setBoard(str)
		}
	}, [boardString, decodeBoardString]);

	const onPegClick = (e) => {
		const [pegCol, pegRow] = e.target.id.split('-');
		let newBoardState = cloneDeep(board);
		let newVal;
		if (e.button === 0) {
			newVal = chosenColor;
		} else {
			newVal = '0';
		}
		newBoardState[pegCol][pegRow]['c'] = newVal;
		// database.ref(`grid/${pegCol}/${pegRow}`).update({ c: newVal });
		localStorage.setItem('board', createBoardString(newBoardState));
		setBoard(newBoardState);
	};

	const rows = rowNumArray.map((num, i) => {
		return (
			<Row
				key={i}
				gap={gap}
				numPegs={numCols}
				onPegClick={onPegClick}
				rowNum={i}
				readOnly={readOnly}
			/>
		);
	});

	return (
		<Box id="litebrite"
			borderWidth={{ base: 4, lg: 8 }} borderColor='#999'
			style={{
				gap
			}}>
			{rows}
		</Box>
	)
}

export default Board;