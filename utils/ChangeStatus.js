const { ActivityType } = require('discord.js')

async function ChangeStatus(client, text, state = 'online', activity = ActivityType.Custom) {
    await client.user.setPresence({
        activities: [{
            name: text,
            type: activity
        }],
        status: state
    })
}

module.exports = { ChangeStatus }