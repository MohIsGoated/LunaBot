const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const { execute, queryone, queryall, db, exists} = require('../../utils/db')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Use the goodness of people to fuel your addictions!'),
    cooldown: 30,
    async execute (interaction) {
        const exist = await exists(db, interaction.user.id)
        if (!exist) {
            return await interaction.reply({
                content: `You are not registered, register with /register.`,
                flags: MessageFlags.Ephemeral
            })
        }
        const user = await queryone(db, "SELECT * FROM users WHERE user_id=?", [interaction.user.id])
        const balance = Number(user["balance"])
        if (balance > 50000) {
            const chance = Math.random() < 1 / 5;
            if (chance) {
                const amount = Math.round(Math.random() * 5000)
                await interaction.reply({
                    content: `The devil sees you begging while being wealthy, Disgusted he takes ${amount}$ from you.`
                })
                return await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [balance-amount, interaction.user.id])
            } else {
                const amount = Math.round(Math.random() * 3000)
                await interaction.reply({
                    content: `You managed to fool some pure hearted indivitual, they gave you ${amount}$`
                })
                return await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [balance+amount, interaction.user.id])
            }
        } else {
            const amount = Math.round(Math.random() * 3000)
            await interaction.reply({
                content: `Some pure hearted indivitual blessed you with ${amount}$`
            })
            return await execute(db, "UPDATE users SET balance=? WHERE user_id=?", [balance+amount, interaction.user.id])
        }
    }
}