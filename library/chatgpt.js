const fetch = require("node-fetch");

module.exports = async (client, message, data) => {
    var mode = data['mode'];
    var content = message['content'];
    var Data = client.data._allData[message.guildId];
    switch (mode) {
        case 'NONE':
            const chatgpt_reply = await filter(content, client.data.setting);
            if (chatgpt_reply['error']) {
                return message.reply('AI having some problems')
            } else {
                var contents = chatgpt_reply['message'];
                if (contents.length > 2000) {
                    message.reply(contents.slice(0, 2000));
                    return message.followUp(contents.slice(2000))
                } else {
                    return message.reply(contents);
                };
            }
            break;
        case 'LOW':
            if (Data['ai'] && Data['ai']['conversations']) {
                var uwu = Data['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId);
                if (uwu.length !== 0) {
                    var history = uwu[0]['history_chat'];
                    if (!history || history.length === 0) {
                        const chatgpt_reply = await filter(content, client.data.setting);
                        if (chatgpt_reply['error']) {
                            return message.reply('AI having some problems')
                        } else {
                            var history = [];
                            var contents = chatgpt_reply['message'];
                            if (contents.length > 850) {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message'].slice(0, 300)}...${chatgpt_reply['message'].slice(-500)}`);
                            } else {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message']}`);
                            }
                            if (contents.length > 2000) {
                                message.reply(contents.slice(0, 2000));
                                message.followUp(contents.slice(2000))
                            } else {
                                message.reply(contents);
                            };
                            uwu[0]['history_chat'] = history;
                            client.data._allData[message.guildId]['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId)[0] = uwu[0];
                            client.data.onchange = true;
                            return;
                        }
                    } else {
                        var wfew = history.slice(-1)[0] + "\nHuman: " + content;
                        const chatgpt_reply = await filter(wfew, client.data.setting);
                        if (chatgpt_reply['error']) {
                            return message.reply('AI having some problems')
                        } else {
                            var contents = chatgpt_reply['message'].split('\nAi:')[1];
                            var history = [];
                            if (contents.length > 400) {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message'].slice(0, 100)}...${chatgpt_reply['message'].slice(-200)}`);
                            } else {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message']}`);
                            }
                            if (contents.length > 2000) {
                                message.reply(contents.slice(0, 2000));
                                message.followUp(contents.slice(2000))
                            } else {
                                message.reply(contents);
                            };
                            client.data._allData[message.guildId]['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId)[0]['history_chat'] = history;
                            client.data.onchange = true;
                            return;
                        }
                    }
                } else {
                    return message.reply('unknown error\n error code: 8')
                }
            } else {
                return message.reply('unknown error\n error code:7')
            }
            break;
        case 'HIGH':
            if (Data['ai'] && Data['ai']['conversations']) {
                var uwu = Data['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId);
                if (uwu.length !== 0) {
                    var history = uwu[0]['history_chat'];
                    if (!history || history.length === 0) {
                        const chatgpt_reply = await filter(content, client.data.setting);
                        if (chatgpt_reply['error']) {
                            return message.reply('AI having some problems')
                        } else {
                            var history = [];
                            var contents = chatgpt_reply['message'];
                            if (contents.length > 400) {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message'].slice(0, 100)}...${chatgpt_reply['message'].slice(-200)}`);
                            } else {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message']}`);
                            }
                            if (contents.length > 2000) {
                                message.reply(contents.slice(0, 2000));
                                message.followUp(contents.slice(2000))
                            } else {
                                message.reply(contents);
                            };
                            uwu[0]['history_chat'] = history;
                            client.data._allData[message.guildId]['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId)[0] = uwu[0];
                            client.data.onchange = true;
                            return;
                        }
                    } else {
                        var send_out_text = "";
                        history.slice(-3).forEach(element => {
                            send_out_text = send_out_text + element
                        });
                        send_out_text = send_out_text + "\nHuman: " + content;
                        const chatgpt_reply = await filter(send_out_text, client.data.setting);
                        if (chatgpt_reply['error']) {
                            return message.reply('AI having some problems')
                        } else {
                            var contents = chatgpt_reply['message'].split('\nAi:')[1];
                            if (contents.length > 400) {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message'].slice(0, 100)}...${chatgpt_reply['message'].slice(-200)}`);
                            } else {
                                history.push(`Human: ${content}\nAi: ${chatgpt_reply['message']}`);
                            }
                            if (contents.length > 2000) {
                                message.reply(contents.slice(0, 2000));
                                message.followUp(contents.slice(2000))
                            } else {
                                message.reply(contents);
                            };
                            client.data._allData[message.guildId]['ai']['conversations'].filter(uwu => uwu.channelid === message.channelId)[0]['history_chat'] = history;
                            client.data.onchange = true;
                            return;
                        }
                    }
                } else {
                    return message.reply('unknown error\n error code: 8')
                }
            } else {
                return message.reply('Unknown error.\nError code: 7')
            }
            break;
        default:
            break;
    }
};

async function filter(message, setting) {
    const reply = await requestChatGPT(message, setting);
    if (reply['error']) {
        return reply;
    } else {
        var data = reply.data.choices[0];
        if (data.finish_reason === 'stop') {
            return { error: false, message: data.text }
        } else if (data.finish_reason === 'length') {
            const owo = await requestChatGPT(data.text, setting);
            var data_1 = owo.data.choices[0];
            if (data_1.finish_reason === 'stop') {
                return { error: false, message: data.text + data_1.text }
            } else if (data_1.finish_reason === 'length') {
                return { error: false, message: data.text + data_1.text + "..." }
            };
        } else {
            return { error: true }
        }
    }
}

async function requestChatGPT(message, setting) {
    try {
        var tokens = 3100 - 10 - message.length;
        const uwu = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
                "Authorization": `Bearer ${setting['openai-api-key']}`
            },
            body: JSON.stringify({
                "model": "text-davinci-003",
                "prompt": message,
                "max_tokens": tokens,
                "temperature": 0
            })
        });
        var data = await uwu.text();
        data = JSON.parse(data);
        const content = data.choices[0].text;
        if (content.length === 0) return { error: true };
        if (data.error) {
            return { error: true };
        };
        return { error: false, data };
    } catch (e) {
        console.log(e)
        return { error: true }
    };
};