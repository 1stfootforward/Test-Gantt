function formSubmit() {
	if(formID == null) {
		formID = Object.keys(task).length + 1;
	}
	nameInput = document.getElementById('nameInput').value;
	resourceInput = document.getElementById('resourceInput').value;
	sdateInput = document.getElementById('sdateInput').value;
	edateInput = document.getElementById('edateInput').value;

	var element = {};
	task[formID] = ({"sdate":"January 29, 2016", "edate":edateInput, "duration":null, "name":nameInput, "category":resourceInput});
	
	freshForm();
	loadChart();
}

function formFill(id) {
	document.getElementById('nameInput').value = task[id].name;
	document.getElementById('resourceInput').value = task[id].category;
	document.getElementById('sdateInput').value = task[id].sdate;
	document.getElementById('edateInput').value = task[id].edate;

}

function freshForm() {
	formID = null;
	document.getElementById('nameInput').value = "";
	document.getElementById('resourceInput').value = "";
	document.getElementById('sdateInput').value = "";
	document.getElementById('edateInput').value = "";

}
