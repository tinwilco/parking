console.log('Loading function');

var AWS = require('aws-sdk');
AWS.config.update({region:'eu-west-2'});
var dynamo = new AWS.DynamoDB.DocumentClient();
 
module.exports.parking = async (event) => {
   let gdate='';
   let responseCode = 200;
   let retBody=''; 
   console.log("Received event as : " + event);
  
   if (event.queryStringParameters && event.queryStringParameters.date) {
        console.log("Received date: " + event.queryStringParameters.date);
        gdate = event.queryStringParameters.date;
    }
    
    console.log('Received event:', JSON.stringify(event, null, 2));
    var params = {
  TableName: 'parkingSpaces',
  KeyConditionExpression: 'parkDate = :i',
  ExpressionAttributeValues: {
    ':i': gdate
  }
};

var result = await dynamo.query(params).promise()

    let responseBody = {
        result: result,
        input: gdate
    };
    
    // The output from a Lambda proxy integration must be 
    // in the following JSON object. The 'headers' property 
    // is for custom response headers in addition to standard 
    // ones. The 'body' property  must be a JSON string. For 
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    let response = {
        statusCode: responseCode,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://resttesttest.com",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response isnow updated: " + JSON.stringify(response))
    return response;
};