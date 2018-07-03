

export enum Category {
    Business = 'business',
    Entertainment = 'entertainment',
    General = 'general',
    Health = 'health',
    Science = 'science',
    Sports = 'sports',
    Technology = 'technology',
}

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

export function stringToCategories(cat: string): Set<Category> {
    const categorySet = new Set();
    cat.split(',').map(category => {
      switch (category) {
        case 'business' :
          categorySet.add(Category.Business);
          break;
        case 'entertainment' :
          categorySet.add(Category.Entertainment);
          break;
        case 'general' :
          categorySet.add(Category.General);
          break;
        case 'health' :
          categorySet.add(Category.Health);
          break;
        case 'science' :
          categorySet.add(Category.Science);
          break;
        case 'sports' :
          categorySet.add(Category.Sports);
        break;
          case 'technology' :
          categorySet.add(Category.Technology);
          break;
        default :
        categorySet.add(Category.General);
      }
    });
    return categorySet;

  }

  export interface CategoryObject {
    display: string;
    id: string;
  }

  export function categoryToObject(category: Category): CategoryObject {
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

