import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {

  articles: Article[];
  @Input() category: string;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.getNews();
  }

  onSelect(article: Article): void {
  }

  getNews(): void {
    this.newsService.getNews(this.category)
        .subscribe(news => {
          // const filterWords = ['trump'];

          this.articles = news.filter(article => article.description
            ? article.description.toLowerCase().indexOf('trump') === -1
            : false)
            .filter(article => article.title
            ? article.title.toLowerCase().indexOf('trump') === -1
            : false);
        });
  }
}


