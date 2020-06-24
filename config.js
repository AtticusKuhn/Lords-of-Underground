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
        },
        "market":{
            desc:"show trades on the black market",
            args:0
        },
        "sell":{
            desc:"place your items on the market",
            args:3
        },
        "accept":{
            desc:"accept an offer on the market",
            args:1
        }
    },
    items:{
        gun:{
            desc:"can shoot",
            make_coolown:100,
            use_cooldown:100,
            item_requirements:["gunlab"],
            makeable:true
        },
        gunlab:{
            desc:"allows you to make guns",
            makeable:false
        }
    },
    gang_name:/^[a-z0-9-]{2,14}$/,
    extort_cooldown:10e3,
    exort_payoff: Math.floor(Math.random()*10+10),
    level_cooldown:3600e3,
    level_rewards:[
        "gun lab"
    ]
}
module.exports = config