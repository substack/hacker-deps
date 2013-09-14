var hdeps = require('./index.js');
var argv = require('optimist').argv;

var root = argv.d || argv._[0] || process.cwd();

hdeps({ root: root, debug: debug }, function (err, hackers) {
    if (err) return console.error(err);
    hackers.forEach(function (hacker) {
        console.log(hacker.name)
        Object.keys(hacker.packages).forEach(function (key) {
            console.log('  ' + key + ': ' + hacker.packages[key]);
        });
    });
});

function debug (msg) {
    if (argv.debug) console.warn(msg);
}
