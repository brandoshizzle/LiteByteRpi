import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Draw from './Draw';
import Home from './Home';
import Gallery from './Gallery';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import { initializeApp } from 'firebase/app';

// Add the Firebase services that you want to use
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDcI54oa6J71Ik8_Tx6f_d7wplRkqpSuH0',
	databaseURL: 'https://lite-byte-default-rtdb.firebaseio.com',
	projectId: 'lite-byte',
	messagingSenderId: '254962244488',
	appId: '1:254962244488:web:db3620d98e4ef4ef30f83d',
};

const firebaseApp = initializeApp(firebaseConfig);

const App = () => {
	const db = getDatabase(firebaseApp);
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route path="/draw" element={<Draw db={db} />} />
				<Route path="/gallery" element={<Gallery db={db} />} />
			</Routes>
		</Router>
	);
};

export default App;
