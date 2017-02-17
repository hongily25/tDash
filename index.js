/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

var Mojio, Trip, User, Vehicle, assert, async, config, mojio_client, should,self,welcomeMessage;

const Alexa = require('alexa-sdk');
Mojio = require('mojio-client-lite');

async = require('async');
assert = require('assert');
should = require('should');


const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var eventFunction = function(e) {
    var myToken = e.session.user.accessToken;
    
      config = {
    application: '782031c6-d248-4571-9d48-1b4d1a1fa63d',
    secret: '2a310c42-35b7-4e7c-afbd-3da3b15ef462',
    hostname: 'api.moj.io',
    version: 'v1',
    port: '443',
    scheme: 'https',
    signalr_port: '80',
    signalr_scheme: 'http',
    live: false,
    access_token: myToken
      };
    mojio_client = new Mojio(config);
};

const languageStrings = {
    'en-US': {
        translation: {
            FACTS: [
                'You need a new air filter for your car every 12 months or 12,000 miles, whichever comes first.',
                'Most spark plugs need replacing after about 30,000 miles.',
                'On average, you should change your oil every 3,000 miles.',
                'You need to replace most brake pads around every 20,000 miles.',
                'The best times to wax your car include: in the fall, before the first snow falls and in the spring before hot weather moves in.',
                'Check the air pressure level in your tires at least once a month.',
                'Clean headlights, chrome and enamel with baking soda.',
                'A hubcap can be used as a shovel if your car gets stuck in the snow, mud, or sand.',
                'Never warm your car in an attached garage with the garage door closed.',
                'Don\'t open the radiator cap or the pressurized overflow tank cap when the engine is hot.',
                'Replace your windscreen wipers once a year to prevent smearing.',
                'Underinflated tires can decrease fuel efficiency and increase risk of damage or blow out. Consider checking your tire pressure at least once a month.',
                'Balancing tires helps keep them from wearing out early. Proper alignment will prevent your vehicle from pulling to one side.',
            ],
            SKILL_NAME: 'My Dash',
            GET_FACT_MESSAGE: "Here's your car tip: ",
            HELP_MESSAGE: 'You can say tell me a car tip, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    }
};

const handlers = {
    'LaunchRequest': function () {
        self = this;

        mojio_client.get().me().then(function (user) {

          var myName = user.FirstName;
          if (myName == undefined) {
            myName = "";
          }

          welcomeMessage = "Hello " + myName + ". Welcome to My Dash. To get information on general car maintenance, you can say 'give me a car tip' ";

          var reprompt = "Welcome to My Dash. To get information on general car maintenance, you can say 'give me a car tip' ";
          var shouldSessionEnd = false;

          self.emit(':ask', welcomeMessage, reprompt, shouldSessionEnd);
          console.log('success');

        }, function (error) {
          self.emit(':tellWithCard', 'not successful', 'title', 'content');
          console.log(error)
        });
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];

        // Create speech output
        const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
  eventFunction(event);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
