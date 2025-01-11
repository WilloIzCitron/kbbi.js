const puppeteer = require('puppeteer');
const { parse } = require('node-html-parser');
const cheerio = require('cheerio');

async function cari(keyword) {
    if(!keyword) throw new Error('Please provide any keyword to find!');
    const $ = await cheerio.fromURL(`https://kbbi.kemdikbud.go.id/entri/${keyword}`)

    const root = parse($.html());
    const lema = root.querySelector('h2').text;
    let arti = root.querySelectorAll('ol li').map(x => x.text.slice(1).split("  ").join(""));
    if (arti.length === 0) {
        const artiAlt = root.querySelectorAll('ul.adjusted-par').map(x => x.text.slice(1).split("  ").join(""));
        arti = artiAlt;
    }
    
    if (arti.length === 0) {
        return { lema: null, arti: null};
    }
    return { lema, arti};
}

cari('dilema').then(console.log)

module.exports = { cari };