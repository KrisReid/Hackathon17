var request = require("request")

var boards = []
var lists = []

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
    if (intentName == "TrelloBoardIntent") {
      handleTrelloBoardResponse(intent, session, callback)
    } else if (intentName == "TrelloListIntent") {
      handleTrelloListResponse(intent, session, callback)
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
    var speechOutput = "Welcome! How can Trello assist help you?"

    var reprompt = "How can Trello assist help you?"

    var header = "Trello"

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function handleTrelloBoardResponse (intent, session, callback) {
    var speechOutput = "We have an error"
    getTrelloBoards(function(data) {
        if (data != "ERROR") {
            console.log(data);
            var speechOutput = data + ". Is there anything else I can help you with?"
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))
    })
}

function boardsURL(){
  return "https://api.trello.com/1/members/alisonandkris/boards?key=0dec8b1dc8ced70ed1845e09a5daff2d&token=d7e476e54bc051d675f245596c7ab04d6076857907d6830dd419bba46482472d"
}

function getTrelloBoards(callback) {
    request.get(boardsURL(), function(error, response, body) {
        var d = JSON.parse(body)

        boards = []
        for(var i of d){
            boards.push(i.name);
        }
        callback(boards);
    })
}

var board = ""

function handleTrelloListResponse (intent, session, callback) {

  // might need to load boards array first?
  // request.get(boardsURL(), function(error, response, body) {
  //     var d = JSON.parse(body)
  //
  //     boards = []
  //     for(var i of d){
  //         boards.push(i.name);
  //     }
  //     callback(boards);
  // })

  board = intent.slots.Board.value.toLowerCase()
  console.log("BOARD NAME: " + board);
  
  // if (!boards[board]){
  //   var speechOutput = "Sorry, this is not a known board!"
  //   var repromptText = "Try another board"
  //   var header = "Not a known board"
  //
  //   shouldEndSession = false
  //
  //   callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
  //
  // } else {
    getTrelloLists(function(data) {
        if (data != "ERROR") {
            console.log(data);
            var speechOutput = data + ". Is there anything else I can help you with?"
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", false))
    })
  // }
  board = ""

}

function boardsURL2(){
  return "https://api.trello.com/1/boards/jhgWDodC/lists?cards=open&card_fields=name&fields=name&key=0dec8b1dc8ced70ed1845e09a5daff2d&token=d7e476e54bc051d675f245596c7ab04d6076857907d6830dd419bba46482472d"
}

function boardsURL3(){
  return "https://api.trello.com/1/boards/lZuFau6I/lists?cards=open&card_fields=name&fields=name&key=0dec8b1dc8ced70ed1845e09a5daff2d&token=d7e476e54bc051d675f245596c7ab04d6076857907d6830dd419bba46482472d"
}

function boardsURL4(){
  return "https://api.trello.com/1/boards/NTLf9sU6/lists?cards=open&card_fields=name&fields=name&key=0dec8b1dc8ced70ed1845e09a5daff2d&token=d7e476e54bc051d675f245596c7ab04d6076857907d6830dd419bba46482472d"
}

// thirty before thirty
// stuff we want approval board
// house to do list

function getTrelloLists(callback) {

  console.log("BOARD NAME: " + board);

  if (board == "30 before 30") {
    console.log("IN THE 30 IF LOOP")
    request.get(boardsURL3(), function(error, response, body) {
        var d = JSON.parse(body)

        lists = []
        for(var i of d){
            lists.push(i.name);
        }
        callback(lists);
    })
  }
  else if (board == "stuff we want approval board") {
    console.log("IN THE stuff we want approval board IF LOOP")
    request.get(boardsURL2(), function(error, response, body) {
        var d = JSON.parse(body)

        lists = []
        for(var i of d){
            lists.push(i.name);
        }
        callback(lists);
    })
  }
  else if (board == "house to do list") {
    console.log("IN THE house to do IF LOOP")
    request.get(boardsURL4(), function(error, response, body) {
        var d = JSON.parse(body)

        lists = []
        for(var i of d){
            lists.push(i.name);
        }
        callback(lists);
    })
  }
  else {
    console.log("IT DID NONE ...")
  }

}

function handleYesResponse(intent, session, callback) {
  var speechOutput = "Great! What else can Trello assist help you with?"
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
  var speechOutput = "Trello assist can answer your questions about boards. Keep posted for more!"
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
