import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(readFileSync('./config.json', 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    // Only respond to command from allowed users
    if (!config.allowedUsers.includes(message.author.id)) return;
    
    if (message.content === '!createrolepanel') {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Role Assignment Panel')
            .setDescription('Click the button below to get your role!')
            .setTimestamp();

        const button = new ButtonBuilder()
            .setCustomId('give_role')
            .setLabel('Get Role')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'give_role') {
        // Check if user is allowed
        if (!config.allowedUsers.includes(interaction.user.id)) {
            await interaction.reply({
                content: 'You are not authorized to get this role.',
                ephemeral: true
            });
            return;
        }

        try {
            const role = await interaction.guild.roles.fetch(config.roleId);
            const member = interaction.member;

            if (member.roles.cache.has(config.roleId)) {
                await member.roles.remove(role);
                await interaction.reply({
                    content: `Removed role: ${role.name}`,
                    ephemeral: true
                });
            } else {
                await member.roles.add(role);
                await interaction.reply({
                    content: `Added role: ${role.name}`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error managing role:', error);
            await interaction.reply({
                content: 'There was an error managing your role. Please contact an administrator.',
                ephemeral: true
            });
        }
    }
});

client.login(config.token);
