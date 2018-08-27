import { Category } from './../../enums/category.enum';
import { CategoryItemModel } from './../../models/category-item.model';
import { stringToCategories, stringToCategory, categoryToObject } from './../utility/category.utility';

export class CategoryDefault {

    public get createAllCategories(): Map <string, CategoryItemModel> {

        const map = new Map();
        map.set(Category.Business, categoryToObject(Category.Business));
        map.set(Category.Entertainment, categoryToObject(Category.Entertainment));
        map.set(Category.General, categoryToObject(Category.General));
        map.set(Category.Health, categoryToObject(Category.Health));
        map.set(Category.Science, categoryToObject(Category.Science));
        map.set(Category.Sports, categoryToObject(Category.Sports));
        map.set(Category.Technology, categoryToObject(Category.Technology));

        return map;
    }

    get getDefaultSelectedCategories() {
        return new Set ([Category.General, Category.Science, Category.Technology]);
    }

    get getDefaultViewingCategory() {
        return Category.General;
    }
}
