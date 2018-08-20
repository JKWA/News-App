import { Action } from '@ngrx/store';
import { Category } from '../enums/category.enum';
import { ServiceMessageModel } from '../models/service-message.model';

export enum CategoryActionTypes {
  LoadCategorys = '[Category] Load Categorys',
  AddCategory = '[Category Component] Add Selected Category',
  AddGeneralCategory = '[Category Effects] Add General Category',
  RemoveCategory = '[Category Component] Remove Selected Category',
  SetCategory = '[News Component] Set Viewed Category',
  SavedSelectedCategories = '[Category Effect] Saved Selected Category Locally',
  SavedSelectedCategoriesFailed = '[Category Effect] Failed to Save Selected Category Locally',
  SavedViewedCategory = '[Category Effect] saved viewed category',
  SavedViewedCategoryFailed = '[Category Effect] Failed to save viewed category',
}

export class LoadCategorys implements Action {
  readonly type = CategoryActionTypes.LoadCategorys;
}

export class AddCategory implements Action {
  readonly type = CategoryActionTypes.AddCategory;
  constructor(public payload: Category) { }
}

export class AddGeneralCategory implements Action {
  readonly type = CategoryActionTypes.AddGeneralCategory;
}


export class RemoveCategory implements Action {
  readonly type = CategoryActionTypes.RemoveCategory;
  constructor(public payload: Category) { }
}

export class SetCategory implements Action {
  readonly type = CategoryActionTypes.SetCategory;
  constructor(public payload: Category) { }
}

export class SavedSelectedCategories implements Action {
  readonly type = CategoryActionTypes.SavedSelectedCategories;
  constructor(public payload: ServiceMessageModel) { }

}

export class SavedSelectedCategoriesFailed implements Action {
  readonly type = CategoryActionTypes.SavedSelectedCategoriesFailed;
  constructor(public payload: ServiceMessageModel) { }

}

export class SavedViewedCategory implements Action {
  readonly type = CategoryActionTypes.SavedViewedCategory;
  constructor(public payload: ServiceMessageModel) { }
}

export class SavedViewedCategoryFailed implements Action {
  readonly type = CategoryActionTypes.SavedViewedCategoryFailed;
  constructor(public payload: ServiceMessageModel) { }
}

export type CategoryActions =
  LoadCategorys
  | AddCategory
  | AddGeneralCategory
  | RemoveCategory
  | SetCategory
  | SavedSelectedCategories
  | SavedSelectedCategoriesFailed
  | SavedViewedCategory
  | SavedViewedCategoryFailed;
