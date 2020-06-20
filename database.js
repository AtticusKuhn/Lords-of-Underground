
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_LINK, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
  // we're connected!
    const person_schema = new mongoose.Schema({
        name: String,
        id: String,
        money: Number,
        items: Array,
        gang: String,
        arrested:Boolean
    });
    init(db)
});

function init(database){
    console.log(database)
}
module.exports = {}


