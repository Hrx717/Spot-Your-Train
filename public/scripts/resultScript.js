const element = document.getElementById('main-content');

//trains list
const trainData = async ()=> {
    // const response = await fetch('http://localhost:3000/trains');
    const response = await fetch(window.location.origin + '/trains');
    const data = await response.json();

    //hanle error if get empty array (display entered wrong input)
    if(data.length == 0 || data==' ') {
        const error = document.createElement('h2');
        const node = document.createTextNode('No-trains between stations');
        error.appendChild(node);
        error.style.textAlign = 'center';
        element.appendChild(error);
        return;
    }

    for(let i=0; i<data.length; i++) {
        const temp = data[i];

        const maindiv = document.createElement('div');
        const leftdiv = document.createElement('div');
        const rightdiv = document.createElement('div');
        maindiv.classList.add('main-div');
        leftdiv.classList.add('leftside');
        rightdiv.classList.add('rightside');

        element.appendChild(maindiv);
        //leftside -> train name & active days
        const name = document.createElement('div');
        const nameData = document.createTextNode(temp[1]);
        name.appendChild(nameData);
        name.classList.add('train-name');
        leftdiv.appendChild(name);

        const daysdiv = document.createElement('div');
        daysdiv.classList.add('runs-on');
        leftdiv.appendChild(daysdiv);
        const txt = document.createElement('span');
        const txtData = document.createTextNode('Runs On :- ');
        txt.appendChild(txtData);
        const days = document.createElement('span');
        const daysData = document.createTextNode(temp[3]);
        days.appendChild(daysData);

        daysdiv.appendChild(txt);
        daysdiv.appendChild(days);

        maindiv.appendChild(leftdiv);

        //partition-line
        const partition = document.createElement('div');
        partition.classList.add('partition');
        maindiv.appendChild(partition);
 
        
        //rightside -> arrival, circle1, line, circle2, depart
        const sdiv = document.createElement('div');
        sdiv.classList.add('start');
        const stime = document.createTextNode(temp[0]);
        sdiv.appendChild(stime);
        rightdiv.appendChild(sdiv);

        const connect = document.createElement('div');
        connect.classList.add('connect');
        rightdiv.appendChild(connect);

        const circle1 = document.createElement('div');
        circle1.classList.add('circle1');
        connect.appendChild(circle1);

        const line = document.createElement('div');
        line.classList.add('line');
        connect.appendChild(line);

        const circle2 = document.createElement('div');
        circle2.classList.add('circle2');
        connect.appendChild(circle2);


        const ediv = document.createElement('div');
        ediv.classList.add('end');
        const etime = document.createTextNode(temp[2]);
        ediv.appendChild(etime);
        rightdiv.appendChild(ediv);

        maindiv.appendChild(rightdiv);
    }
}

trainData();