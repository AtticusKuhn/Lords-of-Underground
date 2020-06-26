const crypto = require("crypto")

const config = require("./config")
const methods = require("./methods")


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
                            notoriety: 0,
                            name: String,
                            cooldown:{},
                            level:0
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
    if(!config.items[item].makeable){
        return{
            success:false,
            msg:"that item cannot be made"
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
    for (const requirement of config.items[item].item_requirements){
        if(person.items.indexOf(requirement) < 0){
            return{
                success:false,
                msg:`you must have ${requirement} in order to make this`
            }
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
async function increase_level(id, Person){
    let person = await find_person(id,Person)
    if(!person.success){
        return{
            success:false,
            msg:"can't find"
        }
    }
    person = person.user
    if(new Date().getTime() - person.cooldown.level < config.level_cooldown ){
        return {
            success:false,
            msg:"wait a bit longer"
        }
    }
    let person_level = person.level
    if(!person_level){
        person_level = 1
    }else{
        person_level += Math.random()*0.3+0.1
    }
    let cd = person.cooldown
    cd.level = new Date().getTime()
    await Person.updateOne({ id: person.id}, {
        level: person_level,
        cooldown:cd
    })
}
async function sell(amount ,item  ,price, person,Offer, Person){
    if(!config.items[item]){
        return{
            success:false,
            msg:"invalid item name"
        }
    }
    if( isNaN(amount) || isNaN(price)){
        return{
            success:false,
            msg:"invalid number"
        }
    }
    amount = Number(amount)
    price = Number(price)
    if(price == 0 || amount ==0){
        return{
            success:false,
            msg:"cannot be 0"
        }
    }
    if(Math.sign(price) != Math.sign(amount)){
        return{
            success:false,
            msg:"price and amount must havae the same sign"
        }
    }
    if(price > 0 && person.money< price ){
        return{
            success:false,
            msg:"you don't have enough money"
        }
    }
    if(amount < 0 && methods.array_frequency(person.items)[item] < amount ){
        return {
            success:false,
            msg:"you don't have enough of the item to sell"
        }
    }
    if(price > 0){
        await Person.updateOne({ id: person.id}, {
            money: person.money-price
        });
    }
    if( amount < 0 ){
         await Person.updateOne({ id: person.id}, {
            items: methods.remove_n(person.items, item, amount)
        });
    }
     Offer.bulkWrite([{
        insertOne: {
            document: {
            author: person,
            item: item,
            cost: price,
            amount: amount,
            short_id:crypto.randomBytes(3).toString("hex")
            }
        }
    }])
    return {
        success:true,
        msg:"your offer has been posted"
    }
}
async function accept(offer_id, person, Person, Offer){
    console.log(offer_id, "offer_id")
    let found_offer = await Offer.findOne({ short_id: offer_id })
  //  found_offer.author = found_offer.author.replace(/:/g,'":')
    //found_offer.author = found_offer.author.replace(/\n/g,'\n"')
    found_offer.author = found_offer.author.replace(/[\da-f]{19,30}/g,'""')

   // found_offer.author = found_offer.author.substring(0)
    console.log(found_offer.author, eval('(' + found_offer.author + ')'))
    found_offer.author = eval('(' + found_offer.author + ')');
    let parsed_author  =eval('(' + found_offer.author + ')')

    console.log(parsed_author.items,"is the items")
    if(found_offer == null || found_offer ==undefined  || !found_offer){
        return{
            success:false,
            msg:"can't find that offer"
        }
    }
    if(found_offer.cost > 0  && person.money <found_offer.cost  ){
        return {
            success:false,
            msg:"you don't have enough money"
        }
    }
    if(found_offer.amount < 0 && methods.array_frequency(person.items)[found_offer.item] < Math.abs(found_offer.amount) ){
        return  {
            success:false,
            msg:"you don't have enough of the item"

        }
    }
     if(found_offer.cost < 0){
        await Person.updateOne({ id: person.id}, {
            money: person.money-found_offer.cost,
            items:[...person.items, Array(found_offer.amount).fill(found_offer.item) ]
        });
        await Person.updateOne({id:parsed_author.id},{
            money: parsed_author.moeny+ found_offer.cost
        })

    }
    if( found_offer.amount > 0 ){
         await Person.updateOne({ id: person.id}, {
            items: methods.remove_n(person.items, found_offer.item, found_offer.amount),
            money:  person.money+found_offer.cost
        });
        console.log(parsed_author.id)
        await Person.updateOne({id:parsed_author.id},{
            items: [...parsed_author.items, ...Array(found_offer.amount).fill(found_offer.item) ]
        })
    }
    await Offer.deleteOne({short_id:found_offer.short_id})
    return{
        success:true,
        msg:"you accepted the offer"
    }
}
async function add_fake_offer(Offer){
    if(Math.random() > config.add_fake_offer_probablility){
        const price= Math.floor(Math.random()*40+80)
        const amount = Math.floor(Math.random()*5+7)
        const item = methods.random_array(Object.keys(config.items))
        Offer.bulkWrite([{
            insertOne: {
                document: {
                author: "bot",
                item: item,
                cost: price,
                amount: amount,
                short_id:crypto.randomBytes(3).toString("hex")
                }
            }
        }])
    }
}
async function arrest(person, Person){
    if(Math.random()*person.notoriety-3 > config.arrest_probability){
        await Person.updateOne({ id: person.id}, {
            notoriety: person.notoriety-1,
            arrested:true
        });
        return true
    }
    return false
}
async function decrease_notoriety(Person){
    for await (const person of Person.find()) {
        if(person.notoriety > 4){
            await Person.updateOne({ id: person.id}, {
                notoriety: person.notoriety-0.3,
            });
            if(person.notoriety < 4 && person.arrested){
            await Person.updateOne({ id: person.id}, {
                arrested: false,
            });
            }
        }
    }
}
async function bribe(person, Person, amount){
    if(isNaN(amount)){
        return{
            success:false,
            msg:"not a valid number"
        }
    }
    amount= parseInt(amount)
    if(amount <= 0 ){
        return{
            success:false,
            msg:"bribe can't be negtive"
        }
    }
    if(person.money < amount ){
        return{
            success:false,
            msg:"you don't have enough money"
        }
    }
    await Person.updateOne({ id: person.id}, {
        money: money - amount,
        notoriety: Math.min(0, amount/30)
    });
    if(person.arrested && person.notoreity < 4){
    await Person.updateOne({ id: person.id}, {
        arrested: false
    });
    return{
        success:true,
        msg:"you sucessfully bribed the police"
    }
    }
}
module.exports = {
    get_balance,
    create,
    start_gang,
    find_person,
    extort,
    make,
    increase_level,
    add_fake_offer,
    sell,
    accept,
    arrest
}


