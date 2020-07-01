const config = require("./config")
const Discord = require('discord.js');

function array_frequency(arr){
    //var arr = [5, 5, 5, 2, 2, 2, 2, 2, 9, 4];
    var counts = {};

    for (var i = 0; i < arr.length; i++) {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts
}
function remove_n(array , thing, amount){
    for(i=0;i<array.length;i++){
        if(array[i] == thing && amount){
            array.splice(i, 1);
            amount--
        }
    }
    return array
}
function get_rank_name(level){
    return config.rank_names[Math.min(Math.floor(level/3), 6)] 
}
function random_array(array){
    return array[Math.floor(Math.random()*array.length)]
}
function size_of_role(guild, role){
    let size=0
    ///console.log(guild.members.cache)
    for(person of guild.members.cache){
        person = person[1]
        //console.log(person, "person")
        if(role){
            if(guild.member(person).roles.cache.find(r => r.id === role.id)){
                size++
            }
        }
    }
    return size
}

function make_embed(result){
// inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor( result.success ? '#3DFC2F' :"#FF051E" )
        .setTitle('Lords of Underground')
        .setURL('https://github.com/eulerthedestroyer/Lords-of-Underground')
        .setThumbnail('https://cdn.discordapp.com/attachments/723966487773184050/723966917165056060/lords_of_underground.png')
        .addFields(
            { name: `Result: ${result.success}`, value: result.msg},
            { name: '\u200B', value: '\u200B' },
        )
       // .setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Source code', 'https://github.com/eulerthedestroyer/Lords-of-Underground');
    return exampleEmbed
}
module.exports ={
    array_frequency,
    remove_n,
    get_rank_name,
    random_array,
    size_of_role,
    make_embed
}