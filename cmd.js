var hdeps = require('./index.js');
var argv = require('optimist').argv;

var root = argv.d || argv._[0] || process.cwd();

hdeps({ root: root, debug: debug }, function (err, hackers) {
    if (err) return console.error(err);
    console.dir(hackers);
});

function debug (msg) {
    if (argv.debug) console.warn(msg);
}
