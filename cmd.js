var hdeps = require('./index.js');
var argv = require('optimist').argv;

var root = argv.d || argv._[0] || process.cwd();

hdeps({ root: root, debug: debug }, function (err, hackers) {
    if (err) return console.error(err);
    hackers.forEach(function (hacker) {
        console.log(hacker.name)
        console.log('  ' + hacker.packages.join(', '));
    });
});

function debug (msg) {
    if (argv.debug) console.warn(msg);
}
