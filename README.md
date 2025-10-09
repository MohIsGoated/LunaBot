# LunaBot

LunaBot is a powerful, multipurpose Discord bot designed to enhance your server with a wide range of features, including moderation, chat, economy, utility, and AI chat capabilities.

---

## Features

### 🛡️ Moderation
- Ban Command: Ban members from your server 
- Kick, mute, and other moderation commands for server management
- Invite Lookup: See who invited a user to the server (mod-only)

### 💬 Chat Commands
- Several chat commands to interact with users and the bot
- AI Chat Channels: Intelligent AI chat responses in designated channels. The bot responds to mentions and continues conversations using previous messages as context.

### 🤖 Fun & Community
- Rob Command: Attempt to steal virtual currency from other users.
- Beg Command: Ask for virtual currency (with cooldown).
- QOTD (Question of the Day): Send random questions for community engagement.

### 📊 Economy
- List Command: List accounts/items for sale with price, notes, and channel options.

### ⚙️ Utility
- Server Info: Get detailed info about your server, including owner, channels, member counts, roles, and creation date.

### 🔘 Interactive Buttons
- Supports Discord button interactions for rich message experiences.

### 👣 Invite Tracking
- Tracks which invite was used for new members joining your server and logs inviter info.

---

## Getting Started

### Prerequisites

- Node.js installed
- Discord account and server
- Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohIsGoated/LunaBot.git
   cd LunaBot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure your `.env` and `config.json`:**
   - Add your Discord Bot Token, ClientId (found at https://discord.dev), and your Gemini API key (https://aistudio.google.com/apikey) to `.env`
   - Set up other configs as needed in `config.json` (ownerID, status, etc.)

4. **Run the bot:**
   ```bash
   node Discord\ bot.js
   ```
   or
   ```bash
   npm start
   ```

---

## Folder Structure

- `commands/` – All command files (moderation, fun, economy, utility, community, etc.)
- `utils/` – Utility scripts (database, command handler, AI chat, etc.)
- `data/` – Embeds and presets.
- `handlers/` – Button handler and other event handlers.

---

## Permissions

- Cooldowns are enforced on certain commands to prevent spam.

---

## Contributing

Pull requests and suggestions are welcome! Please review the repository before submitting issues or PRs.

---

## Support

Open an Issue or join the Discord: https://discord.gg/tXPYzwhAMg

---

## License

[MIT](LICENSE)

---

_Made with ❤️ by Moh_
