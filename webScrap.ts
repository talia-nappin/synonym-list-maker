
import * as cheerio from 'cheerio';



export default async function webScraper(arrVocab: string[]): Promise<string[][]> {
  const promises = arrVocab.map(async (word) => {
    const response = await fetch(`https://www.thesaurus.com/browse/${word}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const sections = $('section[data-type=thesaurus-synonyms-card]');
    const list = sections.children('ul').children('li');
    const arr = list.toArray().map((e) => $(e).text());
    return arr;
  });

  const result = await Promise.all(promises);
  return result;
}
 