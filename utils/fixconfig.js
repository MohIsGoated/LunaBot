const fs = require('fs')
const path = require('path')

async function fixConfig() {
    const filepath = path.join(__dirname, "../config.json")
    let config = JSON.parse(await fs.promises.readFile(filepath))
    config.footer = config.footer || "Made with luv ❤️"
    config.footerUrl = config.footerUrl || "https://cdn.discordapp.com/avatars/1086622488374550649/b5f116a341bec999ce98422c43d83b3e.webp"
    fs.writeFileSync(filepath, JSON.stringify(config, null, 2), 'utf8')
}

module.exports = { fixConfig }