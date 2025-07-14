const fs = require("fs")
const path = require("path")

function loadButtonHandlers(client){
    const buttonFiles = fs.readdirSync(path.join(__dirname, "../buttons")).filter(file => file.endsWith(".js"))
    for (const file of buttonFiles) {
        const button = require(`../buttons/${file}`)
        client.buttons.set(button.data.name, button);
    }
}

module.exports = loadButtonHandlers;