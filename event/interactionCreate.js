const Discord = require("discord.js");

module.exports = (client, interaction) => {
    //Get commands file and run it
    if(interaction.isStringSelectMenu()) {
        const file = client.ram.menu_file[interaction.customId];
        return require(`../menu/${file}`).run(client, interaction);
    }
    if (interaction.isButton()) {
        const file = client.ram.button_file[interaction.customId];
        return require(`../button/${file}`).run(client, interaction);
    };

    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName) {
        if (interaction.options._subcommand) {
            return require(`../commands/${client.ram.commands_file[interaction.commandName]['index']}/subcommands/${client.ram.commands_file[interaction.commandName]['subcommands'][interaction.options._subcommand]}`).run(client, interaction);
        } else {
            return require(`../commands/${client.ram.commands_file[interaction.commandName]['index']}/index`).run(client, interaction)
        }
    };
};