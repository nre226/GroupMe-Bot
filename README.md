# GroupMe Personal Bot

## What You Need to Know

This is a quick bot that I got set up for a group chat that I moderate. It can handle linking to appropriate resources, rolling dice, and other
misc quality of life things.

### Commands

* /link will link you to The Island Player Resources
* /r #d# will roll a number of dice between 1 and 99 (first #) and a side count of between 1 and 9999 (second #), support for addition and subtraction my come in the future
* /calendar will link you to the calendar of upcoming DM related island events
* /slots will take in an input in the form of `/slots class level INT` such as `/slots fighter 5 12` and give that character's expected weapon and nonweapon proficiencies.
* /help will link you here... hi. An inline solution for commands will be developed in the future
* /rollCharacter will output stats for a new Island character
* /Hassan will give a random quote from the bartender. Can be used anywhere in the message.
* /Hassan? will give a Yes, No, Maybe response. Can be used anywhere in the message.
* /Hassan! will give you a response when asking for a drink. Can be used anywhere in the message.
* /rh `stat` will have Hassan perform an ability check for the stat specified with `stat`
* /rh #d# will have Hassan perform a standard die roll (see /r)
* /good bot will tell him he is doing a good job
* /shrug will produce the classic `¯\_(ツ)_/¯`
* /nod and /nods will produce `*nods*`

## Changes

There were a few changes that I made to get the bot up and running that are overlooked in the documentation linked below. They are as follows:

* For development purposes [localtunnel.me](localtunnel.me) is deprecated and has been moved to [serverless.social](http://serverless.social) and I was not able to get the localtunnel library to continue working with the code. I was not able to properly test until it was set up in heroku and on a test GroupMe group. Which I also suggest as a workaround.
* On Heroku the BOT_ID will also need to be entered into the settings under the Config Vars section
* On any Heroku issues ensure that you run a `heroku restart`

### Acknowledgements

* If you want to make your own bot you can follow along the tutorial found at [github.com/ACMatUC/groupme-bot-starter](https://github.com/ACMatUC/groupme-bot-starter)
