const { SlashCommandBuilder, AttachmentBuilder, Client, GatewayIntentBits, EmbedBuilder, resolveColor} = require('discord.js');
const config = require('../../config.json')

module.exports = {
data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Returns information about this server'),
    async execute(interaction) {
        const SerName = interaction.guild.name;
        const SerIcon = interaction.guild.iconURL({ size: 128});
        const owner = `<@${interaction.guild.ownerId}>`;
        const TChanCount = interaction.guild.channels.cache.filter(c => Number(c.type) === 0).size;
        const VChanCount = interaction.guild.channels.cache.filter(c => Number(c.type) === 2).size;
        const TotalChannels = VChanCount + TChanCount;
        const membercount = await interaction.guild.members.fetch();
        const Humans = membercount.filter(u => !u.user.bot).size;
        const Bots = membercount.filter(u => u.user.bot).size;
        const roles = interaction.guild.roles.cache.filter(r => r.id !== interaction.guild.id)
        const embed = new EmbedBuilder()
            .setColor(resolveColor("Blue"))
            .setTitle(`Server Information of [ ${SerName} ]`)
            .setThumbnail(SerIcon)
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
                })
            .setTimestamp(new Date())
        const fields = [
                { name: 'Owner:', value: owner},
                { name: `Channels: ${TotalChannels}`, value: `Text Channels: ${TChanCount}\nVoice Channels: ${VChanCount}`},
                { name: `Member Count: ${membercount.size}`, value: `Humans: ${Humans}\nBots: ${Bots}`},
                { name: `Roles: ${roles.size}`, value: `Bot Managed: ${roles.filter(b => b.managed).size}`},
                { name: 'Created At:', value: `<t:${Math.floor(interaction.guild.createdTimestamp/1000)}:f>`}
            ]
        if(interaction.guild.description) {

               const descriptionField = {name: 'Server Description:', value: interaction.guild.description}
            fields.splice(1, 0, descriptionField)
        }
        embed.addFields(fields)
        await interaction.reply({embeds: [embed]})
    }
}