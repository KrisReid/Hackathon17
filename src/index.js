var request = require("request")

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
  var speechOutput = "We have an error"
  var speechOutput2 = "We have an error"
      getShifts(function(data) {
          if (data != "ERROR") {
              console.log(data);
              var speechOutput = "Yes, there are " + data + " available."
          }
          callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))
      })
      getShiftLength(function(data) {
          if (data != "ERROR") {
              console.log(data);
              var speechOutput2 = "These are the available stores available: " + data
          }
          callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput2, "", false))
      })
}

function shiftsURL(){
  return "http://www.mocky.io/v2/591d885c3f00001f0377c7bc"
}

function getShifts(callback) {
  request.get(shiftsURL(), function(error, response, body) {
    var res = JSON.parse(body);

    shifts = []
    for(var s of res){
      shifts.push(s.StoreName);
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
