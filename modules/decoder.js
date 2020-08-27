const chalk = require("chalk")
const fs = require("fs")
const decode_types = ["xfuscator"]
const decode_ext = ["lua"]

async function DecodeXfuscator(file, cb) {
    var pattern = "local __ ="
    var pattern1 = "local ____________________________________________________________________________________________________ ="
    var pattern2 = " local _____"
    var pattern3 = "local __ = "
    file = file.substring(file.indexOf(pattern) || file.indexOf(pattern1))
    if (file.indexOf(pattern2) != -1) {
        file = file.substring(0, file.indexOf(pattern2))
    }
    if (file.indexOf(pattern3) != -1) {
        file = file.replace(pattern3, '')
    }
    file = file.replace(', }', '}')
    file = file.replace('{', '[')
    file = file.replace('}', ']')
    file = file.split('_').join('')
    file = file.split('(').join('')
    file = file.split(')').join('')
    array = JSON.parse(file)
    var format = /[^\x00-\x7F]/
    for (v = 1; v <= 1100; v+=1) {
        var str = ''
        array.forEach((item, index, array) => {
            str = str + `${String.fromCharCode(item/v)}`
            if (index == array.length-1) {
                str = str.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
                if (str.includes('local')) {
                    str = str.split(`'`).join('"')
                    strings = `[`+str.match(/\".*?\"/g)+`]`
                    strings = strings.split("\\").join("||")
                    s_array = JSON.parse(strings)
                    s_array.forEach((item, index, array) => {
                        var test = `[`+item.split('||')+`]`
                        if (test.charAt(1) == ",") {
                        test = test.substring(0, 2-1) + test.substring(2, test.length)
                        }
                        var letters = /^[A-Za-z]+$/;
                        if (test.match(letters)) return;
                        var test_array = JSON.parse(test)
                        s_array[index] = ''
                        var original = ''
                        test_array.forEach((item2, index2, array2) => {
                            original = original + `\\${item2}`
                            s_array[index] = s_array[index] + `${String.fromCharCode(item2)}`
                            if (index2 == test_array.length-1) {
                                str = str.replace(original, s_array[index].split('[').join('!BYTE!BOPEN!BYTE!').split(']').join('!BYTE!BCLOSE!BYTE!'))
                            }
                        })
                        if (index == s_array.length-1) {
                            var wstr = str
                            var pattern4 = "local "
                            var pattern5 = "={["
                            wstr = wstr.substring(wstr.indexOf(pattern4)+6)
                            wstr = wstr.substring(0, wstr.indexOf(pattern5))
                            var nazwa_tabeli = wstr
                            var pattern6 = `"}`
                            var wstr2 = str
                            wstr2 = wstr2.substring(wstr2.indexOf(pattern5)+1)
                            wstr2 = wstr2.substring(0, wstr2.indexOf(pattern6)+2)
                            wstr2 = wstr2.split('[').join('"').split(']').join('"')
                            wstr2 = wstr2.split('=').join(':')
                            wstr2 = wstr2.split('nil').join('"!BYTE!nil!BYTE!"')
                            wstr2 = wstr2.split('\\').join('!BYTE!1!BYTE!')
                            var variables = JSON.parse(wstr2)
                            for (x = 0; x <= Object.keys(variables).length; x++) {
                                if (typeof variables[x] == 'string') {
                                        str = str.split(`${nazwa_tabeli}[${x}]`).join(` "${variables[x]}" `)
                                } else {
                                str = str.split(`${nazwa_tabeli}[${x}]`).join(` ${variables[x]} `)
                                }
                                if (x == Object.keys(variables).length) {
                                    str = str.split('"!BYTE!nil!BYTE!"').join('nil')
                                    str = str.split('!BYTE!1!BYTE!').join('\\')
                                    str = str.split('!BYTE!BOPEN!BYTE!').join('[')
                                    str = str.split('!BYTE!BCLOSE!BYTE!').join(']')
                                    if (str.includes('LuaQ')) {
                                        str = str.split('LuaQ').join('')
                                    } 
                                    str = str.split("XFU5K470R 15 4W350M3. KR3D17 70 XFU5K470R!").join('LOOK AT MY WRIST CORONA, MY NECK GOT EBOLA. CREDITS TO BYTE-DECODER!')
                                    cb(`--[[DECODED WITH BYTE-DECODER]]\n`+str)
                                }
                            }
                        }
                    })
                }
            }
        })
    }
}

exports.Decode = function(file, type) {
    if (type && decode_types.some(t => t == type)) {
        if (file && decode_ext.some(ext => file.includes(ext)) && fs.existsSync(`./queue/${file}`)) {
            if (type == "xfuscator") {
                let code = fs.readFileSync(`./queue/${file}`, "utf-8")
                console.log(chalk.yellow.bold(`Doing some magic shit for ${file} obfuscated with ${type}...`));
                DecodeXfuscator(code, (deobfuscated) => {
                    fs.writeFileSync(`./deobfuscated/deobfuscated_${file}`, deobfuscated) 
                    fs.writeFileSync(`./original/original_${file}`, code)
                    console.log(chalk.green.bold("Saved deobfuscated file..."))
                })
            }
        } else { 
            console.log(chalk.red.bold("You didn't passed any file or our file extension is unsupported!")), console.log(chalk.yellow.bold("Also make sure that your file is inside queue directory."));
        }
    } else {
        console.log(chalk.red.bold("You didn't passed any type or your type is unsuppoted!"))
    }
};