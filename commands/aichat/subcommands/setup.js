const { InviteTargetType } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
    name: "setup",
    description: "setup AI chat",
    ignore: false,
    subcommands: new Discord.SlashCommandBuilder()
        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription("setup AI chat")
        ),
    run: async (client, interaction) => {
        var Data = client.data._allData[interaction.guildId];
        var permission = interaction.member.permissions;
        if(!permission.has(Discord.PermissionsBitField.Flags.Administrator) || !permission.has(Discord.PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: `You don't have access to do this action.\nRequire: Administrator access or ManageGuild access`, ephemeral: true });
        };
        if (Data === undefined) {
            Data = {};
            client.data._allData[interaction.guildId] = {};
        };
        if (Data['ai'] === undefined || Data['ai'] === {}) {
            client.data._allData[interaction.guildId]['ai'] = {};
            Data['ai'] = {};
            const category = await create_category(client, interaction);
            Data['ai']['category'] = category;
            const channel = await create_channel(client, interaction, category);
            Data['ai']['lobby'] = channel;
            Data['ai']['conversations'] = [];
            Data['ai']['conversations_num'] = 0;
            client.data.onchange = true;
            client.data._allData[interaction.guildId]['ai'] = Data['ai'];
            interaction.reply({ content: `Success setup AI chat! \nVisit: <#${channel}>`, ephemeral: true });
        } else {
            if (Data['ai']['category']) {
                const category = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === Data['ai']['category']);
                if (category === undefined) {
                    const categorys = await create_category(client, interaction);
                    Data['ai']['category'] = categorys;
                    const channel = await create_channel(client, interaction, categorys);
                    Data['ai']['lobby'] = channel;
                    Data['ai']['conversations'] = [];
                    Data['ai']['conversations_num'] = 0;
                    client.data.onchange = true;
                    client.data._allData[interaction.guildId]['ai'] = Data['ai'];
                    interaction.reply({ content: `Success setup AI chat! \nVisit: <#${channel}>`, ephemeral: true });
                } else {
                    const channel = client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.cache.find(owo => owo.id === Data['ai']['lobby']);
                    if (channel === undefined) {
                        const channels = await create_channel(client, interaction, category);
                        Data['ai']['lobby'] = channels;
                        if (!Data['ai']['conversations']) {
                            Data['ai']['conversations'] = [];
                        };
                        if(!Data['ai']['conversations_num']) {
                            Data['ai']['conversations_num'] = 0;
                        }
                        client.data.onchange = true;
                        client.data._allData[interaction.guildId]['ai'] = Data['ai'];
                        interaction.reply({ content: `Success setup AI chat! \nVisit: <#${channels}>`, ephemeral: true });
                    } else {
                        interaction.reply({ content: `You already have setup AI chat! \nVisit: <#${channel}>`, ephemeral: true });
                    }
                }
            } else {
                const category = await create_category(client, interaction);
                Data['ai']['category'] = category;
                const channel = await create_channel(client, interaction, category);
                Data['ai']['lobby'] = channel;
                interaction.reply({ content: `Success setup AI chat! \nVisit: <#${channel}>`, ephemeral: true });
                if (!Data['ai']['conversations']) {
                    Data['ai']['conversations'] = [];
                };
                if(!Data['ai']['conversations_num']) {
                    Data['ai']['conversations_num'] = 0;
                }
                client.data.onchange = true;
                client.data._allData[interaction.guildId]['ai'] = Data['ai'];
            };
        };
    }
};

async function create_category(client, interaction) {
    const category = await client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.create({ name: "AI Chat", type: Discord.ChannelType.GuildCategory });
    return category.id;
};

async function create_channel(client, interaction, parentid) {
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
    const channel = await client.guilds.cache.find(owo => owo.id === interaction.guildId).channels.create({ name: `Lobby`, type: Discord.ChannelType.GuildText, parent: parentid });
    await channel.send({ embeds: [exampleEmbed], components: [row] });
    return channel.id;
}