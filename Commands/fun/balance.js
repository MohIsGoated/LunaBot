const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription(`Get your or someone else's balance`)
        .addUserOption(option => option
            .setName('user')
            .setDescription(`Who's balance to check`)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user
        const exist = await exists(db, target.id)
        if (!exist) {
            return await interaction.reply({
                content: `Not registered, register with /register.`,
                flags: MessageFlags.Ephemeral
            })
        }
        const userData = await queryone(db, "SELECT balance FROM users WHERE user_id=?", [`${target.id}`])
        await interaction.reply(`<@${target.id}>'s balance is ${Number(userData["balance"])}$`)
    }
}