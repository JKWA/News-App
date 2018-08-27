import { Action } from '@ngrx/store';
import { Category } from '../enums/category.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import { State } from '../reducers/category.reducer';
export enum CategoryActionTypes {
  InitCategories = '[ROOT_EFFECTS_INIT] Initialize category store',
  LoadCategories = '[Category Effect] Load either saved or default categories',
  LoadCategoriesFailed = '[Category Effect] Load default categories',
  AddCategory = '[Category Component] Add selected category',
  AddGeneralCategory = '[Category Effects] Add general category',
  RemoveCategory = '[Category Component] Remove selected category',
  SetCategory = '[News Component] Set viewed category',
  SavedSelectedCategories = '[Category Effect] Saved selected category',
  SavedSelectedCategoriesFailed = '[Category Effect] Failed to save selected category',
  SavedViewedCategory = '[Category Effect] Saved viewed category',
  SavedViewedCategoryFailed = '[Category Effect] Failed to save viewed category',
}

export class InitCategories implements Action {
  readonly type = CategoryActionTypes.InitCategories;
}

export class LoadCategories implements Action {
  readonly type = CategoryActionTypes.LoadCategories;
  constructor(public payload: State) { }
}

export class LoadCategoriesFailed implements Action {
  readonly type = CategoryActionTypes.LoadCategoriesFailed;
  constructor(public payload: State) { }
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
  InitCategories
  | LoadCategories
  | LoadCategoriesFailed
  | AddCategory
  | AddGeneralCategory
  | RemoveCategory
  | SetCategory
  | SavedSelectedCategories
  | SavedSelectedCategoriesFailed
  | SavedViewedCategory
  | SavedViewedCategoryFailed;
