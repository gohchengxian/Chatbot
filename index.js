//import discord.js library
const Discord = require("discord.js");
//setting client
const client = new Discord.Client({
    partials: ["CHANNEL"],
    intents: [
        Discord.GatewayIntentBits.Guilds, //Get Guild Info
        Discord.GatewayIntentBits.DirectMessages, //Get DM message, if you don't want can delete it
        Discord.GatewayIntentBits.GuildMessages, //Get Guild Message
        Discord.GatewayIntentBits.MessageContent //Get message content
    ]
});
client.data = {};
client.data.onchange = false;

//import node-fetch library
const fetch = require('node-fetch');

//import nodejs file system
const fs = require("fs");
const EventEmitter = require("events");
//import config.json file 
const setting = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
client.data.setting = setting;

//import discord.js event
fs.readdir("./event/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        //ignore all not javascript file
        if (!file.endsWith(".js")) return;
        const event = require(`./event/${file}`);
        let eventName = file.split(".")[0];
        //using bind to let client come forward 
        //Learn from: https://www.webhek.com/post/javascript-bind/
        client.on(eventName, event.bind(null, client));
    });
});

//When bot started will notice on console
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Invite link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`);
    client.ram = {}
    fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        client.ram.commands_file = {};
        client.ram.slash = [];
        files.forEach(file => {
            //ignore all file
            if (file.includes(".")) return;
            const command_file = require(`./commands/${file}/index`);
            client.ram.slash.push(command_file['commands'](client, file));
        });
    });
    fs.readdir("./button/", (err, files) => {
        if(err) return console.error(err);
        client.ram.button_file = {};
        files.forEach(file => {
            const button = require(`./button/${file}`)['customId'];
            client.ram.button_file[button] = file;
        });
    });
    fs.readdir("./menu/", (err, files) => {
        if(err) return console.error(err);
        client.ram.menu_file = {};
        files.forEach(file => {
            const menu = require(`./menu/${file}`)['customId'];
            client.ram.menu_file[menu] = file;
        });
    });
});

//Check have or not data
if (!fs.readdirSync('./').includes('data.json')) {
    fs.writeFileSync('./data.json', JSON.stringify({}))
};
//Get Channel data
client.data._allData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

//Log in Bot
client.login(setting['discord-bot-token']);

//5 minute repeat one time bot
setInterval(async () => {
    if (client.data.onchange) {
        fs.writeFileSync('data.json', JSON.stringify(client.data._allData))
        client.data.onchange = false;
    };
}, 1000 * 60 * 5)