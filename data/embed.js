const { EmbedBuilder } = require('discord.js');

/**
 * Creates a customizable embed with preset styling
 * @param {Object} options - Configuration options for the embed
 * @param {string} options.title - Embed title
 * @param {string} options.description - Embed description
 * @param {string} [options.color] - Hex color (default: #5865F2)
 * @param {string} [options.thumbnail] - Thumbnail URL
 * @param {string} [options.image] - Image URL
 * @param {Array} [options.fields] - Array of field objects {name, value, inline}
 * @param {Object} [options.footer] - Footer object {text, iconURL}
 * @param {Object} [options.author] - Author object {name, iconURL, url}
 * @param {string} [options.timestamp] - Timestamp (true for current time)
 * @param {string} [options.url] - URL to make title clickable
 * @returns {EmbedBuilder} Configured embed builder
 */
function createEmbed(options = {}) {
    const embed = new EmbedBuilder();

    // Set basic properties
    if (options.title) embed.setTitle(String(options.title));
    if (options.description) embed.setDescription(String(options.description));
    if (options.url) embed.setURL(options.url);

    // Set color (default Discord blurple)
    embed.setColor(options.color || '#5865F2');

    // Set images
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);

    // Add fields
    if (options.fields && Array.isArray(options.fields)) {
        options.fields.forEach(field => {
            // Validate field has required properties
            if (field && field.name && field.value) {
                embed.addFields({
                    name: String(field.name),
                    value: String(field.value),
                    inline: field.inline || false
                });
            }
        });
    }

    // Set footer
    if (options.footer && options.footer.text) {
        embed.setFooter({
            text: String(options.footer.text),
            iconURL: options.footer.iconURL
        });
    }

    // Set author
    if (options.author && options.author.name) {
        embed.setAuthor({
            name: String(options.author.name),
            iconURL: options.author.iconURL,
            url: options.author.url
        });
    }

    // Set timestamp
    if (options.timestamp === true) {
        embed.setTimestamp();
    } else if (options.timestamp) {
        embed.setTimestamp(options.timestamp);
    }

    return embed;
}

// Preset configurations for common use cases
const presets = {
    success: (title, description) => createEmbed({
        title,
        description,
        color: '#00FF00',
        footer: { text: '✅ Success' },
        timestamp: true
    }),

    error: (title, description) => createEmbed({
        title,
        description,
        color: '#FF0000',
        footer: { text: '❌ Error' },
        timestamp: true
    }),

    warning: (title, description) => createEmbed({
        title,
        description,
        color: '#FFAA00',
        footer: { text: '⚠️ Warning' },
        timestamp: true
    }),

    info: (title, description) => createEmbed({
        title,
        description,
        color: '#00AAFF',
        footer: { text: 'ℹ️ Info' },
        timestamp: true
    }),

    loading: (title = 'Loading...', description = 'Please wait...') => createEmbed({
        title,
        description,
        color: '#FFFF00',
        footer: { text: '⏳ Loading' },
        timestamp: true
    })
};

module.exports = {
    createEmbed,
    presets
};