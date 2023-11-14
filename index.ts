import * as fs from "fs";
import * as cheerio from 'cheerio';
import { exit } from "process";



function readFile():string[]{
  try {
    const vocab = fs.readFileSync("./vocab.txt", { encoding: "utf-8" });
    
    return vocab.split("\n");
  } catch {
    console.log("Provide word list in file vocab.txt")
    fs.writeFileSync('./vocab.txt',"Replace this text with your wordlist with each word separated by new line");
    exit(1);
    
  }
}

async function webScraper(arrVocab: string[]){
  const promises =  arrVocab.map(async (word) => {
    const response = await fetch(`https://www.thesaurus.com/browse/${word}`);
    const html = await response.text();
    const $ = await cheerio.load(html);
    const sections = await $('section[data-type=thesaurus-synonyms-card]');
    const list = await sections.children('ul').children('li');
    const arr = await list.toArray().map((e) => $(e).text());
    return arr;
  });

  const result = await Promise.all(promises);
  let concat = [];
  for(let i=0; i<arrVocab.length; i++){
    concat[i]=[arrVocab[i],result[i]]
  }

  return concat
 
}

async function saveFile() {

  const arrSynonyms = await webScraper(readFile())

  fs.writeFileSync('./synonyms.txt', "")

  for(let i=0; i<arrSynonyms.length; i++){
    console.log(`${arrSynonyms[i][0]} appended`)
    fs.appendFileSync('./synonyms.txt',`${arrSynonyms[i][0]}: ${arrSynonyms[i][1]} \n`)
  }
  
}

saveFile();






