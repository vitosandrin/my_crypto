const mongoose = require("mongoose")

async function main() {
    await mongoose.connect("mongodb://localhost:27017/mycrypto")
    console.log('DataBase Connected!')
}

main().catch(err => console.log(err))

module.exports = mongoose