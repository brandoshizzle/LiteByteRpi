import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { boardState } from './state';
import Row from './Row';
import { cloneDeep } from 'lodash';
import createBoardString from '../utils/encodeBoardString';
import decodeBoardString from '../utils/decodeBoardString';
import { Box } from '@chakra-ui/react';


const Board = ({ boardString, readOnly = true }) => {

	const numRows = 16;
	const numCols = 32;
	const gap = 2;

	const [board, setBoard] = useRecoilState(boardState);
	console.log('rendering board')

	const rowNumArray = Array.from(Array(numRows).keys());

	useEffect(() => {
		if (boardString) {
			const str = decodeBoardString(boardString);
			setBoard(str)
		}
	}, [boardString, decodeBoardString]);

	const rows = rowNumArray.map((num, i) => {
		return (
			<Row
				key={i}
				gap={gap}
				numPegs={numCols}
				rowNum={i}
				readOnly={readOnly}
			// rowData={board[i].map(col => col[i])}
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