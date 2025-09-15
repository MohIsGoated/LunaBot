    const { Client, Events, GatewayIntentBits, Collection, MessageFlags } = require('discord.js');
    const fs = require('fs');
    const loadButtonHandler = require('./handlers/buttonhandler');
    const path = require('path');
    require('dotenv').config({ path: ".env" });
    const chalk = require("chalk");
    const { ChangeStatus } = require('./utils/ChangeStatus')
    const cron = require('node-cron');
    const {init} = require("./utils/initializebot");
    const {handleaichat} = require("./utils/handleaichat");
    const {loadcommands} = require("./utils/loadcommands");
    const {handlecommands} = require("./utils/handlecommands");
    const {getAiIds} = require("./utils/setaiids");
    const {deploy} = require("./Deploy");
    const {execute, db, queryone} = require("./utils/db");
    const cooldowns = new Map();
    const folderpath = path.join(__dirname, 'Commands');
    const CommandsFolder = fs.readdirSync(folderpath);
    const fpath = path.join(__dirname, "/config.json")
    const invites = new Map();
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
    let config = JSON.parse(fs.readFileSync(fpath).toString())
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

    client.on(Events.ClientReady, async () => {
        for (const [guildId, guild] of client.guilds.cache) {
            const firstinvites = await guild.invites.fetch()
            invites.set(
                guildId,
                new Map(firstinvites.map((invite) => [invite.code, invite.uses]))
            )
        }
    })

    client.on(Events.GuildMemberAdd, async (member) => {
        const cachedInvites = invites.get(member.guild.id)
        const newInvites = await member.guild.invites.fetch()

        const inviteUsed = newInvites.find(
            (invite) => cachedInvites.get(invite.code) < invite.uses
        )
        if (inviteUsed) {
            console.log(`${member.user.username} was invited using code ${inviteUsed.code} by ${inviteUsed.inviter.tag}`)
            const InviteExists = await queryone(db, "SELECT * FROM invites WHERE invitedId=? AND serverId=?", [member.user.id, member.guild.id])
            if (!InviteExists) {
                await execute(db, "INSERT INTO invites(invitedId, inviterId, inviteCode, serverId) VALUES(?, ?, ?, ?)", [member.user.id, inviteUsed.inviter.id, inviteUsed.code, member.guild.id])
            } else {
                await execute(db, "UPDATE invites SET inviterId=?, inviteCode=? WHERE invitedId =? AND serverId=?", [inviteUsed.inviter.id, inviteUsed.code, member.user.id, member.guild.id])
            }
        }
        invites.set(
            member.guild.id,
            new Map(newInvites.map((invite) => [invite.code, invite.uses]))
        )
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
            await handlecommands(client, interaction, config, cooldowns)
        }
    });

    init(client, "./config.json")
    .then(async () => {
        console.log("initialized successfully")
        cron.schedule("0 9 * * *", async () => {

        })
    }).catch(error => {
        console.error(chalk.red(`[ERROR] A FATAL ERROR OCCURRED, ${error.stack}`))
})
