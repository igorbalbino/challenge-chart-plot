import './App.css';
import Chart from 'chart.js/auto';

let os = null;
let browser = null;
let type = null;
let n1 = null;
let n2 = null;
let data = [];
let dataDate = null;
let isCreated = {
  'start': false,
  'span': false,
  'data': false,
  'stop': false
};

function App() {
  return (
    <div className="App">
    <div class="title has-grey-background"><h1>Igor's Challenge</h1></div>
    <div>
      <select id="type">
        <option value="start">Start</option>
      </select>
</div>
    <div>
      <select id="os" className="invisible">
        <option value="windows">Windows</option>
        <option value="linux">Linux</option>
        <option value="mac">Mac</option>
      </select>
      <select id="browser" className="invisible">
        <option value="chrome">Chrome</option>
        <option value="mozilla">Mozilla</option>
        <option value="iexplorer">Internet Explorer</option>
      </select>
    </div>
    <div><input id="n1" className="invisible" type="number"  placeholder="give a value"/><input id="n2" className="invisible" type="number"  placeholder="give a value"/></div>
    <div><input type="submit" onClick={init} /></div>
    <div><canvas id="mychart"></canvas></div>
    </div>
  );
}

function init() {
  os = document.getElementById('os');
  browser = document.getElementById('browser');
  type = document.getElementById('type');
  n1 = document.getElementById('n1');
  n2 = document.getElementById('n2');
  
  drawChart();
  checkInputs();
};

function checkInputs() {
  if(!checkEmpty(type)) {
    if(!checkEmptyString(type.value) && type.value === 'start') {
      if(!isCreated.start) {
        isCreated.start = true;
        data.push(handleStart())
      };
    } else if(!checkEmptyString(type.value) && type.value === 'span') {
      if(!isCreated.span) {
        isCreated.span = true;
        data.push(handleSpan());
      }
    } else if(!checkEmptyString(type.value) && type.value === 'data' && !checkEmptyString(n1.value) && !checkEmptyString(n2.value)) {
      data.push(handleData());
      isCreated.data = true;
    } else if(!checkEmptyString(type.value) && type.value === 'stop') {
      if(!isCreated.stop) {
        isCreated.stop = true;
        data.push(handleStop());
      }
      drawChart();
    }

  }
}

function checkEmpty(val) {
  return val === null || val === undefined;
}

function checkEmptyString(val) {
  return val === '';
}

function handleStart() {
  let optSpan = new Option('Span', 'span');
  type.add(optSpan);
  os.className = 'visible';
  browser.className = 'visible';
  return {type: 'start', timestamp: Date.now(), select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']};
}

// eslint-disable-next-line
function handleSpan(initDate, endDate) {
  let optData = new Option('Data', 'data');
  type.add(optData);
  n1.className = 'visible';
  n2.className = 'visible';
  return {type: 'span', timestamp: Date.now(), begin: initDate, end: endDate};
}

// eslint-disable-next-line
function handleData() {
  if(dataDate === null) dataDate = Date.now();
  if(!isCreated.data) {
    let optStop = new Option('Stop', 'stop');
    type.add(optStop);
  }
  return {type: 'data', timestamp: dataDate, os: os.value, browser: browser.value, min_response_time: n1.value, max_response_time: n2.value};
}

// eslint-disable-next-line
function handleStop() {
  return {type: 'stop', timestamp: Date.now()};
}

// eslint-disable-next-line
function drawChart(){
  const ctx = document.getElementById('mychart');

  let rawData = data;
  let plotData = [];

  rawData = rawData.map((item) => {
    return item.type === 'data'? item : null;
  });

  rawData = rawData.filter((item) => {
    return item !== null;
  });

  rawData.forEach(el => {
    plotData.push({
      label: 'Positon - ' + el.timestamp,
      data: [el.min_response_time, el.max_response_time],
      fill: false,
      lineTension: 0,
      radius: 5
    });
  });


  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['min', 'max'],
      datasets: plotData
    },
    options: {
      text: 'Chart JS',
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 80,
          fontColor: 'black'
        }
      }
    }
  });
}

export default App;
