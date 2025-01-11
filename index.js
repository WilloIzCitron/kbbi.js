const { parse } = require('node-html-parser');
const got = require('got');
require('dotenv').config();

const options = {
    https2: false,
    method: "GET",
    responseType: "text",
    headers: {
        referer: "https://kbbi.kemdikbud.go.id/",
        'user-agent': process.env.USERAGENT || undefined
    }
};

async function cari(keyword) {
    if(!keyword) throw new Error('Please provide any keyword to find!');
    const res = await got.post(`https://kbbi.kemdikbud.go.id/entri/${keyword}`, options);
    const root = parse(res.body);
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
//temporary test for fetch headers
got('http://httpbin.org/headers', options).then(console.log)

module.exports = { cari };