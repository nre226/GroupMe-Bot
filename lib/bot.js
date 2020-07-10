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
        let statement = ['Everyone settle down.', "I'll have no part in this.", 'Shut up and have some soup.', "Don't go dragging me into this!", 'Ask Edgar, I do not care.', 'I think you need to lay off the drinks, my friend. Have some soup.', 'Sure, whatever you say.', 'HARHAR not a chance!', 'Go ahead, see what happens. HA!', 'Are you going to cry about it?', 'That’s it, I’m cutting you off! No more drinks for you!', 'Who let you back in here?', 'Why don’t you put it to the toss of a coin?', 'I was thinking of redecorating anyways…', 'HARHARHARH *big mitten hand pat on back*', 'Ha! Sure', "You know, you don't have to go back out there again.", 'You people worry me! *shakes head*', 'Wrenly, bring some more bowls of soup out!', 'WHAT DO YOU THINK YOU ARE DOING?', 'Take it outside, I don’t want you scuffing my floors.', '*points at newcomer* SHUT THE DOOR!', 'Did I ever tell you how I got this scar?', 'Read the sign. Freaks welcome.', "*claps along with the bards' music, without a care in the world*", "Tell Finn you can deal with this matter in his room. He won't mind.", 'I bet that alchemist in town, Asher, can fix that scar of yours, friend.', "Did somebody say DANCING? *drops it like it's hot*", "I had a friend who was in this very same situation once… It didn't end well.", 'Check the wanted board, friend. I think I saw something you might be interested in.', 'You should try the soup! I found a new ingredient under the docks this morning.', 'Good boy, Doggie.', 'I don’t adventure anymore. And for good reason.', 'Don’t touch the Stone.', 'Don’t look at the Stone.', 'The last idiot who touched the stone died a horrible death. Don’t imitate idiots.', 'You pay your tab yet?', 'Consult Wrenly. She knows more about it than I do.', 'No.', 'Yes.', 'I don’t know.', 'Maybe.', 'I would put it on Scamelli’s tab but...', '...Why?', 'Shut up I can barely hear the music!', 'You remind me of Thar', 'And you call yourselves adventurers…', "If my counting's right you've had [random number between 1&20] drinks tonight.", '*Hassan stares at you intently*', 'Gods I was strong then!', 'Oh for the love of the gods.', "I don't care, just do it outside!", 'I like you, but watch yourself.', 'Try and think it out. Don’t do anything rash.', 'Hey, NO FIGHTING INDOORS!', 'EDGAR! SHUT THEM UP!', 'One more screw up and I’ll have Edgar throw you out. Got it?', 'Why don’t you settle down, find yourself a job here? Don’t go to the Island.', 'You are a strange one.', 'I wouldn’t if I were you, friend.', 'I think you should leave.', 'Maybe be more careful next time.', 'You should ask Father Sinan about this', 'I’m sorry about your friend. But that’s what happens when you go to that… place.', 'I can handle it myself.', 'Are you sure about that?', '*rolls eyes* I’m sure.']
        let it = Math.floor(Math.random() * statement.length);

        return statement[it]
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

    static mentionAll() {
        return;
    }

    static checkMention(message) {
        const messageText = message.text;

        const allRegex = /^\@all$/;

        if(messageText && allRegex.test(messageText)) {
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
        const messageText = message.text;

        // Place to put the regular expressions to be used
        const botRegex = /^\/shrug$/;
        const rollCharacterRegex = /^\/rollCharacter$/;
        const goodRegex = /^\/good bot$/;
        const hassanRegex = /\/(H|h)assan/;
        const hassanQuestionRegex = /\/(H|h)assan\?/
        const linkRegex = /^\/link$/;
        const rollRegex = /^\/r ([0-9]{1,2})?d([0-9]{1,4})$/;
        const helpRegex = /^\/help$/;
        const allRegex = /^\@all$/;

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
        } else if(messageText && allRegex.test(messageText)) {
            return this.mentionAll()
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
        console.log('getting group id')
        // Get the GroupMe bot id saved in `.env`
        const accessToken = process.env.ACCESS_TOKEN;

        var options = {
            host: 'www.reddit.com',
            port: 443,
            path: '/r/TellMeAFact/top/.json?count=1',
            method: 'GET'
        };

        callbackFn("111 This will work and I am just doing it to make me feel a little better...");
        
        var req = https.request(options, function(res) {
            callbackFn(res.statusCode.toString());
            // res.on("data", function(d) {
            //     callbackFn(d.toString());
            // });
        });

        callbackFn("This will work and I am just doing it to make me feel a little better...");
        
        req.on('error', function(e) {
            callbackFn('problem with request: ' + e.message);
        });
        
        req.end();
        callbackFn('Past the end...');





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
        
        let groupData = null;

        this.getGroupId((res) => {
            groupData = res;

            const userids = ["21561546", "20896823"];
            let lociList = []
    
            for (let id of userids) {
                lociList.push([6,9])
            }
    
            const options = {
                hostname: 'api.groupme.com',
                path: '/v3/bots/post',
                method: 'POST'
            };
    
            if(groupData) {
                const body = {
                    bot_id: botId,
                    text: groupData
                }
            } else {
                const body = {
                    bot_id: botId,
                    text: "dynamic data is not being populated"
                }
            }
    
            // const body = {
            //     bot_id: botId,
            //     text: messageText,
            //     attachments: [
            //         {
            //             "type":"mentions",
            //             "user_ids":userids,
            //             "loci":lociList
            //         }
            //     ]
            // };
    
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
        })

        // const userids = ["21561546", "20896823"];
        // let lociList = []

        // for (let id of userids) {
        //     lociList.push([6,9])
        // }

        // const options = {
        //     hostname: 'api.groupme.com',
        //     path: '/v3/bots/post',
        //     method: 'POST'
        // };

        // if(groupData) {
        //     const body = {
        //         bot_id: botId,
        //         text: groupData
        //     }
        // } else {
        //     const body = {
        //         bot_id: botId,
        //         text: "dynamic data is not being populated"
        //     }
        // }

        // // const body = {
        // //     bot_id: botId,
        // //     text: messageText,
        // //     attachments: [
        // //         {
        // //             "type":"mentions",
        // //             "user_ids":userids,
        // //             "loci":lociList
        // //         }
        // //     ]
        // // };

        // // Make the POST request to GroupMe with the http module
        // const botRequest = https.request(options, function(response) {
        //     if (response.statusCode !== 202) {
        //         console.log('Rejecting bad status code ' + response.statusCode);
        //     }
        // });

        // // On error
        // botRequest.on('error', function(error) {
        //     console.log('Error posting message ' + JSON.stringify(error));
        // });

        // // On timeout
        // botRequest.on('timeout', function(error) {
        //     console.log('Timeout posting message ' + JSON.stringify(error));
        // });

        // // Finally, send the body to GroupMe as a string
        // botRequest.end(JSON.stringify(body));
    };
};

module.exports = Bot;
