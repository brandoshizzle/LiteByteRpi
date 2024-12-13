import React, { useEffect } from 'react';
import { useState, } from 'react';
import './App.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { colorState, boardState } from './components/state';
import Pic1 from './img/IMG_5839.jpg';
import Pic3 from './img/IMG_5904.jpg';
import './index.css';
import Board from './components/BoardCanvas';
import { colors } from './data/colors';
import { Box, Button, Flex, Grid, Heading, Input, ListItem, Text, UnorderedList, useDisclosure } from '@chakra-ui/react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'
import Tappable from 'react-tappable';
import decodeBoardString from './utils/decodeBoardString';
import { ref, set } from 'firebase/database';
import encodeBoardString from './utils/encodeBoardString';

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

	const [title, setTitle] = useState('');
	const [person, setPerson] = useState('');
	const [clearGridTrigger, setClearGridTrigger] = useState(0);

	const [localBoardState, setLocalBoardState] = useState('');
	const [board, setBoard] = useRecoilState(boardState);
	const [chosenColor, setChosenColor] = useRecoilState(colorState);
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { isOpen: saveIsOpen, onOpen: saveOnOpen, onClose: saveOnClose } = useDisclosure()
	const { isOpen: clearIsOpen, onOpen: clearOnOpen, onClose: clearOnClose } = useDisclosure()

	useEffect(() => {
		onOpen();
		const storedImage = localStorage.getItem('litebrite');
		if (storedImage) {
			const storedBoard = decodeBoardString(storedImage);
			setLocalBoardState(storedBoard);
		}
	}, []);

	async function saveDrawing () {
		const boardString = encodeBoardString(board);
		console.log(title, person, boardString);
		const newArt = { title, artist: person, art: boardString };
		try {
			// await set(ref(db, `xmas2024/${Date.now()}`), {
			// 	...newArt,
			// 	created: new Date().toISOString()
			// });
			alert('Artwork submitted! Thanks :) It will be live soon!');
		} catch (error) {
			alert('Hmm, we had an issue. Please let Brandon know at cathcart.brandon@gmail.com');
		}
	}

	return (
		<>
			<Flex p={{ base: 0, lg: 4 }} h='full' w='full' position='fixed' p={1}>
				<Box flex={1} w='full'>
					<Board boardString={localBoardState} chosenColor={chosenColor} readOnly={false} clearGridTrigger={clearGridTrigger} />
				</Box>
				<Box minW={100} h='full' overflowY='scroll'>
					<div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
							{
								colors && Object.keys(colors).map(color => (
									<Tappable onTap={() => {
										setChosenColor(color)
									}}>
										<div className='circle'
											style={{
												height: 60, width: 60, background: colors[color],
												opacity: chosenColor === color ? 1 : 0.8, cursor: 'pointer',
												border: chosenColor === color ? '2px solid #eee' : undefined
											}}></div>
									</Tappable>
								))
							}
							<Tappable onTap={() => clearOnOpen()}>
								<Button>Clear Grid</Button>
							</Tappable>
							<Tappable onTap={() => saveOnOpen()}>
								<Button>Submit Art</Button>
							</Tappable>
						</div>
					</div>
				</Box>
			</Flex >
			<Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xl', lg: '5xl' }} preserveScrollBarGap>
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
							Nice
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={saveIsOpen} onClose={saveOnClose} size={{ base: 'xl', lg: '5xl' }} preserveScrollBarGap>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>Submit your artwork</ModalHeader>
					<ModalBody display='flex' flexDirection='column' gap={4}>
						<Text>
							Once it's submitted, it's done! Talk to Brandon if it should be removed.
						</Text>
						<Grid gridTemplateColumns='50px 1fr' justify='center' gap={2}>
							<Text mt={1}>Title</Text>
							<Input type="text" placeholder="Enter title here" value={title} onChange={e => setTitle(e.target.value)} />
							<Text mt={1}>Artist</Text>
							<Input type="text" placeholder="Enter your name here" value={person} onChange={e => setPerson(e.target.value)} />
						</Grid>
					</ModalBody>
					<ModalFooter display='flex' gap={2}>
						<Button onClick={saveOnClose} variant='ghost'>Cancel</Button>
						<Button onClick={saveDrawing}>Submit</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={clearIsOpen} onClose={clearOnClose} size={{ base: 'xl', lg: '5xl' }} preserveScrollBarGap>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>Clear Grid</ModalHeader>
					<ModalBody display='flex' flexDirection='column' gap={4}>
						<Text>
							Are you sure? This will erase everything you've drawn.
						</Text>
					</ModalBody>
					<ModalFooter display='flex' gap={2}>
						<Button onClick={saveOnClose} size='lg' variant='ghost'>Cancel</Button>
						<Button onClick={() => {
							setClearGridTrigger(prev => prev + 1)
							clearOnClose()
						}} size='lg' bg='red'>Clear</Button>
					</ModalFooter>
				</ModalContent>
			</Modal >
		</>

	);
}

export default Draw;
