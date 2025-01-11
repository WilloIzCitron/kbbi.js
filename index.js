const { parse } = require('node-html-parser');
const got = require('got');

const options = {
    headers:{
        'User-Agent': process.env.USERAGENT || ''
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

module.exports = { cari };