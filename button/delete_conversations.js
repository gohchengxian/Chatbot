const { ThreadAutoArchiveDuration } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    customId: "delete_conversations",
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if(!Data || !Data['ai']) {
            return interaction.reply({ content: `Unknown error\nError code: 2`, ephemeral: true });
        } else {
            const all_conversation = Data['ai']['conversations'];
            const this_conversation = interaction.channelId;
            const data_conversation = all_conversation.filter(owo => owo.channelid === this_conversation);
            if(data_conversation.length === 0 ) {
                return interaction.reply({ content: `Unknown error\nError code: 3`, ephemeral: true }); 
            };
            if(data_conversation[0]['author'] !== interaction.user.id) {
                return interaction.reply({ content: `Sorry, you are not this conversation owner`, ephemeral: true }); 
            };
            interaction.reply({ content: `Starting delete channel`, ephemeral: true });
            var conversation = [];
            all_conversation.forEach(element => {
                if(element['channelid'] !== this_conversation) {
                    conversation.push(element)
                };
                return;
            });
            const channels = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === interaction.channelId);
            channels.delete();
            client.data._allData[interaction.guildId]['ai']['conversations'] = conversation;
            client.data.onchange = true;
        }
    }
}