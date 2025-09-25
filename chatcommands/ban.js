const {PermissionsBitField, resolveColor, MessageFlags, EmbedBuilder} = require("discord.js");
const {IsBanned} = require("../utils/IsBanned");
const config = require("../config.json");
module.exports = {
    async chatBan(message, client) {
        const embed = new EmbedBuilder()
            .setFooter({
                text: config.footer,
                iconURL: config.footerUrl
            })
            .setTimestamp(new Date())

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("You do not have permissions to use this command")
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("I do not have permissions to use ban members")
        }


        const command = message.content.split(" ")

        if (command.length === 1) {
            return message.reply("please provide a user to ban as such:\n?ban (user) (reason)")
        }

        const target = command[1].replace(/[<@>]/g, "")
        if (/\D/.test(target)) {
            return message.reply("please only either ping someone to ban or use their ID")
        }


        const reason = command.slice(2).join(" ") || "no reason provided"

        let toBan

        try {
            toBan = await message.guild.members.fetch(target)
        } catch (e) {}

        let toBanUser
        try {
            toBanUser = await client.users.fetch(target)
        } catch (e) {
            return message.reply({
                embeds: [embed.setColor(resolveColor("Red")).setTitle('ERROR').setDescription(`Invalid user ID`)],
                flags: MessageFlags.Ephemeral
            })
        }
        if (await IsBanned(message, toBanUser.id)) {
            return message.reply({
                embeds: [embed.setColor(resolveColor("Red")).setTitle('ERROR').setDescription(`<@${toBanUser.id}> is already banned`)],
                flags: MessageFlags.Ephemeral
            })
        }


        if (toBan) {


            if (message.member.id === toBan.id) {

                return message.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setTitle('ERROR').setDescription('You cannot ban your self, silly!')],
                    flags: MessageFlags.Ephemeral
                })
            }

            if (toBan.id === message.client.user.id) {

                return message.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setTitle('ERROR').setDescription('I refuse to ban my self')],
                    flags: MessageFlags.Ephemeral
                })
            }

            if (!toBan.bannable) {
                return message.reply("I do not have permissions to ban this member")
            }



            const bannerRolePosition = message.member.roles.highest.position;

            const toBanRolePosition = toBan.roles.highest.position

            if (toBanRolePosition >= bannerRolePosition && toBan.id !== message.guild.ownerId) {
                return message.reply("You do not have permissions to ban this member")
            }

            try {
                await toBan.ban({
                    deleteMessageSeconds: 7 * 24 * 60 * 60,
                    reason: `banned by ${message.author.id} - reason: ${reason}`
                })
                await message.reply(`successfully banned user <@${toBan.id}>`)
            } catch (e) {
                message.reply("an unhandled error occurred")
                console.log(e)
            }
        } else {
            try {

                await message.guild.members.ban(toBanUser.id, {
                    deleteMessageSeconds: 7 * 24 * 60 * 60,
                    reason: `${reason} - by <@${message.member.id}>`
                });

                await message.reply({
                    embeds: [embed.setColor(resolveColor("Green")).setTitle("SUCCESS").setDescription(`Banned user <@${toBanUser.id}> (${toBanUser.id})`)]
                });
            } catch (error) {
                console.log(error, error.stack)
                await message.reply({
                    embeds: [embed.setColor(resolveColor("Red")).setTitle("ERROR").setDescription(`Couldn't to ban user: ${error.message}`)],
                    flags: MessageFlags.Ephemeral
                });
            }

        }
    }
}