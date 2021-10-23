const chalk = require("chalk")
const fs = require("fs")

function deobfuscate(code) {
    return new Promise(function (resolve, reject) {
        let patterns = [
            `local __ =`,
            `local ____________________________________________________________________________________________________ =`,
            `XFU5K470R 15 4W350M3. KR3D17 70 XFU5K470R!"}`
        ]; // Yes they really used same local variables name and lenghts to assign whole code in different files and allways in the same position. As I know the "newer versions" (modified versions because last original was made in 2013) of xFuscator does it better but still it's pretty easy to deobfuscate.
        let foundRightDivider = false;
        let divider = 1;
        let obfuscatedArray = code.substring((code.indexOf(patterns[0]) >= 0) ? code.indexOf(patterns[0]) + patterns[0].length : code.indexOf(patterns[1]) + patterns[1].length).trim(); // Spots the start of the obfuscated code table
        obfuscatedArray = obfuscatedArray.substring(0, obfuscatedArray.indexOf(`}`) + 1); // Spots the end of the obfuscated code table
        obfuscatedArray = obfuscatedArray.replace(`, }`, `}`);
        obfuscatedArray = JSON.parse(obfuscatedArray.replace(`{`, `[`).replace(`}`, `]`).replace(/(_|\(|\))/g, ``)); // Transforms the code table into JSON and then into array
        
        while (!foundRightDivider) {
            let deobfuscated = obfuscatedArray.map(function (char) {
                return String.fromCharCode(char/divider);
            }).join('').replace(/[^A-Za-z 0-9 \s\.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '');

            if (deobfuscated.includes(`local`)) {
                let variablesTableName = deobfuscated.substring(deobfuscated.indexOf(`local `) + 6).trim(); // Cuts to the start of strings table name
                variablesTableName = variablesTableName.substring(0, variablesTableName.indexOf(`={`)).trim(); // Cuts at the end of strings table name

                deobfuscated.match(/\".*?\"/g).forEach(function (string, index) {
                    let deobfuscatedString = string.replace(/\"/g, ``).split(`\\`).map(function (character) {
                        if (!character) return;
                        return String.fromCharCode(character);
                    }).join('');

                    deobfuscated = deobfuscated.replace(string, `"${deobfuscatedString}"`);
                }); // Makes the deobfuscated strings array out of the obfuscated variables table used by xFuscator and replaces obfuscated strings with deobfuscated ones

                let variablesArray = deobfuscated.substring(deobfuscated.indexOf(`local ${variablesTableName}={`) + 6 + variablesTableName.length + 2, deobfuscated.indexOf(patterns[2]) + patterns[2].length-1); // Gets the variables table as a string from the deobfuscated code. This table only holds values which are not functiosn and tables so this is pretty easy to spot.
                
                variablesArray.match(/\".*?\"/g).forEach(function (string, index) {
                    if (!string) return;

                    variablesArray = variablesArray.replace(string, string.replace(/\[/g, `%tbo%`).replace(/\]/g, `%tbc%`).replace(/\\/g, `\\\\`));
                }); // Prepares string values with [] to not be replaced in next step

                variablesArray = JSON.parse(`{${variablesArray.replace(/\b(nil)\b/g, `null`).replace(/(\[|\])/g, `"`).replace(/=/g, `:`).replace(/%tbo%/g, `[`).replace(/%tbc%/g, `]`)}}`); // Transforms the variables table into JSON and then into object

                deobfuscated.match(new RegExp(`(${variablesTableName}\\[\\d+\\])`, `g`)).forEach(function (variableCall) {
                    let variableIndex = parseInt(variableCall.match(/(\d+)/g).pop());
                    let variableValue = variablesArray[variableIndex];
                    if (typeof variableValue == `string`) {
                        variableValue = `"${variableValue}"`;
                    }

                    deobfuscated = deobfuscated.replace(variableCall, `${(variableValue != null) ? variableValue : `nil`}`);
                });

                deobfuscated = deobfuscated.replace(`LuaQ`, ``); // In some xFuscator versions this needs to be removed
                deobfuscated = deobfuscated.replace(patterns[2].substring(0, patterns[2].length - 2), `https://github.com/lilabyte/fivem-deXFuscator`);
                resolve(deobfuscated);
                foundRightDivider = true;
            }

            divider += 1;
        }
    });
}

exports.run = async function(filePath) {
    console.log(chalk.yellow.bold(`Doing some magic shit which may not work for your xFuscator version lmao`));
    console.log(chalk.yellow.bold(`Anyways you shouldn't use this package! I only remastered it because I cried myself when I saw my old code.`));
    console.log(chalk.yellow.bold(`If you need something that will 100% work for any obfuscation method go to someone who is into reverse engineering.`));
    console.log(chalk.yellow.bold(`But don't message me, I don't have time for this.`));

    let code = fs.readFileSync(filePath, `utf-8`);
    let deobfuscated = await deobfuscate(code);
    let fileName = filePath.match(/[^\\/]+(\.+)?$/gim)[0];

    if (!fs.existsSync(`./deobfuscated`)) fs.mkdirSync(`./deobfuscated`);

    fs.writeFileSync(`./deobfuscated/${fileName}`, deobfuscated);
    console.log(chalk.green.bold(`Saved deobfuscated file into `) + chalk.yellow.bold(`./deobfuscated/${fileName}`));
}