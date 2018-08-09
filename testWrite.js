'use strict';
var request = require('request');
var fs = require('fs');

var temp_url  = 'http://18.231.118.122:3000/getTemperatureRecord';
var accel_url = 'http://18.231.118.122:3000/getAccelRecord';
var gyro_url  = 'http://18.231.118.122:3000/getGyroRecord';
var eda_url   = 'http://18.231.118.122:3000/getEdaRecord';
var ppg_url   = 'http://18.231.118.122:3000/getPpgRecord';

var temperature_data    = new Array(9);
var accelerometer_data  = new Array(9);
var eda_data            = new Array(9);
var ppg_data            = new Array(30);

var tempHeader  = "x,temperature,fever";
var accelHeader = "x,AcelX,AcelY,AcelZ" + "\n";
var gyrolHeader = "x,GX,GY,GZ";
var edaHeader   = "x,Comp1,Comp2" + "\n";
var ppgHeader   = "x,greenLed,InfraredLed" + "\n";

function getLastPpgRecord(){
  request.get({
      url: ppg_url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
  			console.log('Status:', res.statusCode);
        console.log('total data: ', data.length);
        var dataStr = "";
        var dataCSv = ppgHeader;
        for(var i = 0; i < 10;i++){
          console.log('Escribiendo segundo: ', i);
          dataCSv += data[9 - i]['package_data'].replace(/\t/g,",");
          dataStr +=  data[9 - i]['package_data'];
          console.log('Escribiendo segundo: ', dataStr);
        }
        fs.writeFile('ppg/ppg.csv', dataCSv);
        fs.writeFile('/Users/jorge/Desktop/escritorio/Investigacion/WesstLabInfra/MVR_Signal_Processing/PPG/PPGData/PPGpost.txt', dataStr);
      }
    });
}

function getLastTemperatureRecord(){
request.get({
    url: temp_url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
			console.log('Status:', res.statusCode);
      var dat_1 = data[0]['package_data'].split("\n")[0];
      var last_temp = dat_1.split("\t")
      var str = last_temp[0] + "," + last_temp[1] + "," + 39.9;
      temperature_data.unshift(str);
      var dataStr = tempHeader;
      temperature_data.forEach(function(v){
        dataStr += "\n" + v;
      });
      temperature_data.pop();
      fs.writeFile('temperature/tempHistory.csv', dataStr);
      fs.writeFile('temperature/tempValue.csv', last_temp[1]);
    }
  });
}

function getLastAccelerometerRecord(){
request.get({
    url: accel_url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      console.log('total data: ', data.length);
      var dataStr = "";
      var dataCSv = accelHeader;
      for(var i = 0; i < 3;i++){
        dataCSv += data[2 - i]['package_data'].replace(/\t/g,",");
        dataStr +=  data[2 - i]['package_data'];
      }
      fs.writeFile('accelerometer/Accelerometer.csv', dataCSv);
  }});
}

function getLastEdaRecord(){
request.get({
    url: eda_url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      console.log('total data EDA: ', data.length);
      var dataStr = "";
      var dataCSv = edaHeader;
      var linea = edaHeader;
      for(var i = 0; i < 3;i++){
        dataCSv += data[2 - i]['package_data'].replace(/\t/g,",");
        dataStr +=  data[2 - i]['package_data'];
        }
      fs.writeFile('eda/eda.csv', dataCSv);
      }
});
}

function getInnertialRecord(){
  setInterval( function() {
    getLastAccelerometerRecord();
    getLastEdaRecord();
    getLastTemperatureRecord();
    getLastPpgRecord();
  }, 950);
};

getInnertialRecord();


// function getLastPpgRecord(){
// request.get({
//     url: ppg_url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
// 			// console.log('Status:', res.statusCode);
//       var dat_1 = data[0]['package_data'].split("\n")[0];
//       var last_temp = dat_1.split("\t")
//       var str = last_temp[0] + "," + last_temp[1] + "," + last_temp[2];
//       console.log('string ppg: ', str);
//       ppg_data.unshift(str);
//       var dataStr = edaHeader;
//       ppg_data.forEach(function(v){
//         dataStr += "\n" + v;
//       });
//       ppg_data.pop();
//       fs.writeFile('ppg/ppg.csv', dataStr);
//     }
//   });
// }
//
// var p = 3.3/3158
// function getLastEdaRecord(){
// request.get({
//     url: eda_url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       console.log('total data EDA: ', data.length);
//       var dataStr = "";
//       var dataCSv = edaHeader;
//       var linea = edaHeader;
//       for(var i = 0; i < 3;i++){
//         dataCSv += data[2 - i]['package_data'].replace(/\t/g,",");
//         dataPack = data[2 - i]['package_data'].split("\n");
//         // data_1 = dataCSv.split(",")[0] + "," + dataCSv.split(",")[1]*p + "," + dataCSv.split(",")[2]*p;
//         for(var i = 0; i < dataPack.lenght;i++){
//           var dat = dataCSv.split(",");
//           var V_o = dat[1]*p;
//           var V_b = dat[2]*p;
//           var eda = 1000000*(3.3 - V_b)/(V_b - V_o);
//           line += dat[0] + "," + eda + "\n";
//         //
//         // dataStr +=  data[2 - i]['package_data'];
//         }
//       // fs.writeFile('eda/eda.csv', dataCSv);
//       }
//     fs.writeFile('eda/eda.csv', linea);
// });
// }
