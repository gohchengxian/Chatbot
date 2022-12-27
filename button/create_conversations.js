const Discord = require("discord.js");

module.exports = {
    customId: "create_conversations",
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if (!Data || !Data['ai']) {
            interaction.reply({ content: `Unknown error\nError code: 1`, ephemeral: true });
        } else {
            const category = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === Data['ai']['category']);
            if (category) {
                var json = {};
                json['author'] = interaction.user.id;
                json['mode'] = 'HIGH';
                json['history_chat'] = [];
                json['public'] = false;
                Data['ai']['conversations_num']++;
                const conversation = await create_channel(client, interaction, category.id, Data['ai']);
                json['channelid'] = conversation;
                if (!Data['ai']['conversations']) {
                    Data['ai']['conversations'] = [];
                    Data['ai']['conversations'].push(json)
                } else {
                    Data['ai']['conversations'].push(json)
                };
                interaction.reply({ content: `Already create new conversation <#${conversation}>`, ephemeral: true });
                client.data.onchange = true;
                client.data._allData[interaction.guildId]['ai']['conversations'] = Data['ai']['conversations'];
            } else {
                interaction.reply({ content: `Your category already delete, Please use slash command(/ai setup) to setup`, ephemeral: true });
            }
        }
    }
}

async function create_channel(client, interaction, parentid, Data) {
    const exampleEmbed = new Discord.EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Control Conversation')
        .setDescription('Please be careful when pressing the button\n Can call me back using \`/ai info\`')
    const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('public_conversations')
                .setLabel('Public')
                .setStyle(Discord.ButtonStyle.Primary),
            new Discord.ButtonBuilder()
                .setCustomId('delete_conversations')
                .setLabel('Delete conversation ‼️')
                .setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder()
                .setCustomId('private_conversations')
                .setLabel('Private')
                .setStyle(Discord.ButtonStyle.Primary)
        )
    const row1 = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId('mode_select_conversation')
                .setPlaceholder('Change chat mode')
                .addOptions(
                    {
                        label: 'High',
                        description: 'Make the conversation highly relevant',
                        value: 'HIGH',
                    },
                    {
                        label: 'Low',
                        description: 'Make the conversation a little bit more relatable',
                        value: 'LOW',
                    },
                    {
                        label: 'None',
                        description: 'Make the conversation none relatable',
                        value: 'NONE'
                    }
                ),)
    const channel = await client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.create({
        name: `conversation-${Data['conversations_num']}`,
        type: Discord.ChannelType.GuildText, parent: parentid,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone.id, // @everyone role
                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [
                    Discord.PermissionsBitField.Flags.ViewChannel,
                    Discord.PermissionsBitField.Flags.SendMessages
                ]
            }
        ]
    });
    await channel.send({ embeds: [exampleEmbed], components: [row, row1] });
    return channel.id;
};