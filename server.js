const app = require("express")()

function main() {
    app.get("/",(r,e)=>{
        e.send("/")
    })
    app.listen(()=>{console.log("server is up")})
}

module.exports = main