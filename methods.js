const config = require("./config")

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

module.exports ={
    array_frequency,
    remove_n,
    get_rank_name,
    random_array,
    size_of_role
}