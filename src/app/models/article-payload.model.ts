import { Category } from '../enums/category.enum';
import { Service } from '../enums/service.enum';


export class ArticlePayload {
    category: Category;
    articles: any;
    service: Service;
  }
