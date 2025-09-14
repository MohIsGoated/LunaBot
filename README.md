# LunaBot

LunaBot is a powerful, multipurpose Discord bot designed to enhance your server with a wide range of features, including moderation, fun, economy, utility, and AI chat capabilities.

---

## Features

### 🛡️ Moderation
- **Ban Command:** Ban members from your server (owner-only).
- **Inviter Lookup:** See who invited a user to the server (mod-only).

### 🎉 Fun & Community
- **Rob Command:** Attempt to steal virtual currency from other users.
- **Beg Command:** Ask for virtual currency (with cooldown).
- **QOTD (Question of the Day):** Send random questions for community engagement.

### 💰 Economy
- **List Command:** List accounts/items for sale with price, notes, and channel options.

### 🔧 Utility
- **Server Info:** Get detailed information about your server, including owner, channels, member counts, roles, and creation date.

### 🤖 AI Chat
- **AI Chat Channels:** Intelligent AI chat responses in designated channels. The bot can respond to mentions and continue conversations using context from previous messages.

### 🖱️ Interactive Buttons
- Supports Discord button interactions for rich message experiences.

### 📈 Invite Tracking
- Tracks which invite was used for new members joining your server and logs inviter info.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohIsGoated/LunaBot.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure your `.env` and `config.json`:**
    - Add your Discord Bot Token, ClientId (both found at https://discord.dev] and Your gemini API key (https://aistudio.google.com/apikey) to `.env` 
    - Set up other configs as needed in `config.json` (ownerID, status, etc.)

4. **Run the bot:**
   ```bash
   node Discord\ bot.js
   ```

---

## Folder Structure

- **Commands/**: All command files (moderation, fun, economy, utility, community, etc.)
- **utils/**: Utility scripts (database, command handler, AI chat, etc.)
- **data/**: Embeds and presets.
- **handlers/**: Button handler and other event handlers.

---

## Permissions

- Some commands are restricted to the bot owner or moderators (Kick Members permission).
- Cooldowns are enforced on certain commands to prevent spam.

---

## Contributing

Pull requests and suggestions are welcome! Please review the repository before submitting issues or PRs.

---

## Support

Either open an Issue or join the discord https://discord.gg/UzTRJ5KQhs 

---

## Note*

* Some commands currently are locked to owner only as I didn't have the time to correctly setup permissions
* I'll fix the permissions and remove the owner only lock from them at a later date

## License

[MIT](LICENSE)

---

*Made with ❤️ by Moh*