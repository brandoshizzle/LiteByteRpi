import React from 'react';
import { colors } from '../data/colors';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mouseState, boardState } from './state';

function Peg (props) {
	const board = useRecoilValue(boardState);
	const [mouse, setMouse] = useRecoilState(mouseState);

	const color = board[props.col][props.row]['c'];
	// const color = '0';

	function changePegColor (e) {
		e.preventDefault();
		props.onPegClick(e);
	}

	return (
		<div
			className="peg"
			onMouseUp={(e) => {
				e.preventDefault();
				setMouse('up');
			}}
		>
			<div
				className="circle"
				id={`${props.col}-${props.row}`}
				style={{
					background: colors[color],
					opacity: color === '0' ? 0.2 : 1,
					boxShadow: color === '0' ? 'none' : `0px 0px 20px ${colors[color]}`,
					cursor: props.readOnly ? 'default' : 'pointer',
				}}
				onMouseDown={(e) => {
					if (props.readOnly) {
						return
					}
					setMouse('down');
					changePegColor(e);
				}}
				onMouseUp={(e) => {
					if (props.readOnly) {
						return
					}
					e.preventDefault();
					setMouse('up');
				}}
				onMouseEnter={(e) => {
					if (props.readOnly) {
						return
					}
					if (mouse === 'down') {
						changePegColor(e);
					}
				}}
			>
				{/* <div className="inner-circle">{props.id}</div> */}
			</div>
		</div>
	);
}

export default Peg;
