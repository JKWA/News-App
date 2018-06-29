

export enum Category {
    Business = 'business',
    Entertainment = 'entertainment',
    General = 'general',
    Health = 'health',
    Science = 'science',
    Sports = 'sports',
    Technology = 'technology',
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
