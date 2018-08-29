import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './components/news/news.component';
import { NewsSectionComponent } from './components/news-section/news-section.component';
import { FilterComponent } from './components/filter/filter.component';
import { LogComponent } from './components/log/log.component';
import { StandaloneComponent } from './components/standalone/standalone.component';

export const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' },

  {
    path: 'news',
    component: NewsComponent,
  },

  { path: 'news-section', component: NewsSectionComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'log', component: LogComponent },
  { path: 'standalone', component: StandaloneComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
