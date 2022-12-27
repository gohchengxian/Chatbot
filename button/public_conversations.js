const Discord = require("discord.js");

module.exports = {
    customId: "public_conversations",
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if (!Data || !Data['ai']) {
            interaction.reply({ content: `Unknown error\nError code: 5`, ephemeral: true });
        } else {
            const channel = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === interaction.channelId);
            if (channel) {
                var conversation = Data['ai']['conversations'];
                conversation = conversation.filter(owo => owo.channelid === interaction.channelId)[0];
                if (conversation) {
                    if (interaction.user.id !== conversation['author']) {
                        return interaction.reply({ content: `Sorry, you are not this conversation owner`, ephemeral: true });
                    };
                    conversation['public'] = true;
                    channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.roles.everyone.id,
                            allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                                Discord.PermissionsBitField.Flags.SendMessages
                            ],
                        },
                        {
                            id: conversation.author,
                            allow: [Discord.PermissionsBitField.Flags.ViewChannel],
                        },
                    ]);
                    interaction.reply({ content: `Success change channel to public`, ephemeral: true });
                    Data['ai']['conversations'].filter(owo => owo.channelid === interaction.channelId)[0] = conversation;
                    client.data._allData[interaction.guildId]['ai']['conversations'] = Data['ai']['conversations'];
                    client.data.onchange = true;
                };
            };
            return;
        }
    }
}