import { State, Action, StateContext } from '@ngxs/store';
​import { Article } from '../article';
import { NewsService } from '../service/news.service';
import { Filter, FilterStateModel, FilterState } from '../state/state.filter';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
// import { RetrievingNews, AddNews, NewsState } from '../state/state.news';


export class RetrievingNews {
  static readonly type = 'Retrieving News';
  constructor(
    public category: string,
  ) {}
}

export class AddNews {
  static readonly type = 'Adding News';
  constructor(
    public category: string,
  ) {}
}

  interface NewsCategoryModel {
    retrieving: boolean;
    page: number;
    articles: any[];
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

  @Select(FilterState) listOfFilters: Observable<Set<string>>;
  constructor(
    private newsService: NewsService,
    private store: Store
  ) { }

  @Action(RetrievingNews)
  retrieveNews(ctx: StateContext<NewsStateModel>, action: RetrievingNews) {
    const state = ctx.getState();
    state[action.category].retrieving = true;

    ctx.setState(
      state
    );

    console.log(ctx.getState());
  }

  @Action(AddNews)
  addNews(ctx: StateContext<NewsStateModel>, action: AddNews) {
    const state = ctx.getState();
    // console.log(action.articles);
    state[action.category].retrieving = false;
    state[action.category].page ++;
    this.listOfFilters.subscribe(result => {
      // console.log(result);
    });
    console.log(action.category);
    const newsArticles = [];
    // this.newsService.getNews(action.category)
    //   .subscribe(news => {
    //     // console.log(news);
    //     state[action.category].articles = news;
    //     console.log(state[action.category].articles);
    //     console.log(state);
    //     ctx.setState(state);

    //   });
      console.log(state);

      ctx.setState(
        state
      );

      console.log(ctx.getState());

    // this.newsService.getNews(action.category)
    //     .subscribe(news => {
    //       listOfFilters.subscribe(result => {
    //         const allFilters: string[] = [];
    //         const regString = result.listOfFilters.forEach(filter => {
    //           allFilters.push(filter);
    //         });

    //         const regFilter = new RegExp(allFilters.join('|'), 'i');

    //         // news.map(art => {
    //         //   console.log(art.title.match(filterSring));
    //         // });

    //         state[action.category].articles.concat(
    //           news.filter(article => article.title && article.description
    //           ? !(article.title.match(regFilter) || article.description.match(regFilter))
    //           : false);
    //         );
    //       });
    //     })}

        // state[action.category].articles.concat(articles);
        // action.articles = stream;
    // action.articles.subscribe(result => {
    //   state[action.category].articles.concat(action.result);
    // });
        // console.log(state);

    // ctx.setState(
    //   state
    // );

    // console.log(ctx.getState());
  }


}










// import { State, Action, StateContext } from '@ngxs/store';
// import { Category } from '../category';

// // export type Filter = string;

// export class RetrievingNews {
//   static readonly type = 'AddFilter';
//   constructor(
//     public category: string,
//   ) {}
// }

// export class AddNews {
//   static readonly type = 'AddFilter';
//   constructor(
//     public category: string,
//     public page: number,
//     public news: any[]
//   ) {}
// }


//  interface NewsCategoryModel {
//   retrieving: boolean;
//   page: number;
//   articles: any[];
// }

// interface NewsStateModel {
//   business: NewsCategoryModel;
//   entertainment: NewsCategoryModel;
//   general: NewsCategoryModel;
//   health: NewsCategoryModel;
//   science: NewsCategoryModel;
//   sports: NewsCategoryModel;
//   technology: NewsCategoryModel;
// }

// const defaultValue: NewsCategoryModel = {
//   retrieveing: false,
//   page: 1,
//   articles: []
// };


// @State<NewsStateModel>({
//   name: 'newsState',
//   defaults: {
//     // business: defaultValue,
//     // entertainment: defaultValue,
//     // general: defaultValue,
//     // health: defaultValue,
//     // science: defaultValue,
//     // sports: defaultValue,
//     // technology: defaultValue,
//   }
// })


// export class NewsState {

//   @Action(RetrievingNews)
//   category(ctx: StateContext<FilterStateModel>, action: RetrievingNews) {
//     console.log(action);
//     const state = ctx.getState();

//     ctx.setState({
//       ...state,
//       // [action.category].retrieveing: true;
//     });

//     console.log(ctx.getState());
//   }

//   @Action(AddNews)
//   category(ctx: StateContext<FilterStateModel>, action: AddNews) {

//     const state = ctx.getState();

//     ctx.setState({
//       ...state,
//       // [action.category].retrieveing: false,
//       // [action.category].page: action.page,
//       // [action.category].articles.concat(action.articles)
//     });
//   }

//   // @Action(RemoveFilter)
//   // removeFilter(ctx: StateContext<FilterStateModel>, action: RemoveFilter) {
//   //   console.log('REMOVEFILTER: ' + action.filterToRemove);
//   //   const state = ctx.getState();
//   //   state.listOfFilters.delete(action.filterToRemove);
//   //   window.localStorage.setItem('filters', Array.from(state.listOfFilters).join());

//   //   ctx.setState({
//   //     ...state,
//   //     listOfFilters: state.listOfFilters
//   //   });
//   // }


// }



