# hacker-deps

Print out which hackers your application depends on.

# example

For a quick list of hackers, just do `hacker-deps $APP_ROOT`:

```
$ hacker-deps ~/projects/substack.net
 42.7%    James Halliday
 14.5%    Dominic Tarr
  6.9%    Raynos
  5.0%    undefined
  4.5%    Isaac Z. Schlueter
  2.7%    Joshua Holbrook
  2.1%    Max Ogden
  1.9%    ariya
  1.8%    ForbesLindesay
  1.8%    johnny
  1.7%    Tim Caswell
  1.6%    Constellation
  1.3%    Thorsten Lorenz
  1.3%    Robert Kieffer
  1.3%    Roman Shtylman
  1.2%    TJ Holowaychuk
  1.2%    Nick Fitzgerald
  0.9%    Christopher Jeffrey
  0.9%    Alex Gorbatchev
  0.9%    James Burke
  0.7%    Julian Gruber
  0.4%    Mathias Bynens
  0.4%    mishoo
  0.4%    Brian J. Brennan
  0.4%    Romain Beauxis
  0.3%    T. Jameson Little
```

In this list the percentage is a normalized sum of all the packages in the
dependency graph weighted by distance so that first-order dependencies that your
application directly uses count more than the packages that your dependencies
use.

To supplement the list of hackers with lists of packages, add `--verbose`:

```
$ hacker-deps ~/projects/substack.net --verbose
 42.7%    James Halliday

    falafel          brfs                   http-browserify     resolve
    vm-browserify    browser-pack           commondir           astw
    lexical-scope    insert-module-globals  detective           module-deps
    wordwrap         optimist               parents             shell-quote
    syntax-error     browserify             deck                ent
    comandante       git-file               internet-timestamp  mkdirp
    ordered-emitter  duplex-pipe            http-duplex         pushover
    glog             hyperquest             hyperglue           hyperspace
    buffers          trumpet                baudio

 14.5%    Dominic Tarr

    through       JSONStream    crypto-browserify  from
    map-stream    pause-stream  split              stream-combiner
    event-stream

  6.9%    Raynos

    console-browserify  duplexer  class-list

  5.0%    undefined

    custom        skip  lexical-scope-test  indexof
    substack.net

  4.5%    Isaac Z. Schlueter

    inherits  sax
```

You can also print the list of modules ranked by module score with `--modules`:

```
$ hacker-deps --modules | head -n20
through                   8.1 %  Dominic Tarr
duplexer                  4.6 %  Raynos
ent                       4.5 %  James Halliday
inherits                  3.6 %  Isaac Z. Schlueter
JSONStream                3.0 %  Dominic Tarr
optimist                  3.0 %  James Halliday
ecstatic                  2.7 %  Joshua Holbrook
concat-stream             2.1 %  Max Ogden
esprima                   1.9 %  ariya
class-list                1.8 %  Raynos
webaudio                  1.8 %  johnny
trumpet                   1.8 %  James Halliday
hyperspace                1.8 %  James Halliday
browserify                1.8 %  James Halliday
deck                      1.8 %  James Halliday
hyperquest                1.8 %  James Halliday
baudio                    1.8 %  James Halliday
brfs                      1.8 %  James Halliday
glog                      1.8 %  James Halliday
substack.net              1.8 %  undefined
```

# usage

```
usage: hacker-deps OPTIONS

Print out the list of hackers your application depends on.

OPTIONS:

  --verbose  Include package lists for each hacker.
  --modules  Print each module instead of each hacker.

```

# install

With [npm](https://npmjs.org) do:

```
npm install -g hacker-deps
```

# license

MIT
