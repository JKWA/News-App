import { Category } from './../../enums/category.enum';
import { CategoryItemModel } from './../../models/category-item.model';
import { stringToCategories, stringToCategory, categoryToObject } from './../utility/category.utility';

export class CategoryDefault {

    public get createAllCategories(): Map <string, CategoryItemModel> {

        // const set = new Set ([
        //     categoryToObject(Category.Business),
        //     categoryToObject(Category.Entertainment),
        //     categoryToObject(Category.General),
        //     categoryToObject(Category.Health),
        //     categoryToObject(Category.Science),
        //     categoryToObject(Category.Sports),
        //     categoryToObject(Category.Technology),
        // ]);
        const map = new Map();
        map.set(Category.Business, categoryToObject(Category.Business));
        map.set(Category.Entertainment, categoryToObject(Category.Entertainment));
        map.set(Category.General, categoryToObject(Category.General));
        map.set(Category.Health, categoryToObject(Category.Health));
        map.set(Category.Science, categoryToObject(Category.Science));
        map.set(Category.Sports, categoryToObject(Category.Sports));
        map.set(Category.Technology, categoryToObject(Category.Technology));

        return map;


        // return set;
    //     const map = new Map();

    //      // default to general,science,technology
    //      const selected = window.localStorage.getItem('categories')
    //        ? stringToCategories(window.localStorage.getItem('categories'))
    //        : stringToCategories('general,science,technology');

    //        set.forEach(item => {
    //          if ( selected ) {
    //              selected.has(stringToCategory(item.id))
    //              ? item.selected = true
    //              : item.selected = false;
    //          } else {
    //              item.selected = false;
    //          }
    //          map.set(item.id, item);
    //        });
    //        return map;
       }

       get getDefaultSelectedCategories() {
        return new Set ([Category.General, Category.Science, Category.Technology]);
       }
    }
