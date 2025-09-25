const { EmbedBuilder, SlashCommandBuilder, resolveColor, MessageFlags} = require('discord.js')
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from this guild')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Reason to kick this user')
            .setMaxLength(480)
        ),
    async execute(interaction) {
        const member = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason') ?? 'No reason provided'
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())
        if (!interaction.member.permissions.has('KickMembers')) {
            return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('You do not have permissions to kick members')]})
        }

        if (!interaction.guild.members.me.permissions.has('KickMembers')) {
            return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('I do not have permissions to kick members')]})
        }

        if (member) {

            if (interaction.user.id === member.id) {
                return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('You cannot kick your self, silly!')]})
            }

            if (member.id === interaction.client.user.id) {
                return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('I refuse to kick my self, Deal with it.')]})
            }

            if (interaction.member.roles.highest.position <= member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
                return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('You do not have permissions to kick this specific member')]})
            }

            if (!member.kickable) {
                return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('I do not have permissions to kick this member (Possibly higher role?)')]})
            } else {
                try {
                    await interaction.guild.members.kick(member.id, `${reason} - By ${interaction.member.id}`)
                    return await interaction.reply({embeds: [embed.setColor(resolveColor('Green')).setTitle('SUCCESS').setDescription(`Successfully kicked member <@${member.id}>`)]})
                } catch (e) {
                    return await interaction.reply({
                        embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription(`An unexpected error occured, ${e.message}`)],
                        flags: MessageFlags.Ephemeral
                    })
                }
            }
        } else {
            return await interaction.reply({embeds: [embed.setColor(resolveColor('Red')).setTitle('ERROR').setDescription('This user is not in the guild')]})
        }
    }
}