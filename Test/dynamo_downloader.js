// Get item from DynamoDB
var i     = Math.round(new Date().getTime()).toFixed(1);
var AWS   = require("aws-sdk");
var path  = require('path');
var fs    = require('fs');

AWS.config.loadFromPath("config.json");

AWS.config.update({
  region: "sa-east-1",
  endpoint: "dynamodb.sa-east-1.amazonaws.com"
});

// var root_path = "/Users/jorge/Documents/javascipt_workspace/docking_station/raw_data/testing_data/";
// var root_path   = "/Users/jorge/Documents/workspace/raw_data/";
var root_path   = "/Users/jorge/Sites/infosecure/";
var accel_root  = "Accelerometer.csv";
var gyro_root   = "Gyroscope.csv";
var lastTime    = 0;
var docClient   = new AWS.DynamoDB.DocumentClient();

function getLatestRecord(){
  setInterval(
    function(){
      console.log("getLatestRecord first call: current lastTime - " + lastTime);
      getLastRecord("accelerometer", root_path + accel_root, lastTime);
      getLastRecord("gyroscope", root_path + gyro_root, lastTime);
    }, 
    1000); // 900
};

function getLastRecord(sensor, path, lastTime){
  var tableName = "martinDemo";
  var KeyCondExp = sensor + " =: val";
  var paramsQuery = {
      TableName : tableName,
      KeyConditionExpression: "sensor = :val",
      ExpressionAttributeValues: {
          ":val":sensor,
      },
      ScanIndexForward: false,
      Limit: 1
  };

  docClient.query(paramsQuery, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("////////////////");
      console.log("Query succeeded.");
      console.log("////////////////");
      data.Items.forEach(function(item) {
        console.log(sensor + " -File downloaded", item.timeStamp.split('.')[0] + ": (current lastTime:)" + lastTime + '\n'  + item.data + '\n');
        if (parseInt(item.timeStamp.split('.')[0]) > lastTime){
          console.log("New data is newer");
          // resetTime(sensor, item.timeStamp.split('.')[0]);
          // console.log("current lastTime: " + lastTime); 
        } else {
          // console.log("New data is older"); 
        }
        var info = item.data.split('\n');
        var file = fs.createWriteStream(path, {'flags': 'a'});
        file.on('error', function(err) { /* error handling */ });
        info.forEach(function(v) { 
          file.write('\n' + v.replace(/\t/g, ','));
        });
        file.end();
        console.log(sensor + " query: A current lastTime - " + lastTime);
      })
      console.log(sensor + " query: B current lastTime - " + lastTime);
    };
    console.log(sensor + " query: C current lastTime - " + lastTime);
  });
  console.log(sensor + " query: D current lastTime - " + lastTime);
};

function resetTime(sensor, newTime){
  lastTime = newTime;
};

getLatestRecord();
