//files
const methods = require("./methods")
const config = require("./config")
const database = require("./database.js")
require("./server.js")()
//modules
const Discord = require('discord.js');
const client = new Discord.Client();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',async ()=>{
    // we're connected!
    const person_schema = new mongoose.Schema({
        name: String,
        id: String,
        money: Number,
        items: Array,
        gang: String,
        arrested:Boolean,
        notoriety: Number,
        cooldown: Object,
        level:Number
    });
    const Person = mongoose.model('Person', person_schema);
    const market_offer = new mongoose.Schema({
        author: String,
        item: String,
        cost: Number,
        amount: Number,
        short_id:String
    });
    const Offer = mongoose.model('Offer', market_offer);

//start bot
    client.on('ready', () => {
        console.clear()
        console.log(`Logged in as ${client.user.tag}!`);
        setInterval(()=>{database.decrease_notoriety(Person)},3600e3)
    });
    //bot recieves a message
    client.on('message', async (msg) => {
        if(msg.author.bot){
            return
        }
        const msg_array = msg.content.split(" ")
        let command =msg_array[0]
        command = command.toLowerCase()

        //valid command
        database.increase_level(msg.author.id, Person)
        if(Object.keys(config.commands).includes(command)){
            if(msg_array.length-1 !=config.commands[command].args ){
                msg.reply("invalid number of arguments")
                return
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
            let person = await database.find_person(msg.author.id,Person)

            if(!person.success && command != "create"){
                msg.reply("you don't have an account")
                return
            }
            person = person.user

            if(config.commands[command].level > person.level){
                msg.reply(`Insufficent levels: you must be of rank ${config.commands[command].level} ${methods.get_rank_name(config.commands[command].level)}, but you are only at rank, ${person.level} ${methods.get_rank_name(person.level)}`)
                return
            }
            if(person.arrested && config.illicit_commands.indexOf(command) > -1){
                msg.reply("you cannot do illicit activities while you are arrested")
                return
            }
            //background services
            database.add_fake_offer(Offer)
            if(config.illicit_commands.indexOf(command) > -1){
                if(await database.arrest(person, Person)){
                    msg.reply("you have been arrested")
                    return
                }
            }
            if(command == "balance"){
                let balance_result= await database.get_balance(msg.author.id,Person, msg_array[1])
                console.log(balance_result)
                if(!balance_result.success){
                    msg.reply(balance_result.msg)
                    return
                }
                msg.reply(balance_result.balance)

            }
            
            if(command == "help"){
                msg.reply(JSON.stringify(config.commands, null, 4).replace(/level/g,"rank"))
            }
            if(command.startsWith( "start")){
                console.log("start")
                if(config.gang_name.test(msg_array[1])){
                    let gang_already_exists = msg.guild.roles.cache.some(r => r.name==`gang: ${msg_array[1]}`) 
                    console.log(gang_already_exists)
                    if(gang_already_exists){
                        msg.reply(`gang already exists`)
                        return
                    }
//                    for(role_of_guild of msg.guild.roles.cache){
//                        role_of_guild = role_of_guild[1]
//                        if(methods.size_of_role(msg.guild, role_of_guild) == 0 && role_of_guild.name.startsWith("gang:")){
//                            console.log("no members", role_of_guild.name)
//                            msg.reply(`The gang ${role_of_guild.name} was disbanded for having no members`)
//                            role_of_guild.delete()
//                        }
//                    }
                        //console.log(result)
                    let role = await msg.guild.roles.create({
                        data: {
                            name:`gang: ${msg_array[1]}` ,
                            color: 'BLUE',
                        }
                    })
                    let result = await database.start_gang(msg.author.id, Person, role.id.toString())
                    if(!result.success){
                        msg.reply(result.msg)
                    }

                    //console.log( msg.guild.roles.cache)
                    for(role_of_guild of msg.guild.member(msg.author).roles.cache){
                        // console.log(role_of_guild[1], "is role")
                        //console.log(role_of_guild[1].name)
                        // console.log(role_of_guild[1])
                        if(role_of_guild[1].name.startsWith("gang:")){
                            msg.guild.member(msg.author).roles.remove(role_of_guild[1].id);
                        }
                    }
                    
                    msg.guild.member(msg.author).roles.add(role.id);
                    // Create a new channel with permission overwrites
                    let created_channel = await msg.guild.channels.create(msg_array[1].toLowerCase(), {
                    type: 'text',
                    permissionOverwrites: [
                        {
                        id: msg.author.id,
                        allow: ['SEND_MESSAGES', "VIEW_CHANNEL"],
                        },
                    ],
                    })
                    let category = msg.guild.channels.cache.find(c => c.name == "gangs" && c.type == "category")
                    console.log(category, "category")
                    if(!category){
                        category = await msg.guild.channels.create("gangs", {
                            type: 'category'
                        })
                    }
                    for(gang_channel of category.children){
                        gang_channel = gang_channel[1]
                        let role_of_guild = msg.guild.roles.cache.find(r =>r.name==`gang: ${gang_channel.name}`)
                        if(methods.size_of_role(msg.guild, role_of_guild) == 0){
                            if(role_of_guild){
                                console.log("no members", role_of_guild.name)
                                msg.reply(`The gang ${role_of_guild.name} was disbanded for having no members`)
                                role_of_guild.delete()
                            }
                            console.log(gang_channel,"gang_channel")
                            gang_channel.delete()
                        }
                    }

                    await created_channel.setParent(category.id);
                }else{
                    msg.reply(`invalid gang name. must be ${config.gang_name}`)
                }
            }
            if(command == "profile"){
                let result = await database.find_person(msg.author.id,Person)
                if(result.success){
                    let formatted = JSON.parse(JSON.stringify(result.user))
                    formatted.rank = `rank ${formatted.level} ${methods.get_rank_name(formatted.level)}`
                    console.log(formatted)
                    delete  formatted.level
                    msg.reply(JSON.stringify(formatted,null,4))
                }
            }
            if(command == "extort"){
                let result = await database.extort(msg.author.id,Person)
                msg.reply(result.msg)
            }
            if(command.startsWith("make")){
                let result = await database.make(msg.author.id ,Person, msg_array[1])
                msg.reply(result.msg)
            }
            if(command =="market"){
               // let result = await database.get_market(Person,Offer)
                if(Offer.find({}).toString() =="" ){
                    msg.reply("no offers currently, put one up to see it here")
                }else{
                    let result = "\n"
                    for await (const doc of Offer.find()) {
                        result +=`Offer ${doc.short_id} : ${doc.amount} ${doc.item} for ${doc.cost}\n`
                    }
                   // console.log(Offer.find({}))
                    msg.reply(result)
                }
            }
            if(command.startsWith("sell")){
                let result = await database.sell(msg_array[1],msg_array[2] ,msg_array[3],person,Offer,Person)
                msg.reply(result.msg)
            }
            if(command.startsWith("accept")){
                let result = await database.accept(msg_array[1], person, Person, Offer)
                msg.reply(result.msg)
            }
            if(command.startsWith("bribe")){
                let result = await database.bribe(person,Person, msg_array[1])
                msg.reply(result.msg)
            }
        }
    });



    client.login(process.env.DISCORD_BOT_SECRET);


})