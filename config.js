const config = {
    commands:{
        "balance":{
            desc:"show your money",
            args: 0
        },
        "create":{
            desc:"start on your journey to becoming a crime boss",
            args:0
        },
        "help":{
            desc:"show a list of all commands",
            args:0
        },
        "start":{
            desc:"create your own gang",
            args:1
        },
        "profile":{
            desc:"see your profile",
            args:0
        },
        "extort":{
            desc:"extort a business for money",
            args:0
        },
        "make":{
            desc:"create illicit substances such as guns or drugs",
            args:1
        }
    },
    items:{
        gun:{
            desc:"can shoot",
            make_coolown:100,
            use_cooldown:100
        }
    },
    gang_name:/^[a-z0-9-]{2,14}$/,
    extort_cooldown:10000,
    exort_payoff: Math.floor(Math.random()*10+10)
}
module.exports = config