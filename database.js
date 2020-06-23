const config = require("./config")
function get_balance(user_id,Person){
    return new Promise((res, rej) => {
        Person.findOne({ id: user_id.toString() }, (err,user)=>{
            if(err){
                res({
                    success:false,
                    msg:"bad"
                })
            }
            console.log(user,user== null )
            if(user== null ){
                res({
                    success:false,
                    msg:"I can't find your account, maybe you need to create it with 'create'"
                })
            }else{
                res({
                    success:true,
                    balance:user.money
                })
            }
        })
    })
}
function create(id,name, Person){
    console.log("create called")
    return new Promise((res, rej) => {
        Person.findOne({ id: id.toString() }, (err,user)=>{
            if(err){
                res({
                    success:false,
                    msg:"bad"
                })
            }
            console.log(user,user== null )
            if(user== null ){
                Person.bulkWrite([{
                    insertOne: {
                        document: {
                            name: name,
                            id: id.toString(),
                            money: 1000,
                            items: [],
                            gang: "",
                            arrested:false,
                            notoriety: 0
                        }
                    }
                }]).then(result=>{
                    res({
                        success:true,
                        msg:"your account has been created. Good luck on your journey"
                    })
                })
            }else{
                res({
                    success:false,
                    msg:"you already have an account"
                })
            }
        })
    })
}

function start_gang(id, Person,gang_name){
    console.log("start_gang")
    return new Promise((res, rej) => {
        Person.findOne({ id: id.toString() }, (err,user)=>{
            if(user == null){
                res({
                    success:false,
                    msg:"don't exist"
                })
            }else{
                if(user.gang != "" && user.gang != "none" ){
                    Person.updateOne({ id: id.toString() }, { gang: gang_name  }).then(_=>{
                        res({
                            success:false,
                            msg:"you're already in a gang"
                        })
                    })
                }else{
                    res({
                        success:true
                    })
                }
            }
        })
    })
}

function find_person(id,Person){
    return new Promise((res, rej) => {
        Person.findOne({ id: id.toString() }, (err,user)=>{
            if(user == null){
                res({
                    success:false,
                    msg:"don't exist"
                })
            }else{
                res({
                    success:true,
                    user:user
                })
            }
        })
    }) 
}
async function extort(id, Person){
    let person = await find_person(id,Person)
    if(person.success){
        person = person.user
        console.log(new Date().getTime() - person.cooldown.extort)
        if(new Date().getTime() - person.cooldown.extort > config.extort_cooldown){
            let cd = person.cooldown
            cd.extort = new Date().getTime()
            console.log(person.money)
            await Person.updateOne({ id: person.id}, {
                money: person.money+Math.floor(Math.random()*10+10),//config.exort_payoff,
                notoriety: person.notoriety+1,
                cooldown:cd
            });
            return{
                success:true,
                msg:"you extorted a business"
            }
        }else{
            return{
                success:false,
                msg:`wait another ${new Date().getTime() - person.cooldown.extort-config.extort_cooldown} seconds`
            }
        }
    }else{
        return{
            success:false,
            msg:"can't find"
        }
    }
}
async function make(id ,Person, item){
    if(!config.items[item]){
        return{
            success:false,
            msg:"invalid item"
        }
    }
    let person = await find_person(id,Person)
    if(!person.success){
        return{
            success:false,
            msg:"can't find"
        }
    }
    person = person.user
    if(new Date().getTime() - person.cooldown[item] < config.items[item].cooldown ){
        return {
            success:false,
            msg:"wait a bit longer"
        }
        
    }
    let cd = person.cooldown
    cd[item] = new Date().getTime()
    await Person.updateOne({ id: person.id}, {
        items: [...person.items, item],
        cooldown:cd
    })
    return {
        success:true,
        msg:`you made a ${item}`
    }



}
function init(database){
    console.log(database)
}
module.exports = {
    get_balance,
    create,
    start_gang,
    find_person,
    extort,
    make
}


