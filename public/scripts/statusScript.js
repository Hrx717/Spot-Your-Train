const submit = document.getElementById('submit-btn');
const trainNum = document.getElementById('train-num');
let navbar = document.querySelector('.navbar');
let menu = document.querySelector('.menu-icon');
let rows = document.getElementsByClassName('row');

//toggle
menu.onclick = () => {
    navbar.classList.toggle('open');
}

//add eventlistner on top search suggestion
for(let i=0;i<rows.length;i++) {
    rows[i].addEventListener('click',function(event) {
        // console.log((event.target.innerText).slice(0,5));
        trainNum.value = (event.target.innerText).slice(0,5);
    });
}

//sending data from client to server
const clientToServer = async (value)=> {
    const response = await fetch('/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    });
}

submit.onclick = () => {
    const value = {num:trainNum.value}
    console.log(value);
    clientToServer(value);
    let loader = document.querySelector('.loader');
    loader.classList.add('loader-after');

    setTimeout(() => {
        loader.classList.remove('loader-after');
        // let URL = 'http://localhost:3000/live-running';
        let URL = window.location.origin + '/live-running';
        window.location.href = (URL);
    }, 2100);
}