var walk = require('findit');
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
        if (err) return cb(err)
        res.hackers = hackers;
        done();
    });
    
    var pending = 2;
    function done () {
        if (--pending !== 0) return;
        cb(null, Object.keys(res.hackers).reduce(function (acc, key) {
            acc[key] = Object.keys(res.hackers[key]);
            return acc;
        }, {}));
    }
};

function walkDeps (opts, cb) {
    var hackers = {};
    var finder = walk.find(opts.root);
    var pending = 0, done = false;
    
    finder.on('file', function (file, stats) {
        if (path.basename(file) !== 'package.json') return;
        pending ++;
        fs.readFile(file, function (err, src) {
            pending --;
            if (err) next();
            
            try { var pkg = JSON.parse(src) }
            catch (err) { next() }
            
            if (!pkg || !pkg.name || pkg.private) next();
            var author = authorOf(pkg);
            if (!hackers[author]) hackers[author] = {};
            hackers[author][pkg.name] = true;
            
            function next () {
                if (done && pending == 0) cb(null, hackers);
            }
        });
    });
    finder.on('end', function () {
        done = true;
        if (pending === 0) cb(null, hackers);
    });
}

function authorOf (pkg) {
    var author;
    if (typeof pkg.author === 'object') {
        author = pkg.author.name || pkg.author.email;
    }
    else if (typeof pkg.author === 'string') {
        author = pkg.author;
    }
    if (!author && pkg.author) {
        author = JSON.stringify(pkg.author);
    }
    if (!author && pkg.repository && pkg.repository.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.repository.url);
        author = m && m[1];
    }
    if (!author && pkg.bugs && pkg.bugs.url) {
        var m = /\bgithub.com\/([^\/]+)/.exec(pkg.bugs.url);
        author = m && m[1];
    }
    return author;
}
