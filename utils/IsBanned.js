module.exports = {
    async IsBanned(interaction, userId) {
        try {
            const bans = await interaction.guild.bans.fetch();
            return bans.has(userId);
        } catch (err) {
            console.error('Error checking ban status:', err);
            return false;
        }
    }
};
