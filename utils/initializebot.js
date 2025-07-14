const {getaichannels, initDb} = require("./db");
const {fixConfig} = require("./fixconfig");
const fs = require("fs");
const path = require("path")
const chalk = require("chalk");
const {setAiIds} = require("./setaiids");
module.exports = {
    async init( client, configpath) {
        const channels = await getaichannels()
        setAiIds(channels.map(item => item.ai_channel_id))
        await fixConfig();
        await initDb();
        const config = JSON.parse(fs.readFileSync(path.resolve(configpath)));
        if (!config.ownerID) {
            console.warn(chalk.bgYellow.black('[WARN] config.ownerID is not defined! Owner-only commands will block all users.'));
        }
        await client.login(process.env.DISCORD_TOKEN)
    }
}