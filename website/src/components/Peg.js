import React, { memo, useCallback, useEffect, useState } from 'react';
import { colors } from '../data/colors';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mouseState, boardState, colorState } from './state';
import { onTouchEnter, onTouchLeave } from '../utils/touchEvents';
import { cloneDeep } from 'lodash';
import encodeBoardString from '../utils/encodeBoardString';

function Peg (props) {
	// const board = useRecoilValue(boardState);
	const [board, setBoard] = useRecoilState(boardState);
	const chosenColor = useRecoilValue(colorState);
	const [mouse, setMouse] = useRecoilState(mouseState);
	const [pegColor, setPegColor] = useState(props.color ? props.color['c'] : '0');

	useEffect(() => {
		if (board[props.col][props.row]['c'] !== pegColor) {
			setPegColor(board[props.col][props.row]['c']);
		}
	}, [board]);

	const onPegClick = useCallback((e) => {
		const [pegCol, pegRow] = e.target.id.split('-');
		console.log('pegCol', pegCol, 'pegRow', pegRow);
		let newBoardState = cloneDeep(board);
		let newVal;
		if (e.button === 0) {
			newVal = chosenColor;
		} else {
			newVal = '0';
		}
		newBoardState[pegCol][pegRow]['c'] = newVal;
		// database.ref(`grid/${pegCol}/${pegRow}`).update({ c: newVal });
		localStorage.setItem('board', encodeBoardString(newBoardState));
		setBoard(newBoardState);
		return newVal;
	}, [chosenColor]);

	function changePegColor (e) {
		e.preventDefault();
		const newColor = onPegClick(e);
		setPegColor(newColor);
	}

	useEffect(() => {
		onTouchEnter('.circle', function (el) {
			console.log('touch enter', el.id);
			// el.preventDefault();
			if (mouse === 'down') {
				changePegColor({ target: { id: el.id } });
			}
		});
		onTouchLeave('.circle', function (el) {
			console.log('touch leave');
			// if (mouse === 'down') {
			// 	changePegColor(el);
			// }
		});
	}, []);

	return (
		<div
			className="peg"
			onPointerUp={(e) => {
				e.preventDefault();
				setMouse('up');
			}}
		>
			<div
				className="circle"
				id={`${props.col}-${props.row}`}
				style={{
					background: colors[pegColor],
					opacity: pegColor === '0' ? 0.2 : 1,
					boxShadow: pegColor === '0' ? 'none' : `0px 0px 20px ${colors[pegColor]}`,
					cursor: props.readOnly ? 'default' : 'pointer',
				}}
				onPointerDown={(e) => {
					if (props.readOnly) {
						return
					}
					e.preventDefault();
					setMouse('down');
					changePegColor(e);
				}}
				onPointerUp={(e) => {
					if (props.readOnly) {
						return
					}
					e.preventDefault();
					setMouse('up');
				}}
				onPointerEnter={(e) => {
					if (props.readOnly) {
						return
					}
					if (mouse === 'down') {
						e.preventDefault();
						changePegColor(e);
					}
				}}
			>
				{/* <div className="inner-circle">{props.id}</div> */}
			</div>
		</div>
	);
}

export default memo(Peg);
