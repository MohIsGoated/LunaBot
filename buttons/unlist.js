const {execute, db} = require("../utils/db");
const { createEmbed, presets } = require('../data/embed');
const {resolveColor, MessageFlags} = require("discord.js");
module.exports = {
    data: {
        name: "delete"
    },
    async execute(interaction) {
        try {
            const embed = presets.success("Success", "Successfully deleted the account listing")
            await execute(db, "DELETE FROM accounts WHERE message_id=?", [interaction.message.id])
            if (!interaction.message) return await interaction.reply(`successfully deleted the account`)
            await interaction.message.delete()
            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
        })
        } catch (e) {
            await interaction.reply({
                content: `an unhandled error occurred`,
                flags: MessageFlags.Ephemeral
        })
            console.log(e, e.stack)
        }
    }
}