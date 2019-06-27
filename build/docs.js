require('dotenv').config({path: './test/.env'});
const Mocha = require('mocha');
const jsdoc2md = require('jsdoc-to-markdown')
const mocha2md = require('./mocha2md')
const fsp = require('fs').promises;
const path = require('path');

const frontmatter = 
`---
layout: default
title: Test Results
nav_order: 3
permalink: /tests
---
`
// link = https://github.com/mochajs/mocha/wiki/Third-party-reporters
var mocha = new Mocha({
    reporter: mocha2md,
    reporterOptions: {
        quiet:true, 
        title:"Unit Test Results", 
        toc:'kramdown', 
        filename:'tests.md',
        prepend: frontmatter
    }
});
const testDir = "./test/"
fsp.readdir(testDir)
.then((files) => files.filter((file) => path.extname(file) === '.js')
    .forEach( (file) => mocha.addFile(path.join(testDir, file)))
)
.then( () => new Promise((resolve,reject) => {
        var suiteRun = mocha.run( (failures) => resolve(failures,suiteRun.markdown))
}))
.then((markdown) => console.log('Resulted markdown could be used here'))
.catch((err) => console.log)

// docs file
const prepend = 
`---
layout: default
title: API
nav_order: 2
permalink: /docs
---
`
const docFile = './docs/docs.md'
jsdoc2md.render({files: './lib/*.js'})
.then((rendered) => fsp.writeFile(docFile, prepend + '\n' + rendered))
.then(console.info('doc file created at ' + docFile))
