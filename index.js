require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
    const role = member.guild.roles.cache.get('1488839896931242214');
    
    if (!role) return console.log('Role not found');
    
    try {
        await member.roles.add(role);
        console.log(`Role added: ${member.user.tag}`);
    } catch (err) {
        console.error('error while adding role:', err);
    }
});

client.on(Events.InteractionCreate, async interaction => {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      await command.execute(interaction, client);
      return;
    }

    // Button interactions
    if (interaction.isButton()) {
      if (interaction.customId === 'open_register_modal') {
        const {
          ModalBuilder,
          TextInputBuilder,
          TextInputStyle,
          ActionRowBuilder
        } = require('discord.js');

        const modal = new ModalBuilder()
          .setCustomId('register_modal')
          .setTitle('Register');

        const usernameInput = new TextInputBuilder()
          .setCustomId('username')
          .setLabel('Username')
          .setStyle(TextInputStyle.Short)
          .setMinLength(3)
          .setMaxLength(20)
          .setPlaceholder('Enter username')
          .setRequired(true);

        const passwordInput = new TextInputBuilder()
          .setCustomId('password')
          .setLabel('Password')
          .setStyle(TextInputStyle.Short)
          .setMinLength(6)
          .setMaxLength(64)
          .setPlaceholder('Enter password')
          .setRequired(true);

        const inviteCodeInput = new TextInputBuilder()
          .setCustomId('invite_code')
          .setLabel('Invite Code')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Enter invite code')
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(usernameInput),
          new ActionRowBuilder().addComponents(passwordInput),
          new ActionRowBuilder().addComponents(inviteCodeInput)
        );

        await interaction.showModal(modal);
      }

      return;
    }

    // Modal submits
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'register_modal') {
        const registerHandler = require('./handlers/registerHandler');
        await registerHandler(interaction);
      }

      return;
    }
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while processing this interaction.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while processing this interaction.',
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);