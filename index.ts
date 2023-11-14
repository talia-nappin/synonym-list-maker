import * as fs from "fs";

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

const arrVocab = (wordlist: string ) => wordlist.split("\n");


