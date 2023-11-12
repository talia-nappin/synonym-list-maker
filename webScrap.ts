
import * as cheerio from 'cheerio';



function webScraper(arrVocab: string[]){
    arrVocab.forEach(async word => {
      let response = await fetch(`https://www.thesaurus.com/browse/${word}`)
      let html = await response.text();
      
      const $ = await cheerio.load(html)
    
      let sections = $('section[data-type=thesaurus-synonyms-card]')


      let list  = sections.children('ul').children('li');
      let arr = list.toArray().map(e => $(e).text())

      console.log(arr)

      
      


      
    })
  }

  webScraper(['restlessness', 'sly'])