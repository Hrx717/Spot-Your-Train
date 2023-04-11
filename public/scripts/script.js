const submit = document.getElementById('submit-btn');
const fromField = document.getElementById('from');
const toField = document.getElementById('to');
let navbar = document.querySelector('.navbar');
let menu = document.querySelector('.menu-icon');

//toggle
menu.onclick = () => {
    navbar.classList.toggle('open');
}

//sending data from client to server
const clientToServer = async (finalUrl)=> {
    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalUrl)
    });

    return 1;
}



const today = new Date();
const date = ('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear();
// console.log(date);
//getting station codes
const getStationCodes = async ()=> {
    //station-codes
    let fromcode = "";
    let tocode = "";
    
    const uri = 'https://gist.githubusercontent.com/apsdehal/11393083/raw/8faed8c05737c62fa04286cce21312951652fff4/Railway%2520Stations';
    const response = await fetch(uri);
    const data = await response.json();
    const data1 = data.data;
    let fromValue = fromField.value.toLowerCase();
    let toValue = toField.value.toLowerCase();

    data1.forEach(element => {
        let str = element.name;
        if(str.toLowerCase() == fromValue || str.toLowerCase().slice(0,str.length-1)==fromValue)
        fromcode = element.code;

        if(str.toLowerCase() == toValue || str.toLowerCase().slice(0,str.length-1)==toValue)
        tocode = element.code;
    });
    console.log({fromcode,tocode});
    let site = `https://www.railyatri.in/booking/trains-between-stations?from_code=${fromcode}&from_name=${fromValue}+&journey_date=${date}&src=tbs&to_code=${tocode}&to_name=${toValue}+&user_id=-1677235224&user_token=61677235224&utm_source=tt_dwebhome_search`;
    console.log(site);

    let finalUrl = {url:site};
    clientToServer(finalUrl);
}


if(submit) {
    submit.onclick = function() {
        getStationCodes()
        
        let loader = document.querySelector('.loader');
        loader.classList.add('loader-after');

        setTimeout(() => {
            loader.classList.remove('loader-after');
            let URL = 'http://localhost:3000/result';
            window.location.href = (URL);
        }, 2100);


        // fromField.value = "";
        // toField.value = "";
    };
}