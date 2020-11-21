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
        
        if (it === 0 || 1) {
            
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
     * Called to handle rolling for our favorite barkeep
     *
     * @static
     * @return {string}
     */

    static hassanRoll(messageText) {


        let tell2 = messageText.substring((messageText.indexOf('h')+2))
        let tell3 = messageText.substring((messageText.indexOf('h')+3))
        return `tell2 = ${tell2} and tell3 = ${tell3}`
        


        // If the user wants a standard die roll from our favorite barkeep
        if((!isNaN(tell2)) || ((tell2 == 'd') && (isNaN(tell3)))) {

            // Copy/pasted from handleDieRoll above
            this.handleDieRoll(messageText);
            // let total = 0
            // let dieRoll = 0
            // let verbose = '('
    
            // let dieCommand = messageText.substring(messageText.indexOf('r')+2)
    
            // let numberOfDice = messageText.substring(messageText.indexOf('r')+2, messageText.indexOf('d')) || 1
            // let number = messageText.substring(messageText.indexOf('d')+1)
    
            // if(parseInt(numberOfDice) == 0 || parseInt(number) == 0) {
            //     return null
            // }
    
            // for(let i=0; i<parseInt(numberOfDice); i++) {
            //     dieRoll = Math.floor(Math.random() * number) + 1;
            //     total += dieRoll
            //     if(i !== parseInt(numberOfDice)-1) {
            //         verbose += dieRoll+", "
            //     } else {
            //         verbose += dieRoll+")"
            //     }
            // }
    
            // if(isAutomatedRoll) {
            //     return parseInt(total)
            // }
            // return "You got a "+total+"\n"+"Details: ["+dieCommand+" "+verbose+"]"  
        } 
        
        // If the user wants an ability check from our favorite barkeep
        else {
            let stat;

            switch(tell3.toLower()) { 
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
            result = stat - dieRoll;
            if(result > 0) {
                return "Failed by "+Math.abs(result)+"...";
            }
            else if (result < 0) {
                return "Success! "+result+" under.";
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
        const hassanQuestionRegex = /\/(H|h)assan\?/
        const linkRegex = /^\/link$/;
        const driveRegex = /^\/drive$/;
        const calendarRegex = /^\/calendar$/;
        const rollRegex = /^\/r ([0-9]{1,2})?d([0-9]{1,4})$/;
        //const hassanRollRegex = /^\/rh (((S|s)tr|(D|d)ex|(C|c)on|(I|i)nt|(W|w)is|(C|c)ha)|([0-9]{1,2})?d([0-9]{1,4}))$/;
        const hassanRollRegex = /^\/rh ((S|s)tr|(D|d)ex|(C|c)on|(I|i)nt|(W|w)is|(C|c)ha)$/;
        const helpRegex = /^\/help$/;

        // Check if the GroupMe message has content and if the regex pattern is true
        if (messageText && botRegex.test(messageText)) {
            // Check is successful, return a message!
            return '¯\\_(ツ)_/¯';
        } else if(messageText && (linkRegex.test(messageText) || driveRegex.test(messageText))) {
            return 'https://drive.google.com/drive/folders/12qucpzG4vB2f7l3eJolTmJh7hkesq6n9'
        } else if(messageText && calendarRegex.test(messageText)) {
            return 'https://calendar.google.com/calendar/u/0?cid=Y18zMWdmcWJpcTZ0M2ExaXRvMXJlcGN0M25sNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'
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
        } else if(messageText && hassanQuestionRegex.test(messageText)) {
            return this.hassanQuestion()
        } else if(messageText && hassanRegex.test(messageText)) {
            return this.hassanStatement()
        } else if(messageText && hassanRollRegex.test(messageText)) {
            return this.hassanRoll(messageText)
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

        const userids = ["21561546", "20896823", "22820261", "21300347", "22820263", "21366318", "3411029", "24875384", "19542518", "31510906", "6085493", "23757906", "19805360", "23757907", "25616793", "8209125", "45258464", "7282458"]; // Me, Ben, Brenna
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
