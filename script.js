//WHENEVER THE PAGE LOADS IT WILL RUN THIS CALLBACK FUNCTION
document.addEventListener('DOMContentLoaded', function () {
	//MAKING OUR API CALL
	fetch('https://tasktrackertyson.herokuapp.com/getAll')
		//FETCH RETURNS A PROMISE, SO WE USE .THEN FOR AN ACTION IF THE CALL IS SUCCESSFULL,
		.then((response) => response.json())
		.then((data) => loadHTMLTable(data['data']));
});

document
	.querySelector('table tbody')
	.addEventListener('click', function (event) {
		//THE EVENT TARGET CLASSNAME IS THE DATA THAT SPECIFCES WHAT WAS EFFECTED BY YOUR ACTION, SO BASICALLY THIS IS SAYING IF WE CLICKED THE DELETE BUTTON
		if (event.target.className === 'delete-row-btn') {
			deleteRowById(event.target.dataset.id);
		}
		if (event.target.className === 'edit-row-btn') {
			handleEditRow(event.target.dataset.id);
		}
	});

const updateBtn = document.querySelector('#update-row-btn');

//FETCHING DATA FROM THE DELETE CRUD OP
function deleteRowById(id) {
	fetch('https://tasktrackertyson.herokuapp.com/delete/' + id, {
		method: 'DELETE',
	})
		.then((response) => response.json())
		//WHAT WE'RE SAYING HERE IS IF OUR DELETE WAS SUCCSESSFUL, WE'RE RELOADING THE PAGE TO SHOW THE CHANGES
		.then((data) => {
			if (data.success) {
				location.reload();
			}
		});
}

function handleEditRow(id) {
	//IF EDIT BUTTON IS CLICKED THEN THE HIDDEN SECTION WILL NO LONGER BE HIDDEN, THUS HIDDEN === FALSE
	const updateSection = document.querySelector('#update-row');
	updateSection.hidden = false;
	document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function () {
	const updateNameInput = document.querySelector('#update-name-input');

	console.log(updateNameInput);

	fetch('https://tasktrackertyson.herokuapp.com/update', {
		method: 'PATCH',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			id: updateNameInput.dataset.id,
			name: updateNameInput.value,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				location.reload();
			}
		});
};

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
	//MAKING IT TO WHERE WHENEVER A VALUE IS SUBMITTED THE VALUE IS RESET, IN ORDER TO ADD MORE NAMES EVENTUALLY
	const nameInput = document.querySelector('#name-input');
	const name = nameInput.value;
	nameInput.value = '';

	//SENDING THIS INFORMATION TO THE BACKEND
	fetch('https://tasktrackertyson.herokuapp.com/nsert', {
		headers: {
			'Content-type': 'application/json',
		},
		//SINCE WE'RE SENDING DATA TO BACKEND WE WANT TO SEND AS POST, STRINGIFY TURNS OBJECT TO A JSON STRING
		method: 'POST',
		body: JSON.stringify({ name: name }),
	})
		.then((response) => response.json())
		.then((data) => insertRowIntoTable(data['data']));
};

function insertRowIntoTable(data) {
	console.log(data);
	const table = document.querySelector('table tbody');
	//CHECKING TO SEE IF OUR NO-DATA CLASS IS PRESENT
	const isTableData = table.querySelector('.no-data');

	let tableHtml = '<tr>';

	for (var key in data) {
		//since this returns an object we have to see if the data has it's own property because if not it will return an error, and so with that key we will be pulling the data from that object
		if (data.hasOwnProperty(key)) {
			if (key === 'dateAdded') {
				data[key] = new Date(data[key]).toLocaleString();
			}
			tableHtml += `<td>${data[key]}</td>`;
		}
	}

	//WE USE DOT NOTATION HERE SINCE WE ARE NOT IN A LOOP WHERE THE OBJECT IS SPECIFIED
	tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
	tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

	tableHtml += '</tr>';

	//THE LOOP IS THE SAME AS SAYING IF THERE IS NO TABLE DATA, THEN THE HTML WILL OVERRIDE IT, SO OUR TABLE DATA IS INSTANTLY UPDATED
	if (isTableData) {
		table.innerHTML = tableHtml;
	} else {
		const newRow = table.insertRow();
		newRow.innerHTML = tableHtml;
	}
}

function loadHTMLTable(data) {
	//SELECTING THE TABLE TBODY WITH THE QUERY SELECTOR AND ASSIGNING IT A BODY
	const table = document.querySelector('table tbody');

	//IF NO DATA IS ENTERED THE TABLE WILL DISPLAY 'NO DATA'
	if (data.length === 0) {
		table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
		return;
	}

	//LOOP THAT ADDS DATA TO THE TABLE FROM THE DATA IN MYSQL, WHEN DATA IS ENTERED IT WILL DISPLAY EDIT AND DELETE BUTTONS ASWELL
	let tableHtml = '';

	data.forEach(function ({ id, name, date_added }) {
		tableHtml += '<tr>';
		tableHtml += `<td>${id}</td>`;
		tableHtml += `<td>${name}</td>`;
		tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
		tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
		tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
		tableHtml += '</tr>';
	});

	table.innerHTML = tableHtml;
}
