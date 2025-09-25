const {PermissionsBitField} = require("discord.js");
const {chatBan} = require("../chatcommands/ban");

module.exports = {
    async handleChatCommands(message, client) {
        if (!message.content.startsWith("?")) {
            return
        }

        if (message.content.toLowerCase().startsWith("?ban")) {
            await chatBan(message, client)
        }
    }
}