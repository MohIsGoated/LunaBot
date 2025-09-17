const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {execute, db} = require("./db");
const { v4: uuidv4 } = require('uuid');
async function handleSuggestions(message) {
    const suggestion = message.content
    const id = uuidv4()
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("upvote")
            .setLabel("0")
            .setEmoji("👍")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId("preview")
            .setLabel("0")
            .setEmoji("#️⃣")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("downvote")
            .setLabel("0")
            .setEmoji("👎")
            .setStyle(ButtonStyle.Danger)
    )
await message.channel.send({
        content: `suggestion by <@${message.author.id}>: \n${suggestion}\nid: ${id}`,
        components: [row]
    }
)
    .then(async (data) => {
        await execute(db, "INSERT INTO suggestions(serverId, suggestionMessageId, suggestion, suggestionId, suggesterId, upvotes, downvotes) VALUES (?, ?, ?, ?, ?, ?, ?)" ,[message.guild.id , data.id, message.content, id, message.member.id, 0, 0])
        await data.startThread({
            name: "suggestion discussion"
        })
    })
}

module.exports = { handleSuggestions }