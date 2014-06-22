again.js
========

[![Build Status](https://travis-ci.org/theborakompanioni/againjs.svg?branch=master)](https://travis-ci.org/theborakompanioni/againjs)
[![Coverage Status](https://img.shields.io/coveralls/theborakompanioni/againjs.svg)](https://coveralls.io/r/theborakompanioni/againjs?branch=master)
[![Dependency Status](http://img.shields.io/badge/dependencies-Vanilla_JS-brightgreen.svg)](http://vanilla-js.com/)
[![devDependency Status](https://david-dm.org/theborakompanioni/againjs/dev-status.svg)](https://david-dm.org/theborakompanioni/againjs#info=devDependencies)

A "poll-me-maybe" JavaScript library

### How to use


```javascript
var again = Again.create({
    ...
});

again.every(function() { 
    console.log(again.state());
}, {
    'visible': 1000,
    'hidden' : 5000
});

again.update('visible');

setTimeout(function() {
    again.update('hidden');
}, 3000);

setTimeout(function() {
    again.update('visible');
}, 20000);
```

```
1000 : visible
2000 : visible
3000 : visible
8000 : hidden
13000: hidden
18000: hidden
21000: visible
22000: visible
23000: visible
...
```

### License

MIT License