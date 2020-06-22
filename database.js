
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
                    res({
                        success:false,
                        msg:"you're already in a gang"
                    })
                Person.updateOne({ id: id.toString() }, { gang: gang_name  });
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

function init(database){
    console.log(database)
}
module.exports = {
    get_balance,
    create,
    start_gang,
    find_person
}


