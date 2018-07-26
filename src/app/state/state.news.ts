import { State, Action, StateContext } from '@ngxs/store';
​import { Article } from '../article';
import { FilterState } from './state.filter';
import { AddMessage, AddError, CurrentState, NewState } from './state.log';
import { LocalDbService } from '../service/local-db.service';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { stringToCategory} from '../category.function';
import { HttpClient } from '@angular/common/http';
import { NewsDataService } from '../service/news-data.service';

// TODO - Change from promise to observable and stay syncronous?

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

  @Select(FilterState.allFilters) filters: Observable<Set<string>>;

  constructor(
    private store: Store,
    private http: HttpClient,
    private localDb: LocalDbService,
    private newsService: NewsDataService
  ) { }


  @Action(AddNews)
  addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
    const state = ctx.getState();
    const pageNumber = state[action.category].page;

    // track start of fetch
    this.log(`fetching ${action.category} news`);
    this.store.dispatch(new CurrentState(ctx.getState()));

    ctx.patchState({
      [action.category]: {
        ...state[action.category],
        retrieving: true
      }
    });

    this.store.dispatch(new NewState('NewsService', ctx.getState()));

    if ( pageNumber > 5 ) { // limit to 5 calls per category
      return ;
    }

    if (state[action.category].firstLoad || !action.initial) {
      const dataAPI = new Promise<any>((resolve, reject) => {

      this.filters.subscribe(allFilters => {

        this.newsService.getNews(action.category, pageNumber, allFilters)
        .subscribe(result => {
          this.store.dispatch(new CurrentState(ctx.getState()));

          const copy = state[action.category].articles.splice(0).concat(result);
          const articles = this.removeDuplicateTitles(copy);

          ctx.patchState({
            [action.category]: {
              ...state[action.category],
              articles: articles,
              page: state[action.category].page + 1,
              retrieving: false,
              firstLoad: false
            }
          });
          // this.localDb.setData(stringToCategory(action.category), result);
          this.store.dispatch(new NewState('NewsService', ctx.getState()));
          resolve(result);
        });
      }).unsubscribe(); // unsubscribe to filter changes
    });

    dataAPI.then(result => {
      const clientState = ctx.getState();
      if (!clientState[action.category].clientDataLoaded) {

        this.log(`fetching ${action.category} from indexed DB`);
        this.addNewsFromClient(action.category)
        .then(localData => {

          this.log(`received ${action.category} from indexed DB`);
          this.store.dispatch(new CurrentState(ctx.getState()));
          console.log(`${action.category}: ${localData.length}`);

          const copy = clientState[action.category].articles.splice(0).concat(localData);
          const articles = this.removeDuplicateTitles(copy);
          console.log(`${action.category}: ${articles.length}`);
          ctx.patchState({
            [action.category]: {
              ...clientState[action.category],
              articles: articles,
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
      if (window.navigator.onLine) { // if online, then delete old data
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
   * Get articles from indexed db.
   * @param category - enum category
   * @param regFilter - observable regular expression representing all filters
   * @return observable array of articles from indexed db
   */
  private addNewsFromClient(category) {
    return this.localDb.getData(stringToCategory(category));
  }
}

