import { Article } from '../models/article';

export interface NewsCategory {
    retrieving: boolean;
    page: number;
    firstLoadComplete: boolean;
    clientDataLoaded: boolean;
    articles: Article[];
  }
