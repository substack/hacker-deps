var hdeps = require('./index.js');
var argv = require('optimist')
    .boolean(['modules','verbose'])
    .alias({ m: 'modules', v: 'verbose' })
    .argv
;
var table = require('text-table');
var root = argv.d || argv._[0] || process.cwd();

process.stdout.on('error', function () {}); // EPIPE

hdeps(root, function (err, hackers) {
    if (err) return console.error(err);
    
    if (argv.modules) {
        var modules = [];
        var total = 0;
        
        hackers.forEach(function (hacker) {
            Object.keys(hacker.packages).forEach(function (key) {
                var score = hacker.packages[key];
                modules.push({
                    name: key,
                    score: score,
                    hacker: hacker
                });
                total += score;
            });
        });
        
        console.log(table(
            modules.sort(sorter).map(mapper),
            { align: [ 'l', '.', 'l' ] }
        ));
        function sorter (a, b) { return a.score < b.score ? 1 : -1 }
        function mapper (m) {
            var score = String(Math.floor(100 * m.score / total * 10) / 10);
            if (!/\.\d$/.test(score)) score += '.0';
            
            return [
                m.name,
                score + ' %',
                String(m.hacker.name)
                + (m.hacker.github ? ' (' + m.hacker.github + ')' : '')
            ];
        }
    }
    else {
        hackers.forEach(function (hacker) {
            var percent = String(Math.floor(hacker.score * 100 * 10) / 10);
            if (!/\.\d$/.test(percent)) percent += '.0';
            percent = Array(6 - percent.length).join(' ') + percent;
            
            console.log(percent + '%    ' + hacker.name
                + (hacker.github ? ' (' + hacker.github + ')' : '')
            );
            if (argv.verbose) {
                var packages = [];
                var keys = Object.keys(hacker.packages);
                for (var i = 0; i < keys.length; i += 4) {
                    packages.push(keys.slice(i, i + 4));
                }
                console.log('\n' + table(packages)
                    .split('\n')
                    .map(function (line) {
                        return '    ' + line;
                    })
                    .join('\n')
                    + '\n'
                );
            }
        });
    }
});
