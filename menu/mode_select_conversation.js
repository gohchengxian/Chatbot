const Discord = require("discord.js");

module.exports = {
    customId: "mode_select_conversation",
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if (!Data || !Data['ai']) {
            return interaction.reply({ content: `Unknown error\nError code: 6`, ephemeral: true });
        } else {
            var data = Data['ai']['conversations'];
            var channel = data.filter(owo => owo.channelid === interaction.channelId);
            if (channel.length === 0) {
                return interaction.reply({ content: `Unknown error\nError code: 7`, ephemeral: true });
            } else {
                var conversation_data = channel[0];
                if (conversation_data['author'] !== interaction.user.id) {
                    return interaction.reply({ content: `You are not this conversation owner, you can't change chat mode.`, ephemeral: true });
                };
                if(conversation_data['mode'] !== interaction['values'][0]) {
                    conversation_data['history_chat'] = [];
                };
                conversation_data['mode'] = interaction['values'][0];
                Data['ai']['conversations'].filter(owo => owo.id === interaction.channelId)[0] = conversation_data;
                interaction.reply({ content: `You success change chat mode to ${interaction['values'][0]}.`, ephemeral: true });
                client.data._allData[interaction.guildId]['ai']['conversations'] = Data['ai']['conversations'];
                //console.log(client.data._allData[interaction.guildId]['ai']['conversations'].filter(owo => owo.channelid === interaction.channelId)[0])
                client.data.onchange = true;
            }
        }
    }
};