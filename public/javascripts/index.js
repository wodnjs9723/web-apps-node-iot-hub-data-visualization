$(document).ready(function () {
  var timeData = [],
    accXDataArray = [],     //temperatureData
    accYDataArray = [];     //humidityData
    accZDataArray = [];     
  var data = {
    labels: timeData,
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
        data: accXData
      },
      {
        fill: false,
        label: 'accY',
        yAxisID: 'accY',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: accYData
      },
      {
        fill: false,
        label: 'accZ',
        yAxisID: 'accZ',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: accZData
      },
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'AccX, AccY, AccZ Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'AccX',
        type: 'linear',
        scaleLabel: {
          labelString: 'AccX(X)',
          display: true
        },
        position: 'left',
      }, {
          id: 'AccY',
          type: 'linear',
          scaleLabel: {
            labelString: 'AccY(Y)',
            display: true
          },
          position: 'right'
        }, {
          id: 'AccZ',
          type: 'linear',
          scaleLabel: {
            labelString: 'AccZ(Z)',
            display: true
          },
          position: 'right'
        }]
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

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }

  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.accX || !obj.accY || !obj.accZ) {
        return;
      }
      timeData.push(obj.time);
      accXDataArray.push(obj.accX);
      // only keep no more than 50 points in the line chart
      // Data를 50개 이내로 유지하기 위해서 쉬프트시킨다.
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        accXDataArray.shift();
      }

      // ACC Y
      if (obj.accY) {
        accYDataArray.push(obj.accY);    //humidityData
      }
      if (accYDataArray.length > maxLen) {
        accYDataArray.shift();
      }
      // ACC Z
      if (obj.accZ) {
        accYDataArray.push(obj.accZ);
      }
      if (accZDataArray.length > maxLen) {
        accZDataArray.shift();
      }
      // LineChart Update
      myLineChart.update();
    } catch (err) {
      console.error(err);
    }
  }
});
