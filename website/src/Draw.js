import React, { useEffect } from 'react';
import { useState, } from 'react';
import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { colorState, boardState } from './components/state';
import Draggable from 'react-draggable';
import Pic1 from './img/IMG_5839.jpg';
import Pic3 from './img/IMG_5904.jpg';
import './index.css';
import Board from './components/Board2';
import createBoardString from './utils/encodeBoardString';
import { CirclePicker } from 'react-color';
import { colorsArray, colors } from './data/colors';
import { Box, Button, Flex, Heading, ListItem, Text, UnorderedList, useDisclosure } from '@chakra-ui/react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'

// // Firebase App (the core Firebase SDK) is always required and
// // must be listed before other Firebase SDKs
// import firebase from 'firebase/app';

// // Add the Firebase services that you want to use
// import 'firebase/database';

// const firebaseConfig = {
// 	apiKey: 'AIzaSyDcI54oa6J71Ik8_Tx6f_d7wplRkqpSuH0',
// 	databaseURL: 'https://lite-byte-default-rtdb.firebaseio.com',
// 	projectId: 'lite-byte',
// 	messagingSenderId: '254962244488',
// 	appId: '1:254962244488:web:db3620d98e4ef4ef30f83d',
// };

// firebase.initializeApp(firebaseConfig);

function Draw (props) {

	const db = props.db;

	const board = useRecoilValue(boardState);
	const [chosenColor, setChosenColor] = useRecoilState(colorState);
	const [colorMenuOpen, setColorMenuOpen] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure()

	useEffect(() => {
		onOpen();
	}, []);

	function saveDrawing () {
		const title = prompt('Artwork Title');
		const person = prompt('Artist Name');
		const boardString = createBoardString(board);
		console.log(title, person, boardString);
		const newArt = {};
		newArt[Math.floor(Math.random() * 100000)] = { title, artist: person, art: boardString };
		db.ref('new').update(newArt, (err) => {
			if (err) {
				alert('Hmm, we had an issue. Please let Brandon know at cathcart.brandon@gmail.com');
			} else {
				alert('Artwork submitted! Thanks :) Gallery of all art coming soon.');
			}
		});
	}

	return (
		<Box p={{ base: 0, md: 4 }} h='100vh'>
			<Board chosenColor={chosenColor} readOnly={false} />
			<Modal isOpen={isOpen} onClose={onClose} size='5xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>Welcome to Lite Byte</ModalHeader>
					<ModalBody display='flex' flexDirection='column' gap={4}>
						<Text>
							In Brandon and Heidi's living room is a box that looks just like this filled with LEDs.
						</Text>
						<Text>
							Draw us a holiday picture and it will be added to the gallery. The box rotates
							through all the gallery pictures!
						</Text>
						<Heading size='md'>Instructions:</Heading>
						<UnorderedList>
							<ListItem>Pick a color using the pallete</ListItem>
							<ListItem>Click on a circle to "put in a peg" or drag to put in lots!</ListItem>
							<ListItem>Right-click to erase a peg or choose empty in the palette</ListItem>
							<ListItem>Save it to the gallery when you're done!</ListItem>
						</UnorderedList>
						<Flex gap={4} style={{ maxHeight: 300 }}>
							<img src={Pic1} alt="Merry Ho-ho to you too" width="100%" />
							<img src={Pic3} alt="Kermit the Frog" width="100%" />
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>
							I'm done thanks please let me play now.
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Draggable>
				<div id='color-menu'>
					{
						colorMenuOpen && (
							<CirclePicker
								circleSize={40}
								color={chosenColor}
								onChangeComplete={color => {
									setChosenColor(Object.keys(colors).find(key => colors[key] === color.hex.toUpperCase()))
									setColorMenuOpen(false)
								}}
								colors={colorsArray} />
						)
					}
					<div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
						{
							!colorMenuOpen &&
							<div className='circle'
								onClick={() => {
									console.log('open')
									setColorMenuOpen(!colorMenuOpen)
								}}
								style={{ height: 40, width: 40, background: colors[chosenColor], opacity: 1 }}></div>
						}
						{/* <button style={{ margin: 0, borderRadius: 10 }} onClick={() => setColorMenuOpen(!colorMenuOpen)}><VscSymbolColor /></button> */}
						<Button onClick={() => saveDrawing()}>Done!</Button>
					</div>
				</div>
			</Draggable>
		</Box>
	);
}

export default Draw;
