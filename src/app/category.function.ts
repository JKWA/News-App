import { Category } from './category.enum';

export interface CategoryItem {
    display: string;
    id: string;
    selected: boolean;
    tabIndex: number;
    viewing: boolean;
  }

  /**
   * transforms a string to a category enum
   * @param cat - the cateogy string
   * @return category enum, defaults to General
   */
export function stringToCategory(cat: string): Category {
    let returnCat;

      switch (cat) {
        case 'business' :
          returnCat = Category.Business;
          break;
        case 'entertainment' :
          returnCat = Category.Entertainment;
          break;
        case 'general' :
          returnCat = Category.General;
          break;
        case 'health' :
          returnCat = Category.Health;
          break;
        case 'science' :
          returnCat = Category.Science;
          break;
        case 'sports' :
          returnCat = Category.Sports;
        break;
          case 'technology' :
          returnCat = Category.Technology;
          break;
        default :
        returnCat = Category.General;
      }

    return returnCat;

  }

  /**
     * transforms a comma seperated string to a set of category enums
     * @param cat - cateogy string seperated by commas
     * @return set of category enums, each defaults to General
     */
  export function stringToCategories(cat: string): Set<Category> {
      const categorySet = new Set();
      cat.split(',').map(category => {
        categorySet.add(stringToCategory(category));
      });
      return categorySet;

    }


    /**
     * transforms a category enum to an object with helpful values
     * @param category - the cateogy enum
     * @return object with display and id values, defuaults to General values
     */
    export function categoryToObject(category: Category): CategoryItem {
      let catObj;
      switch (category) {
        case Category.Science :
          catObj = {
            display: 'Science',
            id: 'science'
          };
          break;
          case Category.Business :
            catObj = {
              display: 'Business',
              id: 'business'
            };
            break;
          case Category.Entertainment :
          catObj = {
            display: 'Entertainment',
            id: 'entertainment'
          };
          break;
          case Category.General :
          catObj = {
            display: 'General',
            id: 'general'
          };
          break;
          case Category.Health :
          catObj = {
            display: 'Health',
            id: 'health'
          };
          break;
        case Category.Science :
          catObj = {
            display: 'Science',
            id: 'science'
          };
          break;
        case Category.Sports :
          catObj = {
            display: 'Sports',
            id: 'sports'
          };
          break;
        case Category.Technology :
          catObj = {
            display: 'Technology',
            id: 'technology'
          };
          break;
        default :
        catObj = {
          display: 'Other',
          id: 'general'
        };
      }
      return catObj;
    }

    /**
     * creates all the initial values
     * @param category - the cateogy enum
     * @return object with display and id values, defuaults to General values
     */
  export function createAllCategories(): Map<string, CategoryItem> {
    const set = new Set ([
        categoryToObject(Category.Business),
        categoryToObject(Category.Entertainment),
        categoryToObject(Category.General),
        categoryToObject(Category.Health),
        categoryToObject(Category.Science),
        categoryToObject(Category.Sports),
        categoryToObject(Category.Technology),
    ]);
    const map = new Map();

    // default to general,science,technology
    const selected = window.localStorage.getItem('categories')
      ? stringToCategories(window.localStorage.getItem('categories'))
      : stringToCategories('general,science,technology');

      set.forEach(item => {
        if ( selected ) {
            selected.has(stringToCategory(item.id))
            ? item.selected = true
            : item.selected = false;
        } else {
            item.selected = false;
        }
        map.set(item.id, item);

      });
      return map;
  }
