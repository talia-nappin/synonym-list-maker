import * as fs from "fs";
import * as cheerio from 'cheerio';
import { exit } from "process";



const readFile = (): string[] =>{
  try {
    const vocab = fs.readFileSync("./vocab.txt", { encoding: "utf-8" });

    if(!vocab) throw new Error();

    

    vocab.split(" ").join("\n")
    
    return vocab.split("\n");
  } catch {
    console.log("Provide word list in file vocab.txt")
    fs.writeFileSync('./vocab.txt',"Replace this text with your wordlist with each word separated by new line");
    exit(1);
    
  }
}

const webScraper = async (arrVocab: string[]) => {
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

const saveFile = async (): Promise<void>  => {

  const arrSynonyms = await webScraper(readFile())

  fs.writeFileSync('./synonyms.txt', "")

  for(let i=0; i<arrSynonyms.length; i++){
    
    fs.appendFileSync('./synonyms.txt',`${arrSynonyms[i][0]}: ${arrSynonyms[i][1] != "" ? arrSynonyms[i][1] : "No synonyms found"}\n`)
  }
  

  console.log("Synonyms are located in synonyms.txt")
  
}

saveFile();






