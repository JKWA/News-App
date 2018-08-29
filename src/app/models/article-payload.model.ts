import { NewsSection } from '../enums/news-section.enum';
import { Service } from '../enums/service.enum';


export class ArticlePayload {
    newsSection: NewsSection;
    articles: any;
    service: Service;
  }
