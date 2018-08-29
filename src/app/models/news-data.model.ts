import { Article } from './article.model';

export class NewsDataModel {
    retrieving: boolean;
    page: number;
    firstLoadComplete: boolean;
    clientDataLoaded: boolean;
    articles: Article[];
  }
