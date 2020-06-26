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
            level: 0.3
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
            desc:`
                This bot was designed by eulerthedestroyer#2074 and thought of by TheB2#3417. \n Bot invite link - https://discord.com/oauth2/authorize?scope=bot&client_id=723983871770755123&permissions=268470288
                Server invite link - https://discord.gg/6ZEKA3 .
                eulerthedestroyer06/20/2020
                Github repository link - https://github.com/eulerthedestroyer/Lords-of-Underground
            `,
            args:0
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
        "accept"
    ]
}
module.exports = config