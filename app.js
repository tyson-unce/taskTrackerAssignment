// accessing the modules I installed
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

//ALLOWS AN INCOMING API CALL FROM THE FRONTEND TO BE SENT TO THE BACKEND WITHOUT BLOCKING IT
app.use(cors());
// ALLOWS OOUR APIS TO BE SENT IN JSON FORMAT
app.use(express.json());
//THIS CODE IS IMPLENTED BECAUSE WE WON'T BE SENDING ANY FORM DATA
app.use(express.urlencoded({ extended: false }));

//CREATE
//used for creating new data (mysql queries)
app.post('/insert', (request, response) => {
	const { name } = request.body;
	const db = dbService.getDbServiceInstance();

	const result = db.insertNewName(name);

	//RESULT WILL GIVE US A PROMISE, SO THEN AND CATCH ARE USED TO DECIDE WHAT TO DO WITH THE OUTCOME OF SAID PROMISE
	result
		.then((data) => response.json({ data: data }))
		.catch((err) => console.log(err));
});

//READ
//used for reading new data (mysql queries)
app.get('/getAll', (request, response) => {
	// WILL RETURN OBJECT INITIATED BY getDbServiceInstance CLASS
	const db = dbService.getDbServiceInstance();

	const result = db.getAllData();

	//RESULT WILL GIVE US A PROMISE, SO THEN AND CATCH ARE USED TO DECIDE WHAT TO DO WITH THE OUTCOME OF SAID PROMISE
	result
		.then((data) => response.json({ data: data }))
		.catch((err) => console.log(err));
});

//UPDATE
//used for updating new data (mysql queries)
//PATCH IS BEING USED TO UPDATE A SPECIFIC COLUMN, IF PUT WERE BEING USED THE CLIENT WOULD HAVE TO UPDATE EVERY COLUMN WHICH ISN'T NECESSARY
app.patch('/update', (request, response) => {
	const { id, name } = request.body;
	const db = dbService.getDbServiceInstance();

	const result = db.updateNameById(id, name);

	//RESULT WILL GIVE US A PROMISE, SO THEN AND CATCH ARE USED TO DECIDE WHAT TO DO WITH THE OUTCOME OF SAID PROMISE
	result
		.then((data) => response.json({ success: data }))
		.catch((err) => console.log(err));
});

//DELETE
//used for deleting new data (mysql queries)
app.delete('/delete/:id', (request, response) => {
	const { id } = request.params;
	const db = dbService.getDbServiceInstance();

	const result = db.deleteRowById(id);

	//RESULT WILL GIVE US A PROMISE, SO THEN AND CATCH ARE USED TO DECIDE WHAT TO DO WITH THE OUTCOME OF SAID PROMISE
	result
		.then((data) => response.json({ success: data }))
		.catch((err) => console.log(err));
});

//LISTENING FOR THE START OF OUR PORT, CONSOLE LOGGING UPON ACTION
app.listen(process.env.PORT, () => console.log('app is running'));
