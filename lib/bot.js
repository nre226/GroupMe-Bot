'use strict';

require('dotenv').config();

const https = require('https');

class Bot {
    /**
     * Called to handle rolling dice for various actions.
     *
     * @static
     * @param {string} messageText The message text containing the roll information incoming from another function
     * @param {Boolean} isAutomatedRoll Determines if it is a roll coming from a user (the base case) or from the app
     * @return {string}
     */
    static handleDieRoll(messageText, isAutomatedRoll=false) {
        let total = 0
        let dieRoll = 0
        let verbose = '('

        let dieCommand = messageText.substring(messageText.indexOf('r')+2)

        let numberOfDice = messageText.substring(messageText.indexOf('r')+2, messageText.indexOf('d')) || 1
        let number = messageText.substring(messageText.indexOf('d')+1)

        if(parseInt(numberOfDice) == 0 || parseInt(number) == 0) {
            return null
        }

        for(let i=0; i<parseInt(numberOfDice); i++) {
            dieRoll = Math.floor(Math.random() * number) + 1;
            total += dieRoll
            if(i !== parseInt(numberOfDice)-1) {
                verbose += dieRoll+", "
            } else {
                verbose += dieRoll+")"
            }
        }

        if(isAutomatedRoll) {
            return parseInt(total)
        }
        return "You got a "+total+"\n"+"Details: ["+dieCommand+" "+verbose+"]"
    }

    /**
     * Called to handle rolling a new character using the handleDieRoll function.
     *
     * @static
     * @return {string}
     */
    static handleRollingCharacter() {
        let output = "You rolled: ["
        for(let i=0; i<6; i++) {
            let currentStat = this.handleDieRoll('/r 3d6', true)
            if(i !== 5) {
                output += currentStat+", "
            } else {
                output += currentStat+"]"
            }
        }
        return output
    }

    /**
     * Called when the bot receives a message.
     * TO DO: /rollCharacter, /Hassan feature, upgraded dice rolling to include +s, /commands
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
    static checkMessage(message) {
        const messageText = message.text;

        // Place to put the regular expressions to be used
        const botRegex = /^\/shrug/;
        const rollCharacterRegex = /^\/rollCharacter/;
        const goodRegex = /^\/good bot/;
        const linkRegex = /^\/link/;
        const rollRegex = /^\/r ([0-9]{1,2})?d[0-9]?[0-9]?[0-9]?[0-9]$/;
        const helpRegex = /^\/help/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        } else if(messageText && linkRegex.test(messageText)) {
            return 'https://drive.google.com/drive/folders/12qucpzG4vB2f7l3eJolTmJh7hkesq6n9'
        } else if(messageText && helpRegex.test(messageText)) {
            return 'https://github.com/nre226/GroupMe-Bot'
        } else if(messageText && rollRegex.test(messageText)) {
            return this.handleDieRoll(messageText)
            // let stringNumber = messageText.substring(4)
            // let number = parseInt(stringNumber)
            // let value = Math.floor(Math.random() * number) + 1;
            // return "You got a "+value
        } else if(messageText && goodRegex.test(messageText)) {
            let variance = Math.floor(Math.random() * 2) + 1;
            if(variance == 1) {
                return ":)"
            }
            return "I try"
        } else if(messageText && rollCharacterRegex.test(messageText)) {
            return this.handleRollingCharacter()
        }

        return null;
    };

    /**
     * Sends a message to GroupMe with a POST request.
     *
     * @static
     * @param {string} messageText A message to send to chat
     * @return {undefined}
     */
    static sendMessage(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText
        };

        // Make the POST request to GroupMe with the http module
        const botRequest = https.request(options, function(response) {
            if (response.statusCode !== 202) {
                console.log('Rejecting bad status code ' + response.statusCode);
            }
        });

        // On error
        botRequest.on('error', function(error) {
            console.log('Error posting message ' + JSON.stringify(error));
        });

        // On timeout
        botRequest.on('timeout', function(error) {
            console.log('Timeout posting message ' + JSON.stringify(error));
        });

        // Finally, send the body to GroupMe as a string
        botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
