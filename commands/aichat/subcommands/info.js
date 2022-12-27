const Discord = require("discord.js");

module.exports = {
    name: "info",
    description: "Get control in conversation or lobby",
    ignore: false,
    subcommands: new Discord.SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription("Get control in conversation or lobby")
        ),
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        if (!Data || !Data['ai']) {
            client.data.onchange = true;
            if (!Data) {
                client.data._allData[interaction.guildId] = {};
            };
            client.data._allData[interaction.guildId]['ai'] = {};
            interaction.reply({ content: `Haven't active AI chat now`, ephemeral: true });
        } else {
            var channelid = interaction.channelId;
            var ai_Data = Data['ai'];
            if(!ai_Data['conversations']) return interaction.reply({ content: `Haven't active AI chat now`, ephemeral: true });
            var data = ai_Data['conversations'].filter(owo => owo.channelid === interaction.channelId);
            if (ai_Data['lobby'] === channelid) {
                const exampleEmbed = new Discord.EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Create new conversations')
                    .setDescription('Click the button to create new conversations')
                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('create_conversations')
                            .setLabel('📑Create!')
                            .setStyle(Discord.ButtonStyle.Primary),
                    );
                const channel = await client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === channelid)
                if (channel) {
                    await interaction.reply({ embeds: [exampleEmbed], components: [row] });
                };
            } else if (data && data !== 0) {
                if(data.length === 0) {
                    return interaction.reply({ content: `This channel are not ai conversation or lobby`, ephemeral: true });
                }
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
                const channel = await client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === channelid)
                if (channel) {
                    await interaction.reply({ embeds: [exampleEmbed], components: [row, row1] });
                };
            } else {
                interaction.reply({ content: `This channel are not ai conversation or lobby`, ephemeral: true });
            }
        };
        return;
    }
}