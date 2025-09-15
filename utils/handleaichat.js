const {getresponse} = require("./getresponse");
const path = require("path");
const fs = require("fs");
const config = require("../config.json");
module.exports = {
    async handleaichat(message, client, ) {
        if (message.member.user.bot) {
            return
        }
        if (message.mentions.has(client.user)) {
            await message.channel.sendTyping();
            const historydata = await message.channel.messages.fetch({
                limit: 50,
                before: message.id
            })
            const historyarray = historydata.map(item => ({
                author: item.author.username,
                content: item.content
            }))

            const history = JSON.stringify(historyarray);
            let reference
            if (message.reference) {
                reference = await message.channel.messages.fetch(message.reference.messageId)
            }
            const response = await getresponse(message.content, history, client.user.username, message.author.globalName || message.member.displayName, reference) || `An error occurred and the bot did not generate any text, please contact <@${config.ownerId}`
            const responsetext = response.text
            const fixedstring = responsetext.replace(/<@!?(\d+)>|<@&!?(\d+)>|@everyone|@here/g, 'REDACTED');
            if (fixedstring.length > 2000) {
                const filePath = path.join(__dirname, 'message.txt');
                fs.writeFileSync(filePath, fixedstring, 'utf8');

                await message.reply({
                    files: [filePath]
                })
                fs.unlinkSync(filePath);
            } else {
                await message.reply(fixedstring)
            }
        }
    }
}