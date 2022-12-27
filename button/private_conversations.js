const Discord = require("discord.js");

module.exports = {
    customId: "private_conversations",
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if (!Data || !Data['ai']) {
            interaction.reply({ content: `Unknown error\nError code: 4`, ephemeral: true });
        } else {
            const channel = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === interaction.channelId);
            if (channel) {
                var conversation = Data['ai']['conversations'];
                conversation = conversation.filter(owo => owo.channelid === interaction.channelId)[0];
                if (conversation) {
                    if (interaction.user.id !== conversation['author']) {
                        return interaction.reply({ content: `Sorry, you are not this conversation owner`, ephemeral: true });
                    };
                    conversation['public'] = false;
                    channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [
                                Discord.PermissionsBitField.Flags.ViewChannel
                            ],
                        },
                        {
                            id: conversation.author,
                            allow: [
                                Discord.PermissionsBitField.Flags.ViewChannel,
                                Discord.PermissionsBitField.Flags.SendMessages
                            ],
                        },
                    ]);
                    interaction.reply({ content: `Success change channel to private`, ephemeral: true });
                    Data['ai']['conversations'].filter(owo => owo.channelid === interaction.channelId)[0] = conversation;
                    const exampleEmbed = new Discord.EmbedBuilder()
                        .setColor('#dc3545')
                        .setTitle('⚠️ Warning ⚠️')
                        .setDescription('This conversations is private, but server admin still have access to read message.');
                    await channel.send({ embeds: [exampleEmbed] });
                    client.data._allData[interaction.guildId]['ai']['conversations'] = Data['ai']['conversations'];
                    //console.log(client.data._allData[interaction.guildId]['ai']['conversations'][0])
                    client.data.onchange = true;
                };
            };
            return;
        }
    }
}