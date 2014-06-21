again.js
========

[![Build Status](https://travis-ci.org/theborakompanioni/againjs.svg?branch=master)](https://travis-ci.org/theborakompanioni/againjs)

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
...
```

### License

The MIT License (MIT)

Copyright (c) 2014 theborakompanioni

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
