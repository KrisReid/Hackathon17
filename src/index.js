var request = require("request")

//global variable for the day being selected
var day = "";

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "ShiftIntent") {
      handleShiftIntentResponse(intent, session, callback)
    } else if (intentName == "BookOneIntent") {
      handleBookOneIntentResponse(intent, session, callback)
    } else if (intentName == "BookTwoIntent") {
      handleBookTwoIntentResponse(intent, session, callback)
    } else if (intentName == "BookThreeIntent") {
      handleBookThreeIntentResponse(intent, session, callback)
    } else if (intentName == "AMAZON.YesIntent") {
      handleYesResponse(intent, session, callback)
    } else if (intentName == "AMAZON.NoIntent") {
      handleNoResponse(intent, session, callback)
    } else if (intentName == "AMAZON.HelpIntent") {
      handleGetHelpRequest(intent, session, callback)
    } else if (intentName == "AMAZON.StopIntent") {
      handleFinishSessionRequest(intent, session, callback)
    } else if (intentName == "AMAZON.CancelIntent") {
      handleFinishSessionRequest(intent, session, callback)
    } else {
      throw "Invalid attempt"
    }
}

handleBookThreeIntentResponse

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "Welcome!"

    var reprompt = "How can Tesco assist help you?"

    var header = "Tesco Assist"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function handleShiftIntentResponse (intent, session, callback) {

  this.day = intent.slots.Date.value
  console.log(this.day + " !!!!!!!!!!!!!!!!!!!!")

  getShifts(function(data) {
    getShiftLength (function(data2){
      if (data.length == 0){
        var speechOutput = "There are no shifts available. Check back later for available shifts"
        var shouldEndSession = true
      }
      if (data.length == 1){
        var speechOutput = "There is " + data2 + " shift available. Theis is at: " + data[0] + ". Do you want this shift? Alternatively, say cancel not to select this shift"
        var shouldEndSession = false
      }
      if (data.length == 2){
        var speechOutput = "There are " + data2 + " shifts available. These are at: " + data[0] + ". Or " + data[1] + ". Do you want the first or second shift? Alternatively, say cancel for none of these shifts"
        var shouldEndSession = false
      }
      if (data.length == 3){
        var speechOutput = "There are " + data2 + " shifts available. These are at: " + data[0] + ". Or " + data[1] + ". Or " + data[2] + ". Do you want the first, second, or third shift? Alternatively, say cancel for none of these shifts"
        var shouldEndSession = false
      }
      callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", shouldEndSession))
    })
  })
}

function mockShiftsURL(){
  //Two
  // return "http://www.mocky.io/v2/591dae1b3f0000840777c842"
  //Three
  return "http://www.mocky.io/v2/591dd2a53f00007c0877c8ba"
}

function shiftsURL(){
  return "https://enigmatic-brook-91397.herokuapp.com/api/shifts"
}

function shiftsUpdateURL(){
  return "https://enigmatic-brook-91397.herokuapp.com/api/shift/:_id"
}

function getShifts(callback) {
  request.get(shiftsURL(), function(error, response, body) {

  console.log(body);
    var res = JSON.parse(body);

    shifts = []
    for(var s of res){
      if(s.Assigned == "false"){
        shifts.push(s);
      }
    }
    callback(shifts)
  })
}

function getShiftLength(callback) {
  request.get(shiftsURL(), function(error, response, body) {
    var res = JSON.parse(body);

    shifts = []
    for(var s of res){
      shifts.push(s.StoreName);
    }
    callback(shifts.length)
  })
}


function postShiftId(shift) {
  request.post({
    shiftsUpdateURL(),
    headers:{'content-type': 'application/json'},
    body:shift
  },function(error, response, body) {
    console.log(body);
  })
}


function handleBookOneIntentResponse(intent, session, callback) {
  getShifts(function(data) {
    var shifts = []
    shifts = data
    var firstShift = shifts[0];
    var speechOutput = "You have been booked onto the shift from " + firstShift.ShiftTime + " in " + firstShift.StoreName
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))

    firstShift.Assigned = "true"
    postShiftId(firstShift)

  })
}

function handleBookTwoIntentResponse(intent, session, callback) {
  getShifts(function(data) {
    var shifts = []
    shifts = data
    var secondShift = shifts[1];
    var speechOutput = "You have been booked onto the shift from " + secondShift.ShiftTime + " in " + secondShift.StoreName
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))
  })
}

function handleBookThreeIntentResponse(intent, session, callback) {
  getShifts(function(data) {
    var shifts = []
    shifts = data
    var thirdShift = shifts[2];
    var speechOutput = "You have been booked onto the shift from " + thirdShift.ShiftTime + " in " + thirdShift.StoreName
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))
  })
}


function handleYesResponse(intent, session, callback) {
  var speechOutput = "Great! What else can Tesco assist help you with?"
  var repromptText = speechOutput
  shouldEndSession = false

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleNoResponse(intent, session, callback) {
  handleFinishSessionRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
  if (!session.attributes){
    session.attributes = {};
  }
  var speechOutput = "Tesco assist can currently help you book extra shifts. Keep posted for more!"
  var repromptText = speechOutput
  shouldEndSession = false

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleFinishSessionRequest(intent, session, callback) {
  callback(session.attributes,
    buildSpeechletResponseWithoutCard("Good bye", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
