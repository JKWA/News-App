class Source {
    id: string;
    name: string;
  }

export class Article {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    id: string;
  }

export class SavedArticle extends Article {
  timestamp: any;
  category: any;
  key: any;
}
