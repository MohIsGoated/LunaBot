const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { execute, queryone, db, exists } = require('../../utils/db');
const config = require('../../config.json');
const {randomUUID} = require("node:crypto");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addqotd')
        .setDescription('Add a new QOTD (Question of the Day)')
        .addStringOption(option => option
            .setName('question')
            .setDescription('The question to add')
            .setMaxLength(300)
            .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const id = randomUUID()

        if (!await exists(db, interaction.user.id)) {
            return await interaction.reply({
                content: `You are not registered. Please register with /register.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await execute(db, "INSERT INTO qotd (id, question) VALUES (?, ?)", [id, question]);
        await interaction.reply(`QOTD added successfully! ID: ${id}`);
    }
}