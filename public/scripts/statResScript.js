const nameheading = document.getElementById('name-num');
const currently = document.getElementById('live-data');
const element = document.getElementById('data-row');

//train headers
const trainHeaders = async() => {
    // const response = await fetch('http://localhost:3000/live-headers');
    const response = await fetch(window.location.origin + '/live-headers');
    const data = await response.json();

    console.log(data);
    if(data.name_number=="" && data.currentStatus=="") {
        data.name_number = "OOPS! No Train Asscociated With Entered Number/Invalid Input";
    }
    else if(data.currentStatus=="") {
        data.currentStatus = "Not Yet Started";
    }

    nameheading.innerText = data.name_number;
    currently.innerText = data.currentStatus;
}


//trains list
const trainData = async ()=> {
    // const response = await fetch('http://localhost:3000/running');
    const response = await fetch(window.location.origin + '/running');
    const data = await response.json();

    //hanle error if get empty array (display entered wrong input)

    for(let i=0; i<data.length;i++) {
        const temp = data[i];

        const maindiv = document.createElement('div');
        maindiv.classList.add('data');

        const station = document.createElement('span');
        station.classList.add('station-name');
        const stationNode = document.createTextNode(temp[0]);
        station.appendChild(stationNode);
        maindiv.appendChild(station);

        const arrive = document.createElement('span');
        const arrive_actual = document.createElement('div');
        arrive_actual.classList.add('actual-time');
        const arrive_schedule = document.createElement('div');
        arrive_schedule.classList.add('scheduled-time');
        if(temp[1]==null) {
            temp[1]='cancelled'
        }
        if(temp[2]==null) {
            temp[2]='-'
        }
        const arriveNode1 = document.createTextNode(temp[1]);
        const arriveNode2 = document.createTextNode(temp[2]);
        arrive_actual.appendChild(arriveNode1);
        arrive_schedule.appendChild(arriveNode2);
        arrive.appendChild(arrive_actual);
        arrive.appendChild(arrive_schedule);
        maindiv.appendChild(arrive);

        const depart = document.createElement('span');
        const depart_actual = document.createElement('div');
        depart_actual.classList.add('actual-time');
        const depart_schedule = document.createElement('div');
        depart_schedule.classList.add('scheduled-time');
        if(temp[3]==null) {
            temp[3]='cancelled'
        }
        if(temp[4]==null) {
            temp[4]='-'
        }
        const departNode1 = document.createTextNode(temp[3]);
        const departNode2 = document.createTextNode(temp[4]);
        depart_actual.appendChild(departNode1);
        depart_schedule.appendChild(departNode2);
        depart.appendChild(depart_actual);
        depart.appendChild(depart_schedule);
        maindiv.appendChild(depart);

        const delay = document.createElement('span');
        const delayNode = document.createTextNode(temp[5]);
        if(temp && temp[5] && temp[5]=='On Time') {
            delay.classList.add('delay-green');
        }
        else if(temp && temp[5] && temp[5]!='On Time') {
            delay.classList.add('delay-red');
        }
        delay.appendChild(delayNode);
        maindiv.appendChild(delay);

        element.appendChild(maindiv);
    }

}

trainData();
trainHeaders();