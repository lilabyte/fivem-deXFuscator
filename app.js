const chalk = require("chalk")
const decoder = require("./modules/decoder")
const initializer = require("./modules/initializer")

console.clear()

if (process.argv.slice(2).length > 0) {
    var command = process.argv.slice(2)[0]
    var args = process.argv.slice(3);
    if (command == "decode") {
        initializer.Initialize((cb) => {
            decoder.Decode(args[1], args[0])
        })
    } else if (command == "help") {
        console.log("Usage: byte_decoder decode <type> <file>")
        console.log("Commands:")
        console.log(chalk.yellow.bold("   decode <type> <file>"))
        console.log(chalk.yellow.bold("   help"))
    } else {
        console.log(chalk.red.bold("You didn't passed any command!\n") + chalk.yellow.bold("Use: byte_decoder help"))
    }
} else {
    console.log(chalk.red.bold("You didn't passed any command!\n") + chalk.yellow.bold("Use: byte_decoder help"))
}
