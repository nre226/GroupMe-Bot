'use strict';

require('dotenv').config();

const https = require('https');
const hassanDrinkingResponses = require('../hassanDrinkingResponses.json');

const classifications = {
    "fighter": "warrior",
    "paladin": "warrior",
    "vicar": "warrior",
    "vikar": "warrior",
    "ranger": "warrior",
    "cleric": "priest",
    "druid": "priest",
    "thief": "rogue",
    "theif": "rogue",
    "bard": "rogue",
    "wizard": "mage",
    "mage": "mage",
    "artisan": "artisan"
  };

  const classWPSlotsGainedByLeveling = {
    "warrior": 3,
    "mage": 6,
    "priest": 4,
    "rogue": 4,
    "artisan": 4
  }

  const classNWPSlotsGainedByLeveling = {
    "warrior": 3,
    "mage": 3,
    "priest": 3,
    "rogue": 4,
    "artisan": 2
  }

  const initWPByClass = {
    "warrior": 4,
    "mage": 1,
    "priest": 2,
    "rogue": 2,
    "artisan": 2
  };

  const initNWPByClass = {
    "warrior": 3,
    "mage": 4,
    "priest": 4,
    "rogue": 3,
    "artisan": 4
  };

  const languages = {
    1: 0,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 2,
    10: 2,
    11: 2,
    12: 3,
    13: 3,
    14: 4,
    15: 4,
    16: 5,
    17: 6,
    18: 7,
    19: 8,
    20: 9,
    21: 10,
    22: 11,
    23: 12,
    24: 15,
    25: 20
  }

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
     * Called to handle a random statement by our favorite barkeep
     *
     * @static
     * @return {string}
     */

    static hassanStatement() {
        let verbs = ["eating ", "cooking ", "juggling ", "pushing across ", "beating through ", "chopping down ", "sucking up ", "shooting at ", "hiking towards ", "climbing across "]
        let nouns = ['rat', 'big tree', 'kobold', 'hobgoblin', 'cleric', 'castle wall', 'whole orchestra', 'goblin']
        let singular = ['a ', 'some ', 'a fucking ', 'some fucking ', 'that one ', 'the ', 'her ', 'his ', 'another ', 'my first ']
        let statement = ['0', 'Everyone settle down.', "I'll have no part in this.", 'Shut up and have some soup.', "Don't go dragging me into this!", 'Ask someone else, I do not care.', 'I think you need to lay off the drinks, my friend. Have some soup.', 'Sure, whatever you say.', 'HARHAR not a chance!', 'Go ahead, see what happens. HA!', 'Are you going to cry about it?', 'That’s it, I’m cutting you off! No more drinks for you!', 'Who let you back in here?', 'Why don’t you put it to the toss of a coin?', 'I was thinking of redecorating anyways…', 'HARHARHARH *big mitten hand pat on back*', 'Ha! Sure', "You know, you don't have to go back out there again.", 'You people worry me! *shakes head*', 'Barmaid, bring some more bowls of soup out!', 'WHAT DO YOU THINK YOU ARE DOING?', 'Take it outside, I don’t want you scuffing my floors.', 'Did I ever tell you how I got this scar?', 'Read the sign. Freaks welcome.', "*claps along with the bards' music, without a care in the world*", "I bet the alchemist can help you with that headache you're going to have tomorrow.", "Did somebody say DANCING? *drops it like it's hot*", "I had a friend who was in this very same situation once… It didn't end well.", 'Check the wanted board, friend. I think I saw something you might be interested in.', 'You should try the soup! I found a new ingredient under the docks this morning.', 'Good boy, Doggie.', 'I don’t adventure anymore. And for good reason.', 'Don’t touch the Stone.', 'Don’t look at the Stone.', 'The last idiot who touched the stone died a horrible death. Don’t imitate idiots.', 'You pay your tab yet?', 'No.', 'Yes.', 'I don’t know.', 'Maybe.', '...Why?', 'Shut up I can barely hear the music!', 'You remind me of Thar', 'And you call yourselves adventurers…', '*Hassan stares at you intently*', 'Gods I was strong then!', 'Oh for the love of the gods.', "I don't care, just do it outside!", 'I like you, but watch yourself.', 'Try and think it out. Don’t do anything rash.', 'Hey, NO FIGHTING INDOORS!', 'BOUNCER! SHUT THEM UP!', 'One more screw up and I’ll have you thrown out. Got it?', 'Why don’t you settle down, find yourself a job here? Don’t go to the Island.', 'You are a strange one.', 'I wouldn’t if I were you, friend.', 'I think you should leave.', 'Maybe be more careful next time.', 'You should ask Father Sinan about this', 'I’m sorry about your friend. But that’s what happens when you go to that… place.', 'I can handle it myself.', 'Are you sure about that?', '*rolls eyes* I’m sure.', "*Rolls eyes* 'Wine. Whine. All you adventurers do is wine'", "Oh, you know I'm a sucker for those puppydog eyes. Fine, yes, fine!", "That's one of your better ideas…", "Watch yourself! Last person I kicked out of the bar was Craven and I haven’t seen him since.", "What? You want me to agree with you? ... Well ok, but only this one time.", "Awww, give an old man a hug! *massive bear hug*", "I'll arm wrestle ya for it!", "Need a new tavern wench. Last one became a demigod", "Go ask the dwarves"]
        let it = Math.floor(Math.random() * statement.length)

        if (it === 0) {

            let verb = Math.floor(Math.random() * verbs.length)
            let noun = Math.floor(Math.random() * nouns.length)
            let number = Math.floor(Math.random() * 11) * 10

            if (number < 30) {
                let singularIt = Math.floor(Math.random() * singular.length)
                return `I was ${verbs[verb]} ${singular[singularIt]} ${nouns[noun]} when- WHAT DO YOU PEOPLE WANT? I'M TRYING TO TELL A STORY HERE`;
            } else {
                return `I was ${verbs[verb]} ${number} ${nouns[noun]}s when- WHAT DO YOU PEOPLE WANT? I'M TRYING TO TELL A STORY HERE`;
            }

        } else {
            return statement[it]
        }
    }

    /**
     * Handles asking questions to our favorite barkeep
     *
     * @static
     * @return {string}
     */

    static hassanQuestion() {
        let questions = ["Yes.", "No.", "Maybe."]
        let it = Math.floor(Math.random() * questions.length);

        return questions[it]
    }

    /**
     * Handles getting responses to asking for drinks from our favorite barkeep
     *
     * @static
     * @return {string}
     */

     static hassanDrinking() {
        let statements = hassanDrinkingResponses;
        let it = Math.floor(Math.random() * statements.length);

        return statements[it]
    }

    /**
     * Called to determine a character's expected proficiency slots based on class, level, and intelligence
     *
     * @static
     * @return {string}
     */

    static assessProficiencySlots(messageText) {
        let inputs = messageText.split(' ');
        if(inputs.length !== 4) { // Expecting: [/slots, class, level, INT]
            // let errorResponses = ["WHAT ARE YOU SAYING? I DON'T SPEAK AQUAN", "I think you've had one too many friend", "Maybe."]
            // let it = Math.floor(Math.random() * questions.length);
            return "The expected format is command [SPACE] your class [SPACE] your level [SPACE] your INT Score. Try again, with spirit this time.";
        }

        let charClass = inputs[1];
        let level = inputs[2];
        let intel = inputs[3];
        let WP = 0;
        let NWP = 0;
        let parentClassification = classifications[charClass.toLowerCase()];
        if(!parentClassification) {
            return "I don't know a class by that name...";
        }
        if(isNaN(parseInt(level)) || !Number.isInteger(level) || level < 1 || level > 20) {
            return "That level doesn't seem quite right...";
        }
        if(isNaN(parseInt(intel)) || !Number.isInteger(intel) || intel < 3 || intel > 25) {
            return "You sure about that intelligence?";
        }

        WP = WP+initWPByClass[parentClassification];
        NWP = NWP+initNWPByClass[parentClassification];

        let WPSlotsGainedByLeveling = classWPSlotsGainedByLeveling[parentClassification];
        let NWPSlotsGainedByLeveling = classNWPSlotsGainedByLeveling[parentClassification]

        WP += Math.floor(level / WPSlotsGainedByLeveling);
        NWP += Math.floor(level / NWPSlotsGainedByLeveling);

        let charLangugages = languages[intel];

        if(level === 1) {
            if(parentClassification === "artisan") {
            NWP += 1
            }
        } else if(parentClassification !== "artisan") {
            let charProfsFromLanguage = Math.ceil(charLangugages/2);
            NWP = NWP+Math.min(level-1, charProfsFromLanguage);
        } else if(parentClassification === "artisan") {
            let charProfsFromLanguage = charLangugages;
            NWP = NWP+Math.min(level, charProfsFromLanguage);
        }

        return `The ${charClass} should have ${WP} Weapon Proficiencies and ${NWP} Nonweapon Proficiencies`;
    }

    /**
     * Called to handle rolling for our favorite barkeep
     *
     * @static
     * @return {string}
     */

    static hassanRoll(messageText) {

        let tell = messageText.substring(messageText.indexOf('h')+2)

        // If the user wants a standard die roll from our favorite barkeep
        if((!isNaN(tell[0])) || ((tell[0] == 'd') && (!isNaN(tell[1])))) {

            let newMessageText = `/r ${tell}`

            return this.handleDieRoll(newMessageText);
        }

        // If the user wants an ability check from our favorite barkeep
        else {
            let stat;
            switch(tell[1].toLowerCase()) {
                case 't': stat = 16;
                break;
                case 'e': stat = 8;
                break;
                case 'o': stat = 10;
                break;
                case 'n': stat = 11;
                break;
                case 'i': stat = 12;
                break;
                case 'h': stat = 15;
                break;
                default: stat = 0;
            }


            if (stat===0) {
                return "What in the hell are you trying to get me to do?"
            }

            let dieRoll = Math.floor(Math.random() * 20) + 1;
            let result = stat - dieRoll;

            if(result < 0) {
                return "Failed by "+Math.abs(result)+"...";
            }
            else if (result > 0) {
                return "Success! "+Math.abs(result)+" under.";
            }
            else if (result === 0) {
                return "On.";
            }
        }
    }

    static checkMention(message) {
        const messageText = message.text;

        const allRegex = /\@all/;
        const everyoneRegex = /\@everyone/;

        if(messageText && (allRegex.test(messageText) || everyoneRegex.test(messageText))) {
            return true;
        }

        return false;
    }

    /**
     * Called when the bot receives a message.
     * TO DO: ordering of calls, upgraded dice rolling to include add and subtract, /commands
     *
     * @static
     * @param {Object} message The message data incoming from GroupMe
     * @return {string}
     */
    static checkMessage(message) {
        const messageText = message.text.trim();

        // Place to put the regular expressions to be used
        const botRegex = /^\/shrug$/;
        const rollCharacterRegex = /^\/rollCharacter$/;
        const goodRegex = /^\/good bot$/;
        const hassanRegex = /\/(H|h)assan/;
        const slotsRegex = /\/(S|s)lots/;
        const hassanQuestionRegex = /\/(H|h)assan\?/;
        const hassanDrinkingRegex = /\/(H|h)assan\!/;
        const linkRegex = /^\/link$/;
        const driveRegex = /^\/drive$/;
        const calendarRegex = /^\/calendar$/;
        const rollRegex = /^\/r ([0-9]{1,2})?d([0-9]{1,4})$/;
        const hassanRollRegex = /^\/rh ((((S|s)(T|t)(R|r))|((D|d)(E|e)(X|x))|((C|c)(O|o)(N|n))|((I|i)(N|n)(T|t))|((W|w)(I|i)(S|s))|((C|c)(H|h)(A|a)))|(([0-9]{1,2})?d([0-9]{1,4})))$/;
        const helpRegex = /^\/help$/;
        const nodRegex = /^\/nod(s){0,1}$/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        } else if(messageText && (linkRegex.test(messageText) || driveRegex.test(messageText))) {
            return 'https://drive.google.com/drive/folders/1Inn75BYUSOHcyOiMgE4-Osy6yTdHVxlb'
        } else if(messageText && calendarRegex.test(messageText)) {
            return 'https://island-calendar.herokuapp.com'
        } else if(messageText && helpRegex.test(messageText)) {
            return 'https://github.com/nre226/GroupMe-Bot'
        } else if(messageText && rollRegex.test(messageText)) {
            return this.handleDieRoll(messageText)
        } else if(messageText && goodRegex.test(messageText)) {
            let variance = Math.floor(Math.random() * 2) + 1;
            if(variance == 1) {
                return ":)"
            }
            return "I try"
        } else if(messageText && rollCharacterRegex.test(messageText)) {
            return this.handleRollingCharacter()
        } else if(messageText && slotsRegex.test(messageText)) {
            return this.assessProficiencySlots(messageText)
        } else if(messageText && hassanDrinkingRegex.test(messageText)) {
            return this.hassanDrinking()
        } else if(messageText && hassanQuestionRegex.test(messageText)) {
            return this.hassanQuestion()
        } else if(messageText && hassanRegex.test(messageText)) {
            return this.hassanStatement()
        } else if(messageText && hassanRollRegex.test(messageText)) {
            return this.hassanRoll(messageText)
        } else if(messageText && nodRegex.test(messageText)) {
            return '*nods*';
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

    static getGroupId(callbackFn) {
        callbackFn("Please... This will work and I am just doing it to make me feel a little better...");
        // console.log('getting group id')
        // // Get the GroupMe bot id saved in `.env`
        // const accessToken = process.env.ACCESS_TOKEN;

        // var options = {
        //     host: 'www.reddit.com',
        //     port: 443,
        //     path: '/r/TellMeAFact/top/.json?count=1',
        //     method: 'GET'
        // };

        // callbackFn("111 This will work and I am just doing it to make me feel a little better...");

        // var req = https.request(options, function(res) {
        //     callbackFn(res.statusCode.toString());
        // });

        // callbackFn("This will work and I am just doing it to make me feel a little better...");

        // req.on('error', function(e) {
        //     callbackFn('problem with request: ' + e.message);
        // });

        // req.end();
        // callbackFn('Past the end...');





        // const options = {
        //     hostname: 'api.groupme.com',
        //     path: '/v3/groups?token='+accessToken,
        //     method: 'GET'
        // };

        // // Make the POST request to GroupMe with the http module
        // const apiRequest = https.get(options, function(response) {
        //     return "Does it work in here?";
        //     if (response.statusCode !== 202) {
        //         console.log('Rejecting bad status code ' + response.statusCode);
        //     }

        //     response.on('data', (test) => {
        //         return test;
        //     })
        // });
        // console.log('after request')

        // // On error
        // apiRequest.on('error', function(error) {
        //     console.log('Error posting message ' + JSON.stringify(error));
        // });

        // // On timeout
        // apiRequest.on('timeout', function(error) {
        //     console.log('Timeout posting message ' + JSON.stringify(error));
        // });

        // // Finally, send the body to GroupMe as a string
        // console.log("immediately before the end")
        // apiRequest.end();
        // console.log('after the end')
    };

    //TODO: Need to add functionality to get userids for a group and add them into the @everyone automatically.

    static sendMention(messageText) {
        // Get the GroupMe bot id saved in `.env`
        const botId = process.env.BOT_ID;

        const userids = ['21561546', '20896823', '22820261', '21300347', '22820263', '24365259', '3411029', '24875384', '19542518', '31510906', '6085493', '23757906', '19805360', '23757907', '25616793', '8209125', '45258464', '7282458', '29099901', '33087177'];
        let lociList = []

        for (let id of userids) {
            lociList.push([0,8])
        }

        const options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        };

        const body = {
            bot_id: botId,
            text: messageText,
            attachments: [
                {
                    "type":"mentions",
                    "user_ids":userids,
                    "loci":lociList
                }
            ]
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
