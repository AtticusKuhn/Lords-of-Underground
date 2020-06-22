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
        }
    },
    gang_name:/^[a-z0-9-]{2,14}$/
}
module.exports = config