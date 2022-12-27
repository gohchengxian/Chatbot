const Discord = require("discord.js");

module.exports = {
    name: "reset",
    description: "reset AI data",
    ignore: false,
    subcommands: new Discord.SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("reset")
                .setDescription("reset AI data")
        ),
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if(Data === undefined || !Data['ai']) {
            interaction.reply({ content: `Nothing Data in your server sorry`, ephemeral: true });
        } else {
            var permission = interaction.member.permissions;
            if(!permission.has(Discord.PermissionsBitField.Flags.Administrator) || !permission.has(Discord.PermissionsBitField.Flags.ManageGuild)) {
                return interaction.reply({ content: `You don't have access to do this action.\nRequire: Administrator access or ManageGuild access`, ephemeral: true });
            };
            const category = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === Data['ai']['category']);
            if(category) {
                interaction.reply({ content: `Starting delete all AI Data`, ephemeral: true });
                var conversations = Data['ai']['conversations'];
                const lobby = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === Data['ai']['lobby']);
                if(lobby) {
                    lobby.delete();
                };
                conversations.forEach(element => {
                    const channel = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === element['channelid']);
                    if(channel) {channel.delete()}
                });
                category.delete();
                Data['ai'] = {};
            } else {
                Data['ai'] = {};
                interaction.reply({ content: `Success clear all Data`, ephemeral: true });
            }
            client.data.onchange = true;
            client.data._allData[interaction.guildId]['ai'] = {}
        };
        return;
    }
};