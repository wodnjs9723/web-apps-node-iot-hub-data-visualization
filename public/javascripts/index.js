$(document).ready(function () {
  var timeDataArray = [],
    accXDataArray = [],     //Harmful GasData
    accYDataArray = [],     //Co GasData
    accZDataArray = [];     
  var data = {
    labels: timeDataArray,
    datasets: [
      {
        fill: false,
        label: 'accX',
        yAxisID: 'accX',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: accXDataArray
      }
      ,
      {
        fill: false,
        label: 'accY',
        yAxisID: 'accY',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: accYDataArray
      }
            /*
        ,
      {
        fill: false,
        label: 'accZ',
        yAxisID: 'accZ',
        borderColor: "rgba(0, 0, 240, 1)",
        pointBoarderColor: "rgba(0, 0, 240, 1)",
        backgroundColor: "rgba(0, 0, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(0, 0, 240, 1)",
        pointHoverBorderColor: "rgba(0, 0, 240, 1)",
        data: accZDataArray
      }
      */ 
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Harmful Gas & CO Gas Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'accX',
        type: 'linear',
        scaleLabel: {
          labelString: 'Harmful Gas',
          display: true
        },
        position: 'left',
      }
      , {
          id: 'accY',
          type: 'linear',
          scaleLabel: {
            labelString: 'CO Gas',
            display: true
          },
          position: 'right'
        }
        /*
        , {
          id: 'accZ',
          type: 'linear',
          scaleLabel: {
            labelString: 'AccZ(Z)',
            display: true
          },
          position: 'right'
        }
      */
      ]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });


  /*var ws = new WebSocket('wss://' + WonWookHub.azure-devices.net);*/

  var ws = new WebSocket('wss://' + SillaHub.azure-devices.net);

  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }

  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.timeunix || !obj.accX) {
        return;
      }
      timeDataArray.push(obj.timeunix);
      accXDataArray.push(obj.accX);
      // only keep no more than 50 points in the line chart
      // Data를 50개 이내로 유지하기 위해서 쉬프트시킨다.
      const maxLen = 50;
      var len = timeDataArray.length;
      if (len > maxLen) {
        timeDataArray.shift();
        accXDataArray.shift();
      }

     
      // ACC Y
      if (obj.accY) {
        accYDataArray.push(obj.accY);    //humidityData
      }
      if (accYDataArray.length > maxLen) {
        accYDataArray.shift();
      }
      /*
      // ACC Z
      if (obj.accZ) {
        accYDataArray.push(obj.accZ);
      }
      if (accZDataArray.length > maxLen) {
        accZDataArray.shift();
      }
      */
      // LineChart Update
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
