import { Article } from './article';

export class NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

