//files
const methods = require("./methods")
const config = require("./config")
const database = require("./database.js")
//modules
const Discord = require('discord.js');
const client = new Discord.Client();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    // we're connected!
    const person_schema = new mongoose.Schema({
        name: String,
        id: String,
        money: Number,
        items: Array,
        gang: String,
        arrested:Boolean,
        notoriety: Number
    });
    const Person = mongoose.model('Person', person_schema);
//start bot
    client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    });
    //bot recieves a message
    client.on('message', async (msg) => {
        if(msg.author.bot){
            return
        }
        const msg_array = msg.content.split(" ")
        const command =msg_array[0]
        //valid command
        if(Object.keys(config.commands).includes(command)){
            if(msg_array.length-1 !=config.commands[command].args ){
                msg.reply("invalid number of arguments")
                return
            }
            if(command == "balance"){
                let balance_result= await database.get_balance(msg.author.id,Person)
                console.log(balance_result)
                if(!balance_result.success){
                    msg.reply(balance_result.msg)
                    return
                }
                msg.reply(balance_result.balance)

            }
            if(command == "create"){
                console.log("create")
                let result =  await database.create(msg.author.id,msg.author.username, Person)
                if(!result.success){
                    msg.reply(result.msg)
                    return
                }
                msg.reply(result.msg)
            }
            if(command == "help"){
                msg.reply(JSON.stringify(config.commands, null, 4))
            }

        }
    });



    client.login(process.env.DISCORD_BOT_SECRET);


})