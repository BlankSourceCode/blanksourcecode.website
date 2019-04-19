---
title: Project pages
collection: projects
topics: [projects]
date: 2019-03-30
---

I've just updated my site with a new section all about projects! The way that it works in my build is via metalsmith-collections and metalsmith-pager.

First to identify that a post is going to be about a project (rather than some other topic) so that it will appear in my special 'Projects' page, I have to assign the post to a specific collection in some way so I can reference it later.

To do that I've use the following metadata in the post.md file:

```javascript
---
collection: projects
---
```

This works, because metalsmith-pager allows you to group posts via that 'collection' metadata when you don't use a pattern. This means my build.js looks a lot like this:

```javascript
.use(collections({
    posts: {
        pattern: 'posts/*.md',
        sortBy: 'date',
        reverse: true,
    },
    projects: {
        sortBy: 'date',
        reverse: true,
    }
}))
```

The first collection (called posts) uses a pattern to just pull all my md files from the posts folder. The new collection (projects) groups any *.md file that has the collection metadata that matches the name (aka 'projects'). This does have the unfortunate problem of no longer being isolated to the posts folder, but I just won't include the projects metadata in any other md file.

Once I have a collection, I just need to process it. Usually you can do this by just specifying the layout file in the post metadata, like:
```javascript
---
collection: projects
layout: topics.njk
---
```
But since I want to ensure that I paginate the posts if I end up having too many to fit on a single page, I instead use metalsmith-pager.
```javascript
.use(pager({
    collection: 'projects',
    elementsPerPage: 5,
    pagePattern: 'projects/pages/:PAGE/index.html',
    index: 'projects\\index.html',
    paginationTemplatePath: 'templates/pager.html',
    layoutName: 'projects.njk',
}))
```
Here it takes my new projects collection, and splits it into  5 posts per page. It then creates these html files using the 'projects.njk' template, and crams them in the 'projects/' out folder.

Hooray!

Now I have a way to tag certain posts to show only in my new 'Projects' view. The idea here being that I will use it to highlight my finished projects, such as Unity assets for sale, or any games I might end up publishing to the app store.

Stay tuned for more...
