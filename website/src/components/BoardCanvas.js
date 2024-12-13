import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { boardState, colorState } from './state'; // Adjust the import according to your file structure
import { colors } from '../data/colors';
import decodeBoardString from '../utils/decodeBoardString';
import encodeBoardString from '../utils/encodeBoardString';

const BoardCanvas = ({ boardString, readOnly = true, clearGridTrigger }) => {
	const canvasRef = useRef(null);
	const activeColorRef = useRef(null);
	const numRows = 16;
	const numCols = 32;
	const circleRadius = 40;
	const gap = 10;
	const activeColor = useRecoilValue(colorState);
	const setBoard = useSetRecoilState(boardState);
	const boardStringRef = useRef('n'.repeat(numRows * numCols));
	let isDrawing = false;

	useEffect(() => {
		activeColorRef.current = activeColor;
	}, [activeColor]);

	useEffect(() => {
		if (clearGridTrigger) {
			clearGrid();
			setBoard('');
			boardStringRef.current = 'n'.repeat(numRows * numCols);
			localStorage.setItem('litebrite', '');
		}
	}, [clearGridTrigger]);

	const clearGrid = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		for (let row = 0; row < numRows; row++) {
			for (let col = 0; col < numCols; col++) {
				drawCircle(ctx, col, row, 'n');
			}
		}
	};

	const drawCircle = (ctx, col, row, colorKey) => {
		const color = colors[colorKey] || colors.n; // Default to black if color not found
		const x = col * (circleRadius * 2 + gap) + circleRadius;
		const y = row * (circleRadius * 2 + gap) + circleRadius;
		ctx.beginPath();
		ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
		ctx.fillStyle = color;
		if (readOnly && colorKey !== 'n') {
			// add glow
			ctx.shadowColor = color;
			ctx.shadowBlur = 30;
		}
		ctx.fill();
		ctx.closePath();
		ctx.shadowBlur = 0;
	};

	const handleCanvasClick = useCallback((event) => {
		const ctx = canvasRef.current.getContext('2d');
		const rect = canvasRef.current.getBoundingClientRect();
		const x = (event.clientX - rect.left) * (canvasRef.current.width / rect.width);
		const y = (event.clientY - rect.top) * (canvasRef.current.height / rect.height);
		const col = Math.floor(x / (circleRadius * 2 + gap));
		const row = Math.floor(y / (circleRadius * 2 + gap));
		drawCircle(ctx, col, row, activeColorRef.current);
	}, []);

	const handleTouchEvent = (event) => {
		const touch = event.touches[0];
		const ctx = canvasRef.current.getContext('2d');
		const rect = canvasRef.current.getBoundingClientRect();
		const x = (touch.clientX - rect.left) * (canvasRef.current.width / rect.width);
		const y = (touch.clientY - rect.top) * (canvasRef.current.height / rect.height);
		const col = Math.floor(x / (circleRadius * 2 + gap));
		const row = Math.floor(y / (circleRadius * 2 + gap));
		drawCircle(ctx, col, row, activeColorRef.current);
		if (!readOnly) {
			// Update board state
			const index = col * numRows + row;
			// console.log(index, colorKey);
			boardStringRef.current = boardStringRef.current.substring(0, index) + activeColorRef.current + boardStringRef.current.substring(index + 1);
			const newBoardString = encodeBoardString(boardStringRef.current);
			setBoard(newBoardString);
			localStorage.setItem('litebrite', newBoardString);
		}
	};

	const handleMouseDown = (event) => {
		isDrawing = true;
		handleCanvasClick(event);
	};

	const handleMouseMove = (event) => {
		if (isDrawing) {
			handleCanvasClick(event);
		}
	};

	const handleMouseUp = () => {
		isDrawing = false;
	};

	const handleTouchStart = (event) => {
		// If dragging on
		isDrawing = true;
		handleTouchEvent(event);
	};

	const handleTouchMove = (event) => {
		// event.preventDefault();
		if (isDrawing) {
			handleTouchEvent(event);
		}
	};

	const handleTouchEnd = () => {
		isDrawing = false;
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = numCols * (circleRadius * 2 + gap) - gap;
		canvas.height = numRows * (circleRadius * 2 + gap) - gap;

		clearGrid();

		if (!readOnly) {
			canvas.addEventListener('mousedown', handleMouseDown);
			canvas.addEventListener('mousemove', handleMouseMove);
			canvas.addEventListener('mouseup', handleMouseUp);
			canvas.addEventListener('mouseleave', handleMouseUp);
			canvas.addEventListener('touchstart', handleTouchStart);
			canvas.addEventListener('touchmove', handleTouchMove);
			canvas.addEventListener('touchend', handleTouchEnd);
		}

		return () => {
			if (!readOnly) {
				canvas.removeEventListener('mousedown', handleMouseDown);
				canvas.removeEventListener('mousemove', handleMouseMove);
				canvas.removeEventListener('mouseup', handleMouseUp);
				canvas.removeEventListener('mouseleave', handleMouseUp);
				canvas.removeEventListener('touchstart', handleTouchStart);
				canvas.removeEventListener('touchmove', handleTouchMove);
				canvas.removeEventListener('touchend', handleTouchEnd);
			}
		};
	}, [readOnly]);

	useEffect(() => {
		if (boardString) {
			const longString = decodeBoardString(boardString)
			boardStringRef.current = longString;
			let index = 0;
			const ctx = canvasRef.current.getContext('2d');
			// clear canvas
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			for (let col = 0; col < numCols; col++) {
				for (let row = 0; row < numRows; row++) {
					const colorKey = longString[index] || '0';
					drawCircle(ctx, col, row, colorKey);
					index++;
				}
			}
		}
	}, [boardString]);

	return (
		<Box id="litebrite" borderWidth={{ base: 4, lg: 8 }} borderColor='#999'>
			<canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%', }} />
		</Box>
	);
};

export default BoardCanvas;