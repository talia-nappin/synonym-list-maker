import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from "cheerio";

fs.writeFileSync('synonyms.txt',"", {'encoding':'utf-8','flag':'w'})

function ReadFile(filename: string) {
    const data = fs.readFileSync(path.join(__dirname, filename), 'utf8').toString().replace(/\r\n/g, '\n').split("\n");

    //console.log(data);

    /*for(let i of data)
        console.log(i);*/

    return data;
};

const vocab = ReadFile('vocab.txt')
/*function Synonym(word: string){
    let synonym = sjs.synonym(word);

    //console.log(synonym);

    return synonym;
};*/
let k = 0
let c = vocab.length
console.log(c)


const axiosInstance = axios.create()

for(let i=0; i < c; i++) {
    const w = vocab[i].replace("to ","").replace(" of", "").replace(" ", "%20")
    const url = `https://www.thesaurus.com/browse/${w}`
    axiosInstance.get(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const SynonymTable = $("#meanings > .css-ixatld.e15rdun50 > ul > li") 
            const synonyms: any[] = []
            SynonymTable.each((k, elem) => {
                const word: string = $(elem).find("a").text().replace(/(\r\n|\n\r)/gm, "").trim()
                synonyms.push({
                    word
                })
            })
            k++
            fs.writeFile('synonyms.txt',k + ". " + vocab[i] + " - " + synonyms[0].word.toString() + ", " + synonyms[1].word.toString() + "\n", {'encoding':'utf-8','flag':'a'}, (err) => {
                if (err) throw err;
              });
        })
    setTimeout(() => {
        console.log(((100/c)*(i+1)).toFixed(2) + "%")
    }, 200)
}
