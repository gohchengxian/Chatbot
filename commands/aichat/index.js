const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "AI",
    description: "AI chat",
    commands: (client, file) => {
        const localfile = require(".");
        this.slash_commands = new Discord.SlashCommandBuilder()
            .setName(localfile['name'].toLowerCase())
            .setDescription(localfile['description']);
        const folder = fs.readdirSync(__dirname);
        client.ram.commands_file[localfile['name'].toLowerCase()] = {};
        client.ram.commands_file[localfile['name'].toLowerCase()]['index'] = file;
        if (folder.includes('subcommands')) {
            const file = fs.readdirSync(__dirname + "/subcommands");
            client.ram.commands_file[localfile['name'].toLowerCase()]['subcommands'] = {};
            file.forEach(file => {
                //return not javascript file
                if (!file.endsWith('.js')) return;
                var command_file = require(`./subcommands/${file}`);
                if (command_file['ignore'] === false || command_file['ignore'] === undefined) {
                    command_file['subcommands']['options'].forEach(command => {
                        client.ram.commands_file[localfile['name'].toLowerCase()]['subcommands'][command['name']] = file;
                        this.slash_commands['options'].push(command)
                    });
                };
            });
        };
        return this.slash_commands;
    },
    run: () => {

    }
}

/*
const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server!')
    .addSubcommand(subcommand =>
        subcommand
            .setName('user')
            .setDescription('Info about a user')
            .addUserOption(option => option.setName('target').setDescription('The user')))
    .addSubcommand(subcommand =>
        subcommand
            .setName('server')
            .setDescription('Info about the server'));

var an_data = new SlashCommandBuilder()
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Delete AI chat')
    );
console.log(an_data['options'][0]);
data['options'].push(an_data['options'][0]);
console.log(data)*/