import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { NewsService } from '../news.service';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Filter, FilterStateModel, FilterState } from '../state/state.filter';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {

  articles: Article[];
  @Input() category: string;
  @Select(FilterState) listOfFilters: Observable<Set<string>>;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.getNews(this.listOfFilters);
  }

  onScroll () {
    console.log('scrolled!!');
    // this.getMovies()
  }

  getNews(filters): void {

    this.newsService.getNews(this.category)
      .subscribe(news => {
        filters.subscribe(result => {

          const allFilters: string[] = [];
          const regString = result.listOfFilters.forEach(filter => {
            allFilters.push(filter);
          });

          const regFilter = new RegExp(allFilters.join('|'), 'i');

          // news.map(art => {
          //   console.log(art.title.match(filterSring));
          // });

          this.articles = news.filter(article => article.title && article.description
            ? !(article.title.match(regFilter) || article.description.match(regFilter))
            : false);
        });
      });

  }
}


