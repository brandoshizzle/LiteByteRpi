import React from 'react';
import { Link } from 'react-router-dom';
import { BsPinAngle } from 'react-icons/bs';
import { MdOutlinePhoto } from 'react-icons/md';
import Board from './components/BoardCanvas';
import { Heading, Button, Flex, Box, Text } from '@chakra-ui/react';

const Home = () => {
	return (
		<Flex textAlign='center' direction={{ base: 'column', md: 'row' }} gap={4} justify={{ base: 'center' }} align='center' height='full' width='100%' pt={{ base: 0, lg: 8 }} px={{ base: 4, lg: 8 }}>
			<Flex gap={4} direction='column' h='full' justify='center' flex={1}>
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
			<Flex direction='column' py={4} w='full' h='full' flex={2} display='relative'
				justify='center' align='center'>
				<Box width='fit-content' mx='auto'>
					<Text m={0} p={2} px={4} bg='gray.600' width='auto'
						borderTopRadius={12}>Live: Cool Art by Cool Artist</Text>
				</Box>
				<Box display='relative' flex={1} w='full'>
					<Board boardString={''} readOnly />
				</Box>
			</Flex>
		</Flex>
	);
};

export default Home;
