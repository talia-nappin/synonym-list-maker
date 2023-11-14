import * as fs from "fs";



function readFile():string[]{
  try {
    const vocab = fs.readFileSync("./vocab.txt", { encoding: "utf-8" });
    
    return vocab.split("\n");
  } catch (err) {
    
    console.error("You need to provide a word list in vocab.txt file")
   throw new Error
  }
}

const arrVocab = (wordlist: string ) => wordlist.split("\n");


console.log(arrVocab(readFile()));