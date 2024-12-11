import React from 'react';
import { Link } from 'react-router-dom';
import { BsPinAngle } from 'react-icons/bs';
import { MdOutlinePhoto } from 'react-icons/md';
import Board from './components/Board2';
import { Heading, Button, Flex, Box, Text } from '@chakra-ui/react';

const Home = () => {
	return (
		<Flex textAlign='center' direction={{ base: 'row', lg: 'column' }} gap={4} justify='center' align='center' minH='100vh' width='100vw' pt={{ base: 0, lg: 8 }} px={8}>
			<Flex gap={4} direction='column' h='full' justify='center'>
				<Heading>Lite Byte</Heading>
				<Heading size='md'>Draw a picture for our living room :)</Heading>
				<Flex gap={4} justify='center'>
					<Link to="/draw">
						<Button leftIcon={<BsPinAngle />}>
							Draw
						</Button>
					</Link>
					<Link to="/gallery">
						<Button leftIcon={<MdOutlinePhoto />}>
							Gallery
						</Button>
					</Link>
				</Flex>
			</Flex>
			<Flex direction='column' p={4} w='full'>
				<Box>
					<Box m={0} p={2} bg='gray.700'>Currently showing: Cool Art by Cool Artist</Box>
				</Box>
				<Board boardString={''} readOnly />
			</Flex>
		</Flex>
	);
};

export default Home;
