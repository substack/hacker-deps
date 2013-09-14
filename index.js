var walk = require('walk-fs');
var path = require('path');
var fs = require('fs');

var withDeps = require('./lib/deps.js');

module.exports = function (opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (!opts) opts = {};
    
    var res = {};
    withDeps(function (err, deps) {
        if (err) return cb(err)
        res.deps = deps;
        done();
    });
    
    walkDeps(opts, function (err, hackers) {
        if (err) cb(err)
        res.hackers = hackers;
        done();
    });
    
    var pending = 2;
    function done () {
        if (--pending !== 0) return;
        
    }
};

function walkDeps (opts, cb) {
    var hackers = {};
    walk(opts.root, function (file, stats) {
        if (!stats.isDirectory()
        && path.basename(file) === 'package.json') {
            fs.readFile(file, function (err, src) {
                if (err) return;
                try { var pkg = JSON.parse(src) }
                catch (err) {}
                
                //hackers[pkg.author]
                
                console.log(pkg);
            });
        }
    }, function () {});
}
