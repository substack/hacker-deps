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
        var hackers = Object.keys(res.hackers).map(function (key) {
            return res.hackers[key];
        });
        cb(null, hackers)
    }
};

function walkDeps (opts, cb) {
    var hackers = {};
    var finder = walk.find(opts.root);
    var pending = 0, done = false;
    
    finder.on('file', function (file, stats) {
        if (/(^|\/)\b\.git\b/.test(file)) return;
        if (path.basename(file) !== 'package.json') return;
        var parts = path.relative(opts.root, file).split('/');
        var distance = -1;
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] === 'node_modules') distance ++;
        }
        distance = Math.max(0, distance);
        
        pending ++;
        fs.readFile(file, function (err, src) {
            pending --;
            if (err) next();
            
            try { var pkg = JSON.parse(src) }
            catch (err) { next() }
            
            if (!pkg || !pkg.name || pkg.private) return next();
            
            var author = authorOf(pkg);
            var h = hackers[author];
            if (!h) {
                h = hackers[author] = {
                    packages: {},
                };
                if (pkg.author && pkg.author.name) {
                    h.name = pkg.author.name;
                }
                else h.name = author;
                
                if (pkg.author && pkg.author.email) {
                    h.email = pkg.author.email;
                }
            }
            if (!h.packages[pkg.name]) h.packages[pkg.name] = 0;
            h.packages[pkg.name] += distance ? 1 / (2 * distance) : 1;
            
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
        author = pkg.author.replace(/\s*<.*/, '');
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
    if (author) author = author.replace(/^['"]|['"]$/g, '');
    return author;
}
