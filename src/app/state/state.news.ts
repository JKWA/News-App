import { State, Selector, Action, StateContext } from '@ngxs/store';
​import { Article } from '../article';
import { FilterStateModel, FilterState } from './state.filter';
import { AddMessage, AddError, CurrentState, NewState } from './state.log';
import { LocalDbService } from '../service/local-db.service';
import { Store, Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { stringToCategory} from '../category.function';
import { getSources } from '../source';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { getKey } from '../key';


class NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

 /**
   * Get data by category.
   * Let the app continue.
   * @param category - name of the operation that failed
   * @param initial - boolean is initial fetch of this data
   */
export class AddNews {
  static readonly type = 'Adding News';
  constructor(
    public category: string,
    public initial: boolean
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

    this.log(`fetching ${action.category} news`);
    this.store.dispatch(new CurrentState(ctx.getState()));

    ctx.patchState({
      [action.category]: {
        ...state[action.category],
        retrieving: true
      }
    });

    this.store.dispatch(new NewState('NewsService', ctx.getState()));

    if ( pageNumber > 5 ) {
      return ;
    }

    if (state[action.category].firstLoad || !action.initial) {
      this.filters.subscribe(filterResult => {
        let url = `${this.endpoint}?`;

        if (filterResult.listOfFilters.size) {
          const filterString = `"-${Array.from(filterResult.listOfFilters).join('",-"')}"`;
          url += `q=${encodeURIComponent(filterString)}&`;
        }

        url += `sources=${sources}&language=${this.language}&sortBy=${this.sort}`;
        url += `&page=${pageNumber < 5 ? pageNumber : 2}&pageSize=${pageNumber < 5 ? this.pageSize : 100}&apiKey=${getKey()}`;

      this.http.get<NewsResponse>(url)
        .pipe(
          map(response => {
            return response.articles;
          }),
          map(result => {
            return result.map(article => {
                article.anchorText = encodeURIComponent(article.title);
                const expression = /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
                const regex = new RegExp(expression);
                if ( article.urlToImage ) {
                if ( ! article.urlToImage.match(regex) ) {
                   article.urlToImage = null;
                }
              }
                return article;
            });
          }),
          tap(_ => this.log(`received ${action.category} news`)),
          catchError(this.handleError('getNews', []))
        )
        .toPromise()
        .then(result => {

          this.store.dispatch(new CurrentState(ctx.getState()));

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

          this.store.dispatch(new NewState('NewsService', ctx.getState()));

          return result;
        })
        .then(result => {
          const clientState = ctx.getState();
          if (!clientState[action.category].clientDataLoaded) {

            this.log(`fetching ${action.category} from indexed DB`);
            this.addNewsFromClient(action.category)
            .then(localData => {

              this.log(`received ${action.category} from indexed DB`);
              this.store.dispatch(new CurrentState(ctx.getState()));

              const copy = clientState[action.category].articles.splice(0).concat(localData);
              ctx.patchState({
                [action.category]: {
                  ...clientState[action.category],
                  articles: this.removeDuplicateTitles(copy),
                  clientDataLoaded: true
                }
              });

              this.store.dispatch(new NewState('NewsService', ctx.getState()));

            })
            .catch(error => {
              this.error(`client news error ${error}`);
            });
        }
          return result;
        })
        .then(result => {
          this.localDb.setData(stringToCategory(action.category), result);
        })
        .then(_ => {
          if (window.navigator.onLine) {
            const deleteState = ctx.getState();
            if ( deleteState[action.category].page === 2) {
              this.localDb.getOldData(stringToCategory(action.category))
              .then(keys => {
                if ( keys.length ) {
                  keys.map(primaryKey => {
                    this.localDb.removeArticle(primaryKey);
                  });
                  this.log(`removed old ${action.category} articles`);
                }
              })
              .catch (error => {
                this.error(`ERROR: removed old ${error} articles`);
              });
            }
          }
        })
        .catch(error => {
          this.error(error);
        });
      }).unsubscribe();
    }
  }


    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   * @return empty array for the article value
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

        case 0 :
          userMessage = 'offline';
          break;

        default :
        console.log(error);
        userMessage = `Fetch error: ${error.statusText}`;
      }
      if ( userMessage ) {
       this.error(userMessage);
      }

      return of(result as T);
    };
  }

   /**
   * Log message when in dev mode.
   * @param message - log message
   */
  private log(message: string) {
    this.store.dispatch(new AddMessage('NewsService', message));
  }

   /**
   * Log error when in dev mode.
   * @param message - log message
   */
  private error(message: string) {
    this.store.dispatch(new AddError('NewsService', message));
  }

   /**
   * Unduplicate articles by title, important to keep the article anchor text unique
   * @param articles - array of articles
   * @return articles - array of unduplicated articles
   */
  private  removeDuplicateTitles(articles: Article[]): Article[] {
    const articleMap = new Map ();
    const deDupped = [];
    articles.map(article => articleMap.set(article.anchorText, article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
  }

   /**
   * Get articles from indexed db.
   * @param category - enum category
   * @param regFilter - observable regular expression representing all filters
   * @return observable array of articles from indexed db
   */
  private addNewsFromClient(category) {
    return this.localDb.getData(stringToCategory(category));
  }
}

