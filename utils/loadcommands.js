const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
module.exports = {
    loadcommands(client, CommandsFolder, folderpath) {
        for (const folder of CommandsFolder) {
            const CommandsPath = path.join(folderpath, folder);
            const CommandFiles = fs.readdirSync(CommandsPath).filter(file => file.endsWith(`.js`));
            for (const file of CommandFiles) {
                const FilePath = path.join(CommandsPath, file);
                const command = require(FilePath);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(chalk.bgRedBright(`The command file at ${FilePath} doesn't have a required 'execute' or 'data' prop.`));
                }
            }
        }
    }
}