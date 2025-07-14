module.exports = {
    async inguild(interaction, id) {
        try {
            const members = await interaction.guild.members.fetch()
            return members.has(id);
        } catch (e) {
            console.error('Error checking member status:', err);
            return false;
        }
    }
}