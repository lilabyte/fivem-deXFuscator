const fs = require('fs');
const chalk = require(`chalk`);
const deobfuscator = require(`./modules/deobfuscator`);

(async function() {
    if (process.argv.slice(2).length > 0) {
        let command = process.argv.slice(2)[0].toLowerCase();
        let args = process.argv.slice(3);

        if (command == `deobfuscate`) {
            let filePath = args[0];

            if (!filePath || !filePath.length > 0) {
                console.log(chalk.red.bold(`You didn't passed any file to deobfuscate.`));
                return;
            }

            if (fs.existsSync(filePath)) {
                if (filePath.split(`.`).pop() == 'lua') {
                    deobfuscator.run(filePath);
                } else {
                    console.log(chalk.red.bold(`FiveM DeXFuscator only supports .lua files.`))
                }
            } else {
                console.log(chalk.red.bold(`Couldn't find ${filePath}`));
            }
        } else if (command == `help`) {
            console.log(`Usage: fivem_dexfuscator deobfuscate <file>`)
            console.log(`Commands:`)
            console.log(chalk.yellow.bold(`   dobfuscate <file>`))
            console.log(chalk.yellow.bold(`   help`))
        } else {
            console.log(chalk.red.bold(`You used a command that doesn't exist.\n`) + chalk.yellow.bold(`Use: fivem_dexfuscator help`));
        }
    } else {
        console.log(chalk.red.bold(`You didn't used any command.\n`) + chalk.yellow.bold(`Use: fivem_dexfuscator help`));
    }
})();