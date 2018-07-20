import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { CategoryComponent } from './category/category.component';
import { FilterComponent } from './filter/filter.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },
  // { path: 'news', redirectTo: '/news/general', pathMatch: 'full' },

  {
    path: 'news',
    component: NewsComponent,
  },
  // {
  //   path: 'news/:id',
  //   component: NewsComponent,
  // },
  { path: 'category', component: CategoryComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'log', component: LogComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
