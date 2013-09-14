var fs = require('fs');
var path = require('path');
var hyperquest = require('hyperquest');

var u = 'http://registry.npmjs.org/-/_view/dependedUpon?group_level=1';
var depsfile = path.join(__dirname, '../data/deps.json');

exports = module.exports = function (opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    if (!opts) opts = {};
    if (!opts.maxAge) opts.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
    if (!opts.since) opts.since = Date.now() - opts.maxAge;
    stale(opts.since, function (err, isStale) {
        if (err) return cb(err);
        if (!isStale) return load(cb);
        
        var t0 = Date.now();
        if (opts.debug === 'function') {
            opts.debug('fetching the dependency list');
        }
        fetch(function (err) {
            if (err) return cb(err)
            var elapsed = Date.now() - t0;
            if (opts.debug) opts.debug(
                'downloaded the dependency list [' + elapsed + 'ms]'
            );
            load(cb);
        });
    });
};

exports.load = load;
function load (cb) {
    fs.readFile(depsfile, function (err, src) {
        if (err) return cb(err)
        try { var deps = JSON.parse(src) }
        catch (e) { return cb(e) }
        cb(null, deps);
    });
}

exports.stale = stale;
function stale (since, cb) {
    fs.stat(depsfile, function (err, stat) {
        if (err && err.code === 'ENOENT') cb(null, true)
        else if (err) cb(err)
        else cb(null, since > stat.mtime.valueOf())
    });
}

exports.fetch = fetch;
function fetch () {
    var r = hyperquest(u);
    r.pipe(fs.createWriteStream(depsfile))
}
