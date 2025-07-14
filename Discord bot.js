    const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
    const fs = require('fs');
    const loadButtonHandler = require('./handlers/ButtonHandler');
    const path = require('path');
    require('dotenv').config({ path: ".env" });
    const chalk = require("chalk");
    const { ChangeStatus } = require('./utils/ChangeStatus')
    const {init} = require("./utils/initializebot");
    const {handleaichat} = require("./utils/handleaichat");
    const {loadcommands} = require("./utils/loadcommands");
    const {handlecommands} = require("./utils/handlecommands");
    const {getAiIds} = require("./utils/setaiids");
    const {deploy} = require("./Deploy");
    const cooldowns = new Map();
    const folderpath = path.join(__dirname, 'Commands');
    const CommandsFolder = fs.readdirSync(folderpath);
    const fpath = path.join(__dirname, "/config.json")
    const client = new Client({ intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });
    client.commands = new Collection();
    client.buttons = new Collection();
    loadButtonHandler(client)
    let config = JSON.parse(fs.readFileSync(fpath))
    loadcommands(client, CommandsFolder, folderpath)

    deploy()

    client.on("messageCreate", async (message) => {
        if (getAiIds().includes(message.channel.id)) {
            await handleaichat(message, client);
        }
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);
        if (!button)
            return await interaction.reply("no handler for this button");
        try {
            await button.execute(interaction)
        } catch (e) {
            console.log(e + e.stack)
            await interaction.reply("an unhandled error occurred")
        }
    })

    client.once(Events.ClientReady, async () => {
        console.log(`Logged in as ${client.user.tag}`);
        if (config.status) {
            await ChangeStatus(client, config.status, config.appearance)
        }
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
            await handlecommands(client, interaction, config, cooldowns)
        }
    });

    init(client, "./config.json")
    .then(() => {
        console.log("initialized successfully")
    }).catch(error => {
        console.error(chalk.red(`[ERROR] A FATAL ERROR OCCURRED, ${error.stack}`))
})
