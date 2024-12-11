import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import Board from './components/Board2';
import { child, get, ref } from 'firebase/database';
import { Box, Button, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react';
import { BsChevronLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Gallery (props) {

	const db = props.db;

	const [boardString, setBoardString] = useState('');
	const [gallery, setGallery] = useState({});

	useEffect(() => {
		const dbRef = ref(db);
		get(child(dbRef, 'gallery')).then((snapshot) => {
			setGallery(snapshot.val());
		});
	}, [db]);

	const onArtClick = (e) => {
		const key = e.target.id;
		const artString = gallery[key].art;
		setBoardString(artString);
	};

	const galleryRows = Object.keys(gallery).map((key, i) => {
		const title = gallery[key].title || 'Untitled';
		const artist = gallery[key].artist || 'Unknown Artist';
		return (
			<div key={key} id={key} onClick={e => onArtClick(e)}>
				<Card className="thumbnail">
					<CardBody p={2} id={key} onClick={e => onArtClick(e)}>
						<Flex style={{ pointerEvents: 'none' }} direction='column'>
							<Heading size='md'>{title}</Heading>
							<Text style={{ opacity: 0.8, fontWeight: 300 }}>{artist}</Text>
						</Flex>
					</CardBody>
				</Card>
			</div>
		);
	});

	return (
		<Flex gap={0} h='100vh'>
			<Box flex={1}>
				<Box p={4}>
					<Link to='/'>
						<Button mb={2} leftIcon={<BsChevronLeft />}>Home</Button>
					</Link>
					<Board boardString={boardString} />
				</Box>
			</Box>
			<Flex direction='column' gap={1} width={{ base: 300, lg: 400 }}>
				<Heading>Gallery</Heading>
				<Box flex={1} p={1} overflowY='scroll'>
					{galleryRows}
				</Box>
			</Flex>
		</Flex>
	);
}

export default Gallery;
