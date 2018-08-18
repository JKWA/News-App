// import { State, Action, StateContext } from '@ngxs/store';
// ​import { Article } from '../article';
// import { FilterState } from './filter.state';
// import { AddMessage, AddError, UpdateState } from './log.state';
// import { LocalDbService } from '../service/local-db.service';
// import { Store, Select } from '@ngxs/store';
// import { Observable, of } from 'rxjs';
// import { stringToCategory} from '../utility/category.utility';
// import { NewsDataService } from '../service/news-data.service';
// import { map, take, exhaustMap, tap, catchError } from 'rxjs/operators';


//  /**
//    * Get data by category.
//    * Let the app continue.
//    * @param category - name of the operation that failed
//    * @param initial - boolean is initial fetch of this data
//    */
//   export class InitialNews {
//     static readonly type = '[App Component] Initial News';
//     constructor(
//       public category: string,
//     ) {}
//   }


//  /**
//    * Get data by category.
//    * Let the app continue.
//    * @param category - name of the operation that failed
//    * @param initial - boolean is initial fetch of this data
//    */
// export class AddNews {
//   static readonly type = '[Article Component] Adding News';
//   constructor(
//     public category: string,
//   ) {}
// }

//   interface NewsCategoryModel {
//     retrieving: boolean;
//     page: number;
//     firstLoadComplete: boolean;
//     clientDataLoaded: boolean;
//     articles: Article[];
//   }

//   export interface NewsStateModel {
//     business: NewsCategoryModel;
//     entertainment: NewsCategoryModel;
//     general: NewsCategoryModel;
//     health: NewsCategoryModel;
//     science: NewsCategoryModel;
//     sports: NewsCategoryModel;
//     technology: NewsCategoryModel;
//   }

//   const defaultValue: NewsCategoryModel = {
//     retrieving: false,
//     page: 1,
//     firstLoadComplete: false,
//     clientDataLoaded: false,
//     articles: []
//   };

//   @State<NewsStateModel>({
//     name: 'newsState',
//     defaults: {
//       business: Object.assign({}, defaultValue),
//       entertainment: Object.assign({}, defaultValue),
//       general: Object.assign({}, defaultValue),
//       health: Object.assign({}, defaultValue),
//       science: Object.assign({}, defaultValue),
//       sports: Object.assign({}, defaultValue),
//       technology: Object.assign({}, defaultValue),
//     }
//   })
// ​

// export class NewsState {

//   @Select(FilterState.allFilters) filters: Observable<Set<string>>;

//   constructor(
//     private store: Store,
//     private localDb: LocalDbService,
//     private newsService: NewsDataService
//   ) { }

// /**
//  * gets data from api and client
//  * caches api data to client
//  * finds and removes expired client cache
//  *
//  * @param {StateContext<NewsStateModel>} ctx
//  * @param {AddNews} action
//  * @memberof NewsState
//  */
// @Action(InitialNews)
//   initialNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
//     const state = ctx.getState();
//     const pageNumber = state[action.category].page;
//     const category = stringToCategory(action.category);

//     this.filters.pipe(
//       take(1),
//       tap( _ => this.setFlagForRetrevingStatus(ctx, action.category)),
//       exhaustMap(allFilters => {
//         return this.newsService.getNews(category, pageNumber, allFilters)
//         .pipe(
//           map(results => this.updateState(ctx, action.category, results, 'NewsService')),
//           catchError(this.handleError('getNews', [])),
//         );
//       }),
//       tap( _ => this.localDb.getData(category)
//         .pipe(
//           map(results => this.updateState(ctx, action.category, results, 'LocalDB')),
//           catchError(this.handleError('getData', []))
//         ).subscribe()
//       ),
//       tap(results => this.localDb.setData(category, results).pipe(
//         // tap( _ => this.store.dispatch(new AddMessage('NewsService', `cached ${category} news`))),
//         catchError(this.handleError('setData'))
//       ).subscribe()),
//       tap( _ => this.localDb.getExpiredData(category)
//         .pipe(
//           take(1),
//           map(oldKeysArray => {
//             if ( !window.navigator.onLine ) {
//               return [];
//             }
//             oldKeysArray.map(key => {
//               this.localDb.removeArticle(key)
//               .pipe(
//                 take(1),
//                 catchError(this.handleError('removeArticle'))
//               ).subscribe();
//             });
//             return oldKeysArray;
//           }),
//           tap(oldKeysArray => {
//             if ( oldKeysArray.length) {
//                this.store.dispatch(new AddMessage('NewsService', `removed old ${category} news`));
//             }
//           }),
//           catchError(this.handleError('getExpiredData', []))
//         ).subscribe()
//       )
//     ).subscribe();
//   }
// /**
//  * gets data from api and adds to list of articles
//  * caches api data to client

//  * @param {StateContext<NewsStateModel>} ctx
//  * @param {AddNews} action
//  * @returns
//  * @memberof NewsState
//  */
// @Action(AddNews)
//   addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
//     const state = ctx.getState();
//     const pageNumber = state[action.category].page;
//     const category = stringToCategory(action.category);

