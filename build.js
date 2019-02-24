'use strict';

const beautify = require('metalsmith-beautify');
const browserSync = require('browser-sync');
const collections = require('metalsmith-collections');
const dateFormatter = require('metalsmith-date-formatter');
const excerpts = require('metalsmith-excerpts');
const markdown = require('metalsmith-markdown');
const metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const pager = require('metalsmith-pager');
const permalinks = require('metalsmith-permalinks');
const sass = require('metalsmith-sass');
const sitemap = require('metalsmith-sitemap');
const copyProp = require('./src/libs/metalsmith-copy-prop');
const topics = require('./src/libs/metalsmith-topics');

const config = {
    mainMenu:
    {
        Home: '/',
        Topics: '/topics',
        About: '/about',
    },
};

function build(callback) {
    metalsmith(__dirname)
        .metadata(config)
        .clean(true)
        .source('./src')
        .destination('./out')
        .ignore([
            'libs',
            'templates',
            '**/src/css/!(styles.scss)',
        ])
        .use(collections({
            posts: {
                pattern: 'posts/*.md',
                sortBy: 'date',
                reverse: true,
            },
            menus: {
                pattern: 'pages/*.md',
            },
        }))
        .use(pager({
            collection: 'posts',
            elementsPerPage: 1,
            pagePattern: 'pages/:PAGE/index.html',
            index: 'index.html',
            paginationTemplatePath: 'templates/pager.html',
            layoutName: 'index.njk',
        }))
        .use(markdown())
        .use(copyProp({
            from: 'contents',
            to: 'initialContents',
            pattern: 'posts/*.html',
        }))
        .use(excerpts())
        .use(sass({
            outputDir: 'css/',
        }))
        .use(permalinks({
            relative: false,
            pattern: ':title',
            linksets: [
                {
                    match: { collection: 'posts' },
                    pattern: 'posts/:date/:title',
                },
                {
                    match: { collection: 'menus' },
                    pattern: ':title',
                },
            ],
        }))
        .use(copyProp({
            from: 'date',
            to: 'rawDate',
            pattern: 'posts/*.html',
        }))
        .use(dateFormatter({
            dates: [
                {
                    key: 'date',
                    format: 'ddd, MMMM Do YYYY',
                },
            ],
        }))
        .use(topics({
            sort: 'rawDate',
        }))
        .use(layouts({
            directory: './src/templates',
            pattern: '**/*.html',
            default: 'page.njk',
        }))
        .use(beautify())
        .use(sitemap({
            hostname: 'https://blanksourcecode.com',
        }))
        .build((err) => {
            const message = err || 'Build complete';
            console.log(message);
            callback();
        });
}

const args = process.argv.slice(2);
if (args.length) {
    browserSync({
        server: 'out',
        files: ['src/**/*.*'],
        middleware: (req, res, next) => {
            build(next);
        },
    });
} else {
    build(() => {
    });
}
