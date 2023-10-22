require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const hbs = require('hbs');
const bodyParser = require("body-parser");
//task remaining -> hide links by dotenv

//port & paths
const PORT = process.env.PORT || 3000;
const staticPath = path.join(__dirname,'/public');
const templatePath = path.join(__dirname,'templates/views');
const partialPath = path.join(__dirname,'/templates/partials');

//middlewares
const app = express();
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static(staticPath));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

//set view-engine
app.set('view engine','hbs');
app.set('views',templatePath);
hbs.registerPartials(partialPath);


//train between stations
let result = [];
let where = "";
const renderData = async function(siteUrl) {
    let train_name = [];
    let departure_time = [];
    let arrival_time = [];
    let activedays = [];

    const url = siteUrl;
    axios(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('.train_toward_title',html).each(function() {
            const name = $(this).text();
            where = name;
        })

        $('.namePart',html).each(function() {
            const name = $(this).text();
            const name1 = name.trim();
            train_name.push(name1);
        })

        $('.Departure-time-text-1',html).each(function() {
            const start_time = $(this).text();
            departure_time.push(start_time);
        })

        $('.Arrival-time-text-1',html).each(function() {
            const end_time = $(this).text();
            arrival_time.push(end_time);
        })

        let count = 0;
        let temp = [];
        $('.Runnig-d',html).each(function() {
            let day = $(this).filter('.active-day').text();
            if(day=='')
            day = '-';
            temp.push(day);
            count++;
            if(count===7) {
                activedays.push(temp);
                temp=[];
                count=0;
            }
        });

        for(let i=0; i<train_name.length;i++) {
            let temp = [departure_time[i],train_name[i],arrival_time[i],activedays[i]];
            result.push(temp);
        }
        result.sort();
        // console.log(result);
    })
    .catch(err => {
        where += ". OOPS! No trains available/Entered Wrong data";
        console.log(err)
    });
}

//status
let currentStatus = "";
let name_number = "";
let timings = [];
const getLiveStatus = async (number) => {
    let station_names = [];
    let arrive_actual = [];
    let arrive_schedule = [];
    let depart_actual = [];
    let depart_schedule = [];
    let delay = [];
    
    // const statusUrl = `${process.env.SOURCE}${number}/running-status`;
    const statusUrl = `https://www.ixigo.com/trains/${number}/running-status`;
    axios(statusUrl)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('.sec-text',html).each(function() {
            const name = $(this).text();
            currentStatus = name;
            console.log(currentStatus);
        });

        $('.name-number-cntr',html).each(function() {
            const name = $(this).text();
            name_number = name;
        });

        $('.stn-name',html).each(function() {
            const name = $(this).text();
            station_names.push(name);
        });

        let skipone = true;
        $('.delay',html).each(function() {
            const name = $(this).text();
            if(!skipone)
            delay.push(name);
            else
            skipone=false;
        });
        
        let counter = 0;
        let first = true;
        $('.list-time',html).each(function() {
            let name = $(this).text();
            if(name == '')  name = '-';

            if(counter==0) {
                arrive_actual.push(name);
                counter++;
                if(first) {
                    arrive_schedule.push('-');counter++;
                    first=false;
                }
            }
            else if(counter==1) {
                arrive_schedule.push(name);
                counter++;
            }
            else if(counter==2) {
                depart_actual.push(name);
                counter++;
            }
            else {
                depart_schedule.push(name);
                counter=0;
            }
        });
        depart_schedule.push('-')
        
        for(let i=0; i<station_names.length; i++) {
            timings.push([station_names[i],arrive_actual[i],arrive_schedule[i],
                depart_actual[i],depart_schedule[i],delay[i]]);
        }
    })
    .catch(err =>  {
        currentStatus = "NA";
        name_number = "NA";
        console.log(err);
    });
}

//Routes
//pages
app.get('/',(req,res)=> {
    res.render('index');
});

app.get('/result',(req,res)=> {
    if(!where) {
        where = 'OOPS! No Trains or Check Entered Stations';
    }
    res.render('result',{where});
})

app.get('/status',(req,res)=> {
    res.render('status');
});

app.get('/live-running',(req,res)=> {
    res.render('statResult');
});

app.get('/pnr-enquiry',(req,res) => {
    res.render('pnr');
});

app.get('/about',(req,res) => {
    res.render('about');
});

//api's
app.get('/trains', (req,res)=> {
    if(result==[] || result.length==0) {
        res.json(' ');
    }
    else
    res.json(result);
});

// app.get('/between',(req,res)=> {
//     res.json({where});
// });

app.get('/running', (req,res)=> {
    if(timings.length==0) {
        res.json(' ');
    }
    else
    res.json(timings);
});

app.get('/live-headers',(req,res)=> {
    res.json({currentStatus,name_number});
});

app.get('/*',(req,res)=> {
    res.send('Entered wrong url');
});

app.get('status-result',(req,res)=> {
    res.send('Getting status of trains');
});

//getting front-end data
let siteUrl;
app.post('/',(req,res)=> {
    result = [];
    where = "";
    const recieved = req.body;
    siteUrl=recieved.url;
    // console.log(siteUrl);
    renderData(siteUrl);
    res.end();
});

app.post('/status', (req, res) => {
    timings = [];
    currentStatus="";
    name_number="";
    const number = req.body.num;
    // console.log(number);
    getLiveStatus(number);
    res.end();
});


app.listen(PORT, ()=> console.log(`listeninig at port ${PORT}`));