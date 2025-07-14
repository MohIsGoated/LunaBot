const {SlashCommandBuilder, EmbedBuilder, resolveColor} = require('discord.js')
const config = require('../../config.json')
const {inguild} = require("../../utils/inguild");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The member to timeout')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('duration')
            .setDescription('How long to timeout the member for (in hours)')
            .setRequired(true)
            .setMaxValue(672)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('What to timeout this member for?')
            .setMaxLength(480)
        ),
    ownerOnly: true,
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setFooter({ text: config.footer, iconURL: config.footerUrl})
        const target = await interaction.options.getUser('user')
        const caller = interaction.member
        const duration = await interaction.options.getNumber('duration')
        const reason = await interaction.options.getString('reason') ?? 'no reason given'
        const ismember = await inguild(interaction, target.id)
        if (target.id === interaction.user.id) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('You cannot timeout your self, silly!')]
            })
        }

        if (!interaction.member.permissions.has("MODERATE_MEMBERS")){
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('You do not have permission to timeout others')]
            })
        }

        if (interaction.guild.ownerId === target.id) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('You cannot moderate the server owner.')]
            })
        }

        if (!ismember) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('This member is not in the guild')]
            })
        }

        const membertarget = await interaction.options.getMember('user')

        if (caller.roles.highest.position <= membertarget.roles.highest.position && interaction.guild.ownerId !== caller.id) {
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('this member has a higher permission hierarchy position than you')]
            })
        }

        try {
            await membertarget.timeout(duration * 60 * 60 * 1000, `${reason} - issued by <@${interaction.user.id}>`)
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Green")).setDescription(`✅ <@${target.id}> has been timed out for ${duration} hour(s). With reason: ${reason}`)]
            })
        } catch (error) {
            console.error(error)
            return interaction.reply({
                embeds: [embed.setColor(resolveColor("Red")).setDescription('Something went wrong, please contact the bot author')]
            })
        }
    }





}