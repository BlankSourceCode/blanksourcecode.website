---
title: Syntax Highlighting
topics: [general]
date: 2019-02-25
---

Let's see if my build pipeline correctly highlights code syntax.

Here is my first attempt by using metalsmith-markdown and highlight.js:
```javascript
.use(markdown({
    highlight: (code) => {
        return require('highlight.js').highlightAuto(code).value;
    },
}))
```

Unfortunately that didn't seem to give me very good results, so I tried using metalsmith-prism which seemed to do a much better job:
```javascript
.use(markdown({
    langPrefix: 'language-',
}))
.use(prism())
```

That's the version that I ended up going with. And you can see the results on this page.