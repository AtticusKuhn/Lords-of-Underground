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
            args:0,
            level: 0.4
        },
        "make":{
            desc:"create illicit substances such as guns or drugs",
            args:1,
            level: 0.5
        },
        "market":{
            desc:"show trades on the black market",
            args:0,
        },
        "sell":{
            desc:"place your items on the market",
            args:3,
            level: 6
        },
        "accept":{
            desc:"accept an offer on the market",
            args:1,
            level: 3
        },
        "bribe":{
            desc:"Decrease your notoriety",
            args:1
        },
        "info":{
            desc:"see infomation on this project",
            args:0
        },
        "attack":{
            desc:"attack another person",
            args:2
        },
        "dev-set":{
            desc:"",
            args:3
        }
    },
    items:{
        gun:{
            desc:"can shoot",
            make_coolown:100,
            use_cooldown:100,
            item_requirements:["gunlab"],
            makeable:true,
            damage:[1,2]
        },
        gunlab:{
            desc:"allows you to make guns",
           }
    },
    gang_name:/^[a-z0-9-]{2,14}$/,
    extort_cooldown:10e3,
    exort_payoff: Math.floor(Math.random()*10+10),
    level_cooldown:3600e3,
    attack_cooldown: 10e3,
    level_rewards:[
        "gun lab"
    ],
    rank_names:[
        "Associates",
        "Soldiers",
        "Caporegimes",
        "Consigliere",
        "Underboss",
        "Boss"
    ],
    add_fake_offer_probablility: 0.9,
    arrest_probability: 0.5,
    illicit_commands:[
        "extort",
        "make",
        "sell",
        "accept",
        "attack"
    ],
    default_health:15

}
module.exports = config