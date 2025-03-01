# Discord Role Management Bot

A Discord bot that creates a panel with a button to assign specific roles to authorized users.

## Getting Discord IDs

To configure the bot, you'll need several Discord IDs. Here's how to get them:

1. **Enable Developer Mode in Discord**:
   - Open Discord Settings
   - Go to "App Settings" > "Advanced"
   - Enable "Developer Mode"

2. **Get User ID**:
   - Right-click on your username
   - Select "Copy User ID"
   - Use this ID in the `allowedUsers` array

3. **Get Server (Guild) ID**:
   - Right-click on your server name
   - Select "Copy Server ID"
   - Use this as the `guildId`

4. **Get Role ID**:
   - Go to Server Settings > Roles
   - Right-click on the role you want to manage
   - Select "Copy Role ID"
   - Use this as the `roleId`

## Setup

### Sharing the Code

When sharing the code with others:

1. **DO NOT include**:
   - `node_modules/` directory (this will be created by npm install)
   - `config.json` (they need their own configuration)
   - Any log files or system-specific files

2. **DO include**:
   - All source code files (index.js)
   - package.json and package-lock.json
   - discord-bot.service
   - README.md
   - .gitignore

They will run `npm install` to download all required dependencies based on package.json.

### Required Configuration

Before sharing the code with someone else, they need to:

1. Create their own Discord Application and Bot at https://discord.com/developers/applications
2. Get your bot token from the "Bot" section
3. Enable the following Privileged Gateway Intents in the Bot section:
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT
4. Invite the bot to your server using the OAuth2 URL Generator:
   - Select "bot" scope
   - Required permissions: Manage Roles, Send Messages, Use Embedded Messages
5. Edit `config.json`:
   - Replace `YOUR_BOT_TOKEN_HERE` with your bot token
   - Add authorized user IDs to `allowedUsers` array
   - Set `roleId` to the ID of the role you want to manage
   - Set `guildId` to your server ID

## Usage

1. Install dependencies:
```bash
npm install
```

2. Update the configuration files:

   a. In `config.json`:
   ```json
   {
       "token": "YOUR_BOT_TOKEN_HERE",        // Replace with their bot token
       "allowedUsers": ["USER_ID_1"],         // Replace with their Discord user IDs
       "roleId": "ROLE_ID_HERE",             // Replace with their server role ID
       "guildId": "SERVER_ID_HERE"           // Replace with their server ID
   }
   ```

   b. In `discord-bot.service`:
   ```ini
   User=YOUR_USERNAME                        # Replace with their system username
   WorkingDirectory=/path/to/bot/directory   # Replace with their bot directory path
   ```

3. Set up the bot as a system service:
```bash
# Copy the service file to systemd directory
sudo cp discord-bot.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable discord-bot

# Start the service
sudo systemctl start discord-bot

# Check status
sudo systemctl status discord-bot
```

3. The bot will now run automatically and restart if it crashes. You can manage it with these commands:
```bash
sudo systemctl stop discord-bot    # Stop the bot
sudo systemctl start discord-bot   # Start the bot
sudo systemctl restart discord-bot # Restart the bot
sudo systemctl status discord-bot  # Check bot status
```

4. In Discord, authorized users can type `!createrolepanel` to create a role assignment panel.

## Features

- Creates an interactive panel with a button
- Only authorized users can create panels
- Only authorized users can get/remove roles
- Secure role management with error handling
- Ephemeral responses (only visible to the user who clicked)
- Runs continuously as a system service:
  - Auto-starts on system boot
  - Auto-restarts if the bot crashes
  - Runs in the background with system service management
  - Easy monitoring and control through systemd commands

## Security

- Bot token and user IDs are stored in config.json
- Role assignment is restricted to authorized users
- All interactions use ephemeral messages for privacy
- Runs as a dedicated system service with proper permissions

## Service Management

The bot runs as a systemd service for reliable 24/7 operation. Here are the main commands for managing the bot:

```bash
# View real-time bot logs
sudo journalctl -u discord-bot -f

# Check bot status
sudo systemctl status discord-bot

# Start/Stop/Restart commands
sudo systemctl start discord-bot   # Start the bot
sudo systemctl stop discord-bot    # Stop the bot
sudo systemctl restart discord-bot # Restart the bot

# Service configuration
sudo systemctl enable discord-bot  # Enable auto-start on boot
sudo systemctl disable discord-bot # Disable auto-start on boot
```

The service is configured to:
- Start automatically when your system boots
- Restart automatically if the bot crashes
- Run with proper system permissions
- Provide detailed logging through systemd
