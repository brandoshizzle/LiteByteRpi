import { memo } from 'react';
import Peg from './Peg';

function Row (props) {
	console.log('rendering row')
	const pegNumArray = Array.from(Array(props.numPegs).keys());
	const oneRow = pegNumArray.map((num) => {
		return (
			<Peg
				key={num}
				col={num}
				row={props.rowNum}
				id={`${num}-${props.rowNum}`}
				// color={props.rowData[num]}
				readOnly={props.readOnly}
			/>
		);
	});
	return (
		<div style={{ display: 'flex', flex: 1, width: '100%', height: '100%', gap: props.gap || 0 }}>{oneRow}</div>
	);
}

export default memo(Row);