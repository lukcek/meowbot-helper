console.log("DEPLOY FILE RAN");
const path = require('path');
const fs = require('fs');
const { REST, Routes } = require('discord.js');

require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('ENV PATH:', path.join(__dirname, '.env'));
console.log('TOKEN:', process.env.DISCORD_TOKEN);
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('GUILD_ID:', process.env.GUILD_ID);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.data || !command.execute) {
    console.log(`[ERROR] ${file} is missing "data" or "execute".`);
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Successfully reloaded application commands.');
  } catch (error) {
    console.error(error);
  }
})();