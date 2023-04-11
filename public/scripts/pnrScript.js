const input_field = document.getElementById('pnr-num');
const submit = document.getElementById('submit-btn');
const mainContainer = document.querySelector('.container');
const errormsg = document.getElementById('error');
const success = document.getElementById('success');
const train_num = document.getElementById('train-num');
const train_name = document.getElementById('train-name');
const datefield = document.getElementById('date');
const where = document.getElementById('stns');
const element = document.getElementById('traveller-info');
const chart_status = document.getElementById('chart');


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a3581df80cmsha706b7809b13e03p1345e7jsn81a79715b9f0',
		'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
	}
};

const getPnrStatus = async () => {
    const val = input_field.value;
    const response = await fetch(`https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${val}`, options);
    const result = await response.json();
    if(result.error != "") {
        errormsg.innerText = result.error;
        success.style.display = 'none';
        errormsg.style.display = 'block';
        return;
    }
    const data = result.data;

    train_num.innerText = data.trainInfo.trainNo;
    train_name.innerText = data.trainInfo.name;
    datefield.innerText = `Journey date: ${data.trainInfo.dt}`;
    where.innerText = `${data.trainInfo.boarding}  ->  ${data.trainInfo.destination}`
    const passengers = data.passengerInfo;
    if(passengers.length==0)
    chart_status.innerText = 'Chart Not Prepared';
    else
    chart_status.innerText = 'Chart Prepared';

    // console.log(passengers[0].currentCoach);
    for(let i=0;i<passengers.length;i++) {
        const div1 = document.createElement('div');
        const node = document.createTextNode(`Passenger ${i+1}: ${passengers[i].currentCoach} / ${passengers[i].currentBerthNo}`)
        div1.appendChild(node);
        element.appendChild(div1);
    }

    errormsg.style.display = 'none';
    success.style.display = 'block';
}


submit.onclick = function() {
    element.innerHTML = '';
    getPnrStatus();
};