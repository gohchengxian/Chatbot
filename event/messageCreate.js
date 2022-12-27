const interactionCreate = require("./interactionCreate");

module.exports = (client, message) => {
    if (message.author.bot || message.author.system) return;
    var Data = client.data._allData[message.guildId];
    if (!Data) {
        Data = {};
        return;
    };
    if(!Data['ai']) return;
    var data = Data['ai']['conversations'];
    if (data) {
        var check_conversation = data.filter(owo => owo.channelid === message.channelId);//check this channel are conversation channel or not
        if (check_conversation.length !== 0) {
            return require("../library/chatgpt")(client, message, check_conversation[0])
        };
    }
};