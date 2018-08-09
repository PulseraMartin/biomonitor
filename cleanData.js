var fs = require('fs')

fs.truncate('TemperatureAlarm.csv', 0, function(){console.log('done')});
fs.truncate('Temperature.csv', 0, function(){console.log('done')});
fs.truncate('Gyroscope.csv', 0, function(){console.log('done')});
fs.truncate('Accelerometer.csv', 0, function(){console.log('done')});

var accelWrite = fs.createWriteStream('Accelerometer.csv', {'flags': 'a'});
var gyroWrite = fs.createWriteStream('Gyroscope.csv', {'flags': 'a'});
var tempWrite = fs.createWriteStream('Temperature.csv', {'flags': 'a'});
var tempAlarm = fs.createWriteStream('TemperatureAlarm.csv');

tempAlarm.write("timestamp,alarm" + '\n');
tempWrite.write("x,Fiebre,Temperatura" + '\n');
gyroWrite.write("x,GyroX,GyroY,GyroZ" + '\n');
accelWrite.write("x,AcelX,AcelY,AcelZ" + '\n');