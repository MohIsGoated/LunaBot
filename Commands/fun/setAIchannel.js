const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { exists, execute, queryone, queryall, db, serverindb, registerserver} = require('../../utils/db')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setaichannel")
        .setDescription("Sets the ai chatbot channel")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to set it to")
            .setRequired(true)
        ),
    ownerOnly: true,

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const caller = interaction.member
        const serverid = interaction.guild.id
        if (!await serverindb(serverid)) {
            await registerserver(serverid)
        }

        if (config.ownerID !== interaction.member.id) {
            return interaction.reply("Only the bot owner can do this atm")
        }
        await execute(db, "UPDATE serverconfig SET ai_channel_id=? WHERE server_id=?", [channel.id, serverid])
        interaction.reply("Changed the AI bot channel!")
    }
}