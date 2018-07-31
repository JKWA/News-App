import { State, Action, StateContext } from '@ngxs/store';
​import { Article } from '../article';
import { FilterState } from './state.filter';

import { AddMessage, AddError, UpdateState } from './state.log';
import { LocalDbService } from '../service/local-db.service';
import { Store, Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { stringToCategory} from '../category.function';
import { NewsDataService } from '../service/news-data.service';

import { map, take, exhaustMap, tap, catchError, skipWhile } from 'rxjs/operators';

// TODO - Change from promise to observable and stay syncronous?



 /**
   * Get data by category.
   * Let the app continue.
   * @param category - name of the operation that failed
   * @param initial - boolean is initial fetch of this data
   */
  export class InitialNews {
    static readonly type = 'Initial News';
    constructor(
      public category: string,
    ) {}
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

  @Select(FilterState.allFilters) filters: Observable<Set<string>>;

  constructor(
    private store: Store,
    private localDb: LocalDbService,
    private newsService: NewsDataService
  ) { }


  @Action(InitialNews)
  initialNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
    const state = ctx.getState();
    const pageNumber = state[action.category].page;
    const category = stringToCategory(action.category);

    this.filters.pipe(
      take(1),
      tap( _ => this.setRetrevingIndicator(ctx, action.category)),
      exhaustMap(allFilters => {
        return this.newsService.getNews(action.category, pageNumber, allFilters)
        .pipe(
          map(results => this.addNewArticles(state[action.category].articles, results)),
          map(results => this.updateState(ctx, action.category, results, 'NewService')),
          catchError(this.handleError('getNews', [])),
        );
      }),
      tap( _ => this.localDb.getData(stringToCategory(category))
        .pipe(
          map(results => this.updateState(ctx, action.category, results, 'LocalDB')),
          catchError(this.handleError('getData', []))
        ).subscribe()
      ),
      tap(results => this.updateLocalCache(action.category, results)),
      tap( _ => this.localDb.getOldData(category)
        .pipe(
          take(1),
          map(oldKeysArray => {
            if ( !window.navigator.onLine ) {
              return [];
            }
            oldKeysArray.map(key => {
              this.localDb.removeArticle(key)
              .pipe(
                take(1)
              ).subscribe();
            });
            return oldKeysArray;
          }),
          tap(oldKeysArray => {
            if ( oldKeysArray.length) {
               this.store.dispatch(new AddMessage('NewsService', `removed old ${category} news`));
            }
          })
        ).subscribe()
      )
    ).subscribe();
  }

  @Action(AddNews)
  addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
    const state = ctx.getState();
    const pageNumber = state[action.category].page;

    // TOD0 work out a better way to thottle this

    if ( pageNumber > 5 ) { // limit to 5 calls per category
      return ;
    }

    if ( state[action.category].retrieving ) {
      return ;
    }

    if ( ! state[action.category].firstLoad ) {
      return ;
    }

    this.setRetrevingIndicator(ctx, action.category);

    this.filters.pipe(
      take(1),
      exhaustMap(allFilters => {
        return this.newsService.getNews(action.category, pageNumber, allFilters)
        .pipe(
          map(results => this.addNewArticles(state[action.category].articles, results)),
          tap(results => this.updateState(ctx, action.category, results, 'NewService')),
          catchError(this.handleError('getNews', [])),
        );
      }),
      tap(results => this.updateLocalCache(action.category, results)),
    ).subscribe();

  }


  private setRetrevingIndicator(ctx, category) {
    const copyCurrentState = Object.assign({}, ctx.getState());

    ctx.patchState({
      [category]: {
        ...copyCurrentState[category],
        retrieving: true
      }
    });

    // send action to the dev logs
    this.store.dispatch(new AddMessage('NewsService', `fetching ${category} news`));
  }


  private addNewArticles(oldArticels: Article[], newArticels: Article[]) {
    const copy = oldArticels.splice(0).concat(newArticels);
    return this.removeDuplicateTitles(copy);

  }

  private updateState(ctx, category, result, service) {
      const state = ctx.getState();
      const copyCurrentState = Object.assign({}, ctx.getState());
      const copy = copyCurrentState[category].articles.splice(0).concat(result);
      const clientFlag = (copyCurrentState[category].clientDataLoaded)
        ? true
        :  service === 'LocalDb' ? true : false;

      ctx.patchState({
        [category]: {
        ...state[category],
        articles: this.removeDuplicateTitles(copy),
        page: state[category].page + 1,
        retrieving: false,
        firstLoad: true,
        clientDataLoaded: clientFlag
        }
      });

      // send action to dev logs
      this.store.dispatch(new AddMessage(service, `fetched ${category} news`));
      // this.store.dispatch(new UpdateState('NewsService', `fetched ${category} news`, copyCurrentState, ctx.getState()));

      return result;
  }




  private updateLocalCache(category, articles) {
    this.localDb.setData(stringToCategory(category), articles).subscribe();
  }



  private deleteOldCache(ctx, category) {
    if (window.navigator.onLine) { // if online, then delete old data
      // const deleteState = ctx.getState();
      // if ( deleteState[category].page === 2) {
      //   this.localDb.getOldData(stringToCategory(category))
      //   .then(keys => {
      //     if ( keys.length ) {
      //       keys.map(primaryKey => {
      //         this.localDb.removeArticle(primaryKey);
      //       });
      //       this.log(`removed old ${category} articles`);
      //     }
      //   })
      //   .catch (error => {
      //     this.error(`ERROR: removed old ${error} articles`);
      //   });
      // }
    }
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

    articles.map(article => articleMap.set(encodeURIComponent(article.title), article));
    articleMap.forEach(item => deDupped.push(item));

    return deDupped;
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
      let service: string;

      switch (error.status) {
        case 200 :
          break;
        case 400 :
          userMessage = 'There was a problem with the news request';
          service = 'NewsService';
          break;

        case 401 :
          userMessage = 'This was an unauthorized request';
          service = 'NewsService';
          break;

        case 429 :
          userMessage = 'We are over the limit, please try again later';
          service = 'NewsService';
          break;

        case 500 :
          userMessage = 'There was a problem with the news server, please try again later';
          service = 'NewsService';
          break;

        case 0 :
          userMessage = 'offline';
          service = 'NewsService';
          break;

        case 1100 :
          userMessage = 'There is no local database';
          service = 'Indexed DB';
          break;

        case 1200 :
          userMessage = 'Indexed DB could not be opened and was reset';
          service = 'Indexed DB';
          break;

        default :
        userMessage = `${error.statusText}`;
      }
      if ( userMessage ) {
       this.error(userMessage);
      }

      return of(result as T);
    };
  }
}

