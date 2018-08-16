 import { Article } from '../models/article';

 /**
   * Unduplicate articles by title, important to keep the article ids unique
   * @param articles - array of articles
   * @return articles - array of unduplicated articles
   */
  export function  removeDuplicateTitles(articles: Article[]): Article[] {
    const articleMap = new Map ();
    const deDupped = [];

    articles.map(article => articleMap.set(encodeURIComponent(article.title), article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
  }
