const Discord = require("discord.js");

module.exports = async (client, guild) => {
    const setting = client.data.setting;
    var Data = client.data._allData;
    client.data.onchange = true;
    const rest = new Discord.REST({ version: '10' }).setToken(setting['discord-bot-token']);
    try {
        const data = await rest.put(
            Discord.Routes.applicationGuildCommands(setting['discord-bot-clientid'], guild.id),
            { body: client.ram.slash },
        );
        if (Data[guild.id] === undefined) {
            Data[guild.id] = {};
        };
        return;
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        return console.error(error);
    };
};