//     // TOD0 is there a better way to thottle?
//     if ( pageNumber > 5 ) { // limit to 5 calls per category
//       return ;
//     }

//     if ( state[action.category].retrieving ) { // not if currently retrieving
//       console.log(state);
//       return ;
//     }

//     if ( !state[action.category].firstLoadComplete ) { // not until the inital load is complete
//       console.log(state);
//       return ;
//     }

//     this.setFlagForRetrevingStatus(ctx, action.category);

//     this.filters.pipe(
//       take(1),
//       exhaustMap(allFilters => {
//         return this.newsService.getNews(category, pageNumber, allFilters)
//         .pipe(
//           tap(results => this.updateState(ctx, action.category, results, 'NewsService')),
//           catchError(this.handleError('getNews', [])),
//         );
//       }),
//       tap(results => this.localDb.setData(category, results).pipe(
//         catchError(this.handleError('setData', []))
//       ).subscribe())
//     ).subscribe();

//   }

// /**
//  * sets flag that data is currently being received for this category
//  *
//  * @private
//  * @param {*} ctx
//  * @param {*} category
//  * @memberof NewsState
//  */
// private setFlagForRetrevingStatus(ctx, category) {
//     const copyCurrentState = Object.assign({}, ctx.getState());

//     ctx.patchState({
//       [category]: {
//         ...copyCurrentState[category],
//         retrieving: true
//       }
//     });

//     // send action to the dev logs
//     this.store.dispatch(new AddMessage('NewsService', `fetching ${category} news`));
//   }

// /**
//  * updates state
//  *
//  * @private
//  * @param {*} ctx
//  * @param {*} category
//  * @param {*} result
//  * @param {*} service
//  * @returns
//  * @memberof NewsState
//  */
// private updateState(ctx, category, result, service) {
//       const state = ctx.getState();
//       const copyCurrentState = Object.assign({}, ctx.getState());
//       const copyArticles = copyCurrentState[category].articles.splice(0).concat(result);
//       const clientFlag = (copyCurrentState[category].clientDataLoaded)
//         ? true
//         :  service === 'LocalDB' ? true : false;

//       const pageUpdate = service === 'NewsService'
//         ? copyCurrentState[category].page + 1
//         : copyCurrentState[category].page;

//       ctx.patchState({
//         [category]: {
//         ...state[category],
//         articles: this.removeDuplicateTitles(copyArticles),
//         page: pageUpdate,
//         retrieving: false,
//         firstLoadComplete: true,
//         clientDataLoaded: clientFlag
//         }
//       });

//       // send action to dev logs
//       this.store.dispatch(new AddMessage(service, `fetched ${category} news`));
//       // this.store.dispatch(new UpdateState('NewsService', `fetched ${category} news`, copyCurrentState, ctx.getState()));

//       return result;
//   }


//    /**
//    * Unduplicate articles by title, important to keep the article ids unique
//    * @param articles - array of articles
//    * @return articles - array of unduplicated articles
//    */
//   private  removeDuplicateTitles(articles: Article[]): Article[] {
//     const articleMap = new Map ();
//     const deDupped = [];

//     articles.map(article => articleMap.set(encodeURIComponent(article.title), article));
//     articleMap.forEach(item => deDupped.push(item));

//     return deDupped;
//   }


//   /**
//    * Handle Http operation that failed.
//    * Dispatch error
//    * Let the app continue.
//    * @private
//    * @template T
//    * @param {string} [operation='operation'] - name of the operation that failed
//    * @param {T} [result] - optional value to return as the observable result
//    * @returns empty array for the articles value
//    * @memberof NewsState
//    */
//   private handleError<T> (operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {

//       let userMessage: string;
//       let service = 'unknown';
//       console.log(error);
//       switch (error.status) {
//         case 200 :
//           break;
//         case 400 :
//           userMessage = 'There was a problem with the news request';
//           service = 'NewsService';
//           break;

//         case 401 :
//           userMessage = 'This was an unauthorized request';
//           service = 'NewsService';
//           break;

//         case 429 :
//           userMessage = 'We are over the limit, please try again later';
//           service = 'NewsService';
//           break;

//         case 500 :
//           userMessage = 'There was a problem with the news server, please try again later';
//           service = 'NewsService';
//           break;

//         case 0 :
//           userMessage = 'offline';
//           service = 'NewsService';
//           break;

//         case 1100 :
//           userMessage = 'There is no local database';
//           service = 'Indexed DB';
//           break;

//         case 1200 :
//           userMessage = 'Indexed DB could not be opened and was reset';
//           service = 'Indexed DB';
//           break;

//         case 1300 :
//           userMessage = `No index named ${error.statusText}`;
//           service = 'Indexed DB';
//           break;

//         case 1300 :
//           userMessage = error.statusText;
//           service = 'Indexed DB';
//           break;

//         default :
//         userMessage = `${error.statusText}`;
//       }
//       if ( userMessage ) {
//         this.store.dispatch(new AddError(service, userMessage));
//       }

//       return of(result as T);
//     };
//   }
// }

