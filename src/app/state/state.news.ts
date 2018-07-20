import { State, Selector, Action, StateContext } from '@ngxs/store';
​import { Article } from '../article';
import { FilterStateModel, FilterState } from './state.filter';
import { AddLog } from './state.log';
import { LocalDbService } from '../service/local-db.service';
import { Store, Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { stringToCategory} from './state.category';
import { getSources } from '../source';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { getKey } from '../key';

class NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export class AddNews {
  static readonly type = 'Adding News';
  constructor(
    public category: string,
    public initial: boolean
  ) {}
}

export class AddLocalNews {
  static readonly type = 'Adding News';
  constructor(
    public category: string,
  ) {}
}

  interface NewsCategoryModel {
    retrieving: boolean;
    page: number;
    firstLoad: boolean;
    clientDataLoaded: boolean;
    articles: Article[];
  }

  export interface NewsStateModel {
    business: NewsCategoryModel;
    entertainment: NewsCategoryModel;
    general: NewsCategoryModel;
    health: NewsCategoryModel;
    science: NewsCategoryModel;
    sports: NewsCategoryModel;
    technology: NewsCategoryModel;
  }


  const defaultValue: NewsCategoryModel = {
    retrieving: false,
    page: 1,
    firstLoad: true,
    clientDataLoaded: false,
    articles: []
  };

  @State<NewsStateModel>({
    name: 'newsState',
    defaults: {
      business: Object.assign({}, defaultValue),
      entertainment: Object.assign({}, defaultValue),
      general: Object.assign({}, defaultValue),
      health: Object.assign({}, defaultValue),
      science: Object.assign({}, defaultValue),
      sports: Object.assign({}, defaultValue),
      technology: Object.assign({}, defaultValue),
    }
  })
​

export class NewsState {

  @Select(FilterState) filters: Observable<FilterStateModel>;

  private endpoint = 'https://newsapi.org/v2/everything';
  private country = 'us';
  private language = 'en';
  private pageSize = '25';
  private sort = 'publishedAt';

  @Selector() static general(state: NewsStateModel): Article[] {
    return state.general.articles;
  }

  constructor(
    private store: Store,
    private http: HttpClient,
    private localDb: LocalDbService,
  ) { }


  @Action(AddNews)
  addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
    const state = ctx.getState();
    const pageNumber = state[action.category].page;
    const sources: string = getSources(stringToCategory(action.category)).map(item => item.id).join();

    ctx.patchState({
      [action.category]: {
        ...state[action.category],
        retrieving: true
      }
    });
    if ( pageNumber > 5 ) {
      return ;
    }

    if (state[action.category].firstLoad || !action.initial) {
      this.filters.subscribe(filterResult => {

        const filterString = '-' + Array.from(filterResult.listOfFilters).join(',-');
        let url = `${this.endpoint}?q=${filterString}`;
        url += `&sources=${sources}&language=${this.language}&sortBy=${this.sort}`;
        url += `&page=${pageNumber < 5 ? pageNumber : 2}&pageSize=${pageNumber < 5 ? this.pageSize : 100}&apiKey=${getKey()}`;
        const regFilter = new RegExp(Array.from(filterResult.listOfFilters).join('|'), 'i');

      this.http.get<NewsResponse>(url)
        .pipe(
          map(response => {
            const news = response.articles;
            const filteredNews = news.filter(article => article.title && article.description
                        ? !(article.title.match(regFilter) || article.description.match(regFilter))
                        : false);
            return filteredNews;
          }),
          map(result => {
            return result.map(article => {
                article.anchorText = encodeURIComponent(article.title);
                return article;
            });
          }),
          tap(_ => this.log(`fetched ${action.category} news`)),
          catchError(this.handleError('getNews', []))
        )
        .toPromise()
        .then(result => {
          const copy = state[action.category].articles.splice(0).concat(result);
          ctx.patchState({
            [action.category]: {
              ...state[action.category],
              articles: this.removeDuplicateTitles(copy),
              page: state[action.category].page + 1,
              retrieving: false,
              firstLoad: false
            }
          });
          return result;
        })
        .then(result => {
          if (!state[action.category].clientDataLoaded) {
            this.addNewsFromClient(action.category, regFilter)
            .then(localData => {
              const copy = state[action.category].articles.splice(0).concat(localData);
              ctx.patchState({
                [action.category]: {
                  ...state[action.category],
                  articles: this.removeDuplicateTitles(copy),
                  clientDataLoaded: true
                }
              });
            })
            .then(_ => {
              this.log(`client news added ${action.category}`);
            })
            .catch(error => {
              this.log(`client news error ${action.category}`);
            });
        }
          return result;
        })
        .then(result => {
          this.localDb.setData(stringToCategory(action.category), result);
        })
        .then(_ => {
          if (window.navigator.onLine) {
            this.localDb.getOldData(stringToCategory(action.category))
            .then(keys => {
              keys.map(primaryKey => {
                this.localDb.removeArticle(primaryKey);
              });
            })
            .then(() => {
              this.log(`deleted old data from ${action.category}`);
            })
            .catch (error => {
              this.log(`ERROR: deleted old data from ${error}`);
            });
          }
        })
        .catch(error => {
          this.log(error);
        });
      }).unsubscribe();
    }
  }


  // @Action(AddLocalNews)
  // addLocalNews(ctx: StateContext<NewsStateModel>, action: AddLocalNews) {
  //   const state = ctx.getState();
  //   if (!state[action.category].clientDataLoaded) {
  //     this.filters.subscribe(result => {
  //       this.localDb.getData(stringToCategory(action.category))
  //       .then(news => {
  //         const regFilter = new RegExp(Array.from(result.listOfFilters).join('|'), 'i');
  //         const filteredNews = news.filter(article => article.title && article.description
  //           ? !(article.title.match(regFilter) || article.description.match(regFilter))
  //           : false)
  //           .map(article => {
  //             article.anchorText = encodeURIComponent(article.title);
  //             return article;
  //           });
  //           return filteredNews;
  //         })
  //         .then(articleResult => {
  //           const copy = state[action.category].articles.splice(0).concat(articleResult);
  //           ctx.patchState({
  //             [action.category]: {
  //               ...state[action.category],
  //               articles: this.removeDuplicateTitles(copy),
  //               clientDataLoaded: true
  //             }
  //           });
  //         })
  //         .then(_ => {
  //           this.log(`${action.category} locally loaded`);
  //         });
  //     }).unsubscribe();
  //   }

  // }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      let userMessage: string;
      switch (error.status) {
        case 200 :
          break;
        case 400 :
          userMessage = 'There was a problem with the news request';
          break;

        case 401 :
          userMessage = 'This was an unauthorized request';
          break;

        case 429 :
          userMessage = 'We are over the limit, please try again later';
          break;

        case 500 :
          userMessage = 'There was a problem with the news server, please try again later';
          break;

        default :
        userMessage = 'Something broke';
      }
      if ( userMessage ) {
       this.log(userMessage);
      }

      return of(result as T);
    };
  }

  private log(message: string) {
    this.store.dispatch(new AddLog('NewsService: ', message));
  }
  private addAnchorText(articles: Article[]) {
    return articles.map(article => {
      return article.anchorText = encodeURIComponent(article.title);
    });
  }


  private  removeDuplicateTitles(articles: Article[]): Article[] {
    const articleMap = new Map ();
    const deDupped = [];
    articles.map(article => articleMap.set(article.anchorText, article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
  }

  private addNewsFromClient(category, regFilter) {
    // const state = ctx.getState();
    // if (!state[action.category].clientDataLoaded) {
      // return this.filters.subscribe(result => {
       return this.localDb.getData(stringToCategory(category))
        .then(news => {
          // const regFilter = new RegExp(Array.from(result.listOfFilters).join('|'), 'i');
          const filteredNews = news.filter(article => article.title && article.description
            ? !(article.title.match(regFilter) || article.description.match(regFilter))
            : false)
            .map(article => {
              article.anchorText = encodeURIComponent(article.title);
              return article;
            });
            return filteredNews;
          });
          // .then(articleResult => {
          //   const copy = state[action.category].articles.splice(0).concat(articleResult);
          //   ctx.patchState({
          //     [action.category]: {
          //       ...state[action.category],
          //       articles: this.removeDuplicateTitles(copy),
          //       clientDataLoaded: true
          //     }
          //   });
          // })
          // .then(_ => {
          //   this.log(`${action.category} locally loaded`);
          // });
      // }).unsubscribe();
    }
}

