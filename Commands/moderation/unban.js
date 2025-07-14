const {SlashCommandBuilder, EmbedBuilder, resolveColor, MessageFlags} = require('discord.js')
const { IsBanned } = require('../../utils/IsBanned.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a banned member from the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to unban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason for unban.')
            .setMaxLength(480)
        ),
    ownerOnly: true,
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason') ?? "No reason provided."
        const banned = await IsBanned(interaction, user.id)
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
        if (!interaction.member.permissions.has("BanMembers")) {
            return await interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setTitle("ERROR").setDescription("You do not have permissions to run this command")],
                flags: MessageFlags.Ephemeral
            })
        }
        if (!interaction.guild.members.me.permissions.has("BanMembers")) {
            return await interaction.reply({
                embeds: [embed.setTitle('ERROR').setDescription(`I do not have permissions to unban members, are my roles setup correctly?`).setColor(resolveColor("Red"))],
                flags: MessageFlags.Ephemeral
            })
        }
        if (!banned) {
            return await interaction.reply({
                embeds: [embed.setTitle('ERROR').setDescription(`<@${user.id}> is not banned.`).setColor(resolveColor("Red"))],
                flags: MessageFlags.Ephemeral

            })
        } else {
            try {
                await interaction.guild.members.unban(user.id, { reason: `Reason: ${reason}, by <@${interaction.user.id}>` });
                await interaction.reply({
                    embeds: [embed.setTitle('SUCCESS').setDescription(`Successfully unbanned <@${user.id}> (${user.id})`).setColor(resolveColor("Green"))]
                });
            } catch (error) {
                await interaction.reply({
                    embeds: [embed.setTitle('ERROR').setDescription(`Failed to unban user: ${error.message}`).setColor(resolveColor("Red"))],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}