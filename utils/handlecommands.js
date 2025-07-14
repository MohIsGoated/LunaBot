const chalk = require("chalk");
const {getaichannels} = require("./db");
const {handlecd} = require("./handlecd");
const {MessageFlags} = require("discord.js");
const {handleerror} = require("./handleerror");
const {setAiIds} = require("./setaiids");
module.exports = {
    async handlecommands(client, interaction, config, cooldowns){
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.log(chalk.bgRedBright(`No interaction ${interaction.commandName} found`));
            return;
        }
        if (interaction.commandName === "setaichannel") {
            const channels = await getaichannels();
            setAiIds(channels.map(item => item.ai_channel_id));
        }
        if (interaction.user.id !== config?.ownerID && await handlecd(cooldowns, command, interaction)) return;

        if (command.ownerOnly && interaction.user.id !== config?.ownerID) {
            return await interaction.reply({
                content: `Only the owner of the bot may use this command!`,
                flags: MessageFlags.Ephemeral
            });
        }
        try {
            await command.execute(interaction);
        } catch (err) {
            await handleerror(interaction, err)
        }
    }
}