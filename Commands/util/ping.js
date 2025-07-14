const { SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js');
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`ping`)
        .setDescription(`replies with the bot's latency`),
    async execute(interaction) {
        const ping = Date.now() - interaction.createdTimestamp
        const embed = new EmbedBuilder()
            .setColor(resolveColor("Blue"))
            .setTitle('Ping')
            .setDescription(`The bot's latency is ${ping} ms`)
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
        await interaction.reply({embeds: [embed]})
    }
};