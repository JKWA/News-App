import { Article } from './article.model';

export class NewsCategory {
    retrieving: boolean;
    page: number;
    firstLoadComplete: boolean;
    clientDataLoaded: boolean;
    articles: Article[];
  }
