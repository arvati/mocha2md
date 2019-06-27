require('dotenv').config({path: './test/.env'});
const Mocha = require('mocha');
const fsp = require('fs').promises;
const path = require('path');

var testDir = "./test/"
var argFiles = [];
var init = process.argv.length;
for (var i=0; i<process.argv.length; i++) {
    if (process.argv[i] === __filename) init = i
    if (i > init) argFiles.push(path.join(testDir,process.argv[i]))
}

//force testing one file
//argFiles = ["test/keys.js"]

if (argFiles.length > 0) console.info('Selected files to test: ' + argFiles.join(', '))
else console.info('Will test files from dir: ' + testDir)

// link = https://github.com/mochajs/mocha/wiki/Third-party-reporters
var mocha = new Mocha({reporter:'Spec'});
fsp.readdir(testDir)
.then((files) => {
    files.filter((file) => path.extname(file) === '.js')
    .forEach( (file) => { 
        if ((argFiles.length > 0 && argFiles.includes(path.join(testDir, file))) || argFiles.length == 0) 
            return mocha.addFile(path.join(testDir, file)) 
    })
    mocha.run((failures) => process.exitCode = (failures) ? 1 : 0)
})
