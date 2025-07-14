const { ActivityType, EmbedBuilder, SlashCommandBuilder, resolveColor} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const {ChangeStatus} = require("../../utils/ChangeStatus");
const fs = require("node:fs");
const path = require("path")
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription(`Set the bot's status`)
        .addStringOption(option => option
            .setName('text')
            .setDescription(`what to set it to`)
            .setMaxLength(128)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('state')
            .setDescription('The online state of the bot')
            .addChoices(
                {name: 'Online', value: 'online'},
                {name: 'Do Not Disturb', value: 'dnd'},
                {name: 'Idle', value: 'idle'},
                {name: 'Invisible', value: 'invisible'}
            )
        ),
    ownerOnly: true,
    async execute(interaction) {
        const configpath = path.join(__dirname, "../../config.json")
        let config = JSON.parse(await fs.promises.readFile(configpath), 'utf8')
        const embed = new EmbedBuilder()
            .setFooter({ text: config.footer, iconURL: config.footerUrl })
            .setTimestamp()
        const input = interaction.options.getString('text')
        const state = interaction.options.getString('state')
        config.status = input
        config.appearance = state ?? config.appearance
        await fs.promises.writeFile(configpath, JSON.stringify(config, null, 2), 'utf8')
        try {
            await ChangeStatus(interaction.client, input, state)
            await interaction.reply({
                embeds: [embed.setColor(resolveColor("Green")).setDescription(`Succesfully changed the bot's status!`)]
            })
        } catch (e) {
            console.log(e)
            await interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('An unexpected error occured, please contact the bot author.')]
            })
        }
    }
}