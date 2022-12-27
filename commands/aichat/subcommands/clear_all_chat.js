const Discord = require("discord.js");

module.exports = {
    name: "clear_all_chat",
    description: "Clear all conversations",
    ignore: false,
    subcommands: new Discord.SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear_all_chat')
                .setDescription("Clear all conversations")
        ),
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if(!Data || !Data['ai'] || Data['ai'] === {}) {
            if(!Data) {
                client.data._allData[interaction.guildId] = {};
            };
            client.data.onchange = true;
            client.data._allData[interaction.guildId]['ai'] = {};
            interaction.reply({ content: `Haven't active AI chat now`, ephemeral: true });
        } else {
            var permission = interaction.member.permissions;
            if(!permission.has(Discord.PermissionsBitField.Flags.Administrator) || !permission.has(Discord.PermissionsBitField.Flags.ManageGuild)) {
                return interaction.reply({ content: `You don't have access to do this action.\nRequire: Administrator access or ManageGuild access`, ephemeral: true });
            };
            var conversations = Data['ai']['conversations'];
            if(conversations.length === 0) {
                interaction.reply({ content: `Not have any conversation now`, ephemeral: true });
            } else {
                interaction.reply({ content: `Delete all conversation now`, ephemeral: true });
                conversations.forEach(element => {
                    const channel = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === element['channelid']);
                    if(channel) {channel.delete()}
                });
                Data['ai']['conversations'] = [];
                Data['ai']['conversations_num'] = 0;
                client.data._allData[interaction.guildId]['ai'] = Data['ai'];
                client.data.onchange = true;
            }
        };
        return;
    }
}