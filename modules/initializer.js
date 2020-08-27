const chalk = require("chalk")
const fs = require("fs")

exports.CheckDirectory = function(e) {
    return fs.existsSync(e) ? (console.log(chalk.green.bold(`"${e.slice(2)}" directory exists...`)), !0) : (fs.mkdirSync(e), console.log(chalk.yellow.bold(`"${e.slice(2)}" directory created...`)), !1)
} 

exports.Initialize = function(cb) {
    console.log(chalk.green.bold("Initialization..."))
    exports.CheckDirectory("./queue")
    exports.CheckDirectory("./deobfuscated")
    exports.CheckDirectory("./original")
    cb(true)
}