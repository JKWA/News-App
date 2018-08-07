import { Injectable } from '@angular/core';
import { Article } from '../article';
import { categoryToObject } from '../utility/category.utility';
import { Category } from '../utility/category.enum';
import * as moment from 'moment';
import { Observable } from 'rxjs';


// TODO - look at changing promises to observables

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor() { }

/**
 * save articles to indexed DB
 *
 * @param {Category} category
 * @param {Article[]} articles
 * @returns
 * @memberof LocalDbService
 */
setData(category: Category, articles: Article[]): Observable<any> {
    return new Observable(observer => {
      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        observer.error({
          status: 1100,
          statusText: 'No index database available'
        });
      }

      const open = indexedDB.open('ArticleDatabase', 1);

      open.onupgradeneeded = function () {
        const db = open.result;
        const store = db.createObjectStore('ArticleObjectStore', {autoIncrement : true });
        store.createIndex('PublishedIndex', 'publishedAt', { unique: false });
        store.createIndex('CategoryIndex', 'category', { unique: false });
        store.createIndex('TitleIndex', 'title', { unique: false });
      };

      open.onsuccess = function() {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');
        const index = store.index('TitleIndex');

        articles.map(article => {

          if ( article.title ) {
            const check = index.get(article.title);
            check.onerror = (error) => {
              observer.error({
                status: 1300,
                statusText: `${article.title}`
              });
            };

            check.onsuccess = (event) => {
              if ( !check.result ) {
                store.put({
                  category: categoryToObject(category).id,
                  timestamp: new Date().toISOString(),
                  source: article.source,
                  author: article.author,
                  title: article.title,
                  description: article.description,
                  url: article.url,
                  urlToImage: article.urlToImage,
                  publishedAt: article.publishedAt,
                });
              }
              observer.next({
                category: categoryToObject(category).id,
                  timestamp: new Date().toISOString(),
                  source: article.source,
                  author: article.author,
                  title: article.title,
                  description: article.description,
                  url: article.url,
                  urlToImage: article.urlToImage,
                  publishedAt: article.publishedAt,
              });

            };
            check.onerror = (err) => {
              observer.error({
                status: 1400,
                statusText: err
              });
            };
          }
        });

        tx.oncomplete = () => {
          observer.complete();
          db.close();
        };
      };
  });
  }


/**
 * gets articles from indexed DB by category
 *
 * @param {Category} category
 * @returns
 * @memberof LocalDbService
 */
getData(category: Category): Observable<Article[]> {
    return new Observable(observer => {
      const indexedDB = window.indexedDB;

      if ( !indexedDB ) {
        observer.error({
          status: 1100,
          statusText: 'No index database available'
        });
      }

      const open = indexedDB.open('ArticleDatabase', 1);

      open.onupgradeneeded = function () {
        const db = open.result;
        const store = db.createObjectStore('ArticleObjectStore', {autoIncrement : true });
        store.createIndex('PublishedIndex', 'publishedAt', { unique: false });
        store.createIndex('CategoryIndex', 'category', { unique: false });
        store.createIndex('TitleIndex', 'title', { unique: false });
      };

      open.onerror = function (error) {
        indexedDB.deleteDatabase('ArticleDatabase');
        observer.error({
          status: 1200,
          statusText: 'Indexed DB could not be opened '
        });
      };

      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');
        const index = store.index('CategoryIndex');
        const result: Article[] = [];
        index.openCursor(categoryToObject(category).id)
          .onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {

              // if offline, push everything
                  if ( ! window.navigator.onLine) {
                    result.push(cursor.value);

                  } else {
                    // if online, push information from the past two hours
                    const date: moment.Moment = moment(cursor.value.timestamp);
                    if ( date.add(30, 'm').isAfter(moment(new Date())) ) {
                      const copy =  Object.assign({}, cursor.value, {id: encodeURIComponent(cursor.value.title)});
                      result.push(copy);
                    }
                  }

              cursor.continue();
              } else {
                observer.next(result);
              }
          };
        tx.oncomplete = function() {
          observer.complete();
          db.close();
        };
      };
    });
  }


/**
 * gets articles older than 30 minutes
 *
 * @param {Category} category
 * @returns {Observable<number[]>}
 * @memberof LocalDbService
 */
getExpiredData(category: Category): Observable<number[]> {
      return new Observable(observer => {

      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        observer.error({
          status: 1100,
          statusText: 'No index database available'
        });
      }

      const open = indexedDB.open('ArticleDatabase', 1);

      open.onupgradeneeded = function () {
        const db = open.result;
        const store = db.createObjectStore('ArticleObjectStore', {autoIncrement : true });
        store.createIndex('PublishedIndex', 'publishedAt', { unique: false });
        store.createIndex('CategoryIndex', 'category', { unique: false });
        store.createIndex('TitleIndex', 'title', { unique: false });
      };

      open.onerror = function (error) {
        indexedDB.deleteDatabase('ArticleDatabase');
        observer.error({
          status: 1200,
          statusText: 'Indexed DB could not be opened '
        });
      };

      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');
        const index = store.index('CategoryIndex');
        const result: number[] = [];

        index.openCursor(categoryToObject(category).id)
          .onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
              if (!cursor.value.timestamp) {
                result.push(cursor.primaryKey);

              } else {
                 const date: moment.Moment = moment(cursor.value.timestamp);
                  if ( !date.add(30, 'm').isAfter(moment(new Date())) ) {
                    result.push(cursor.primaryKey);
                  }
                }
                cursor.continue();
              } else {
                  observer.next(result);
              }
          };
        tx.oncomplete = function() {
          observer.complete();
          db.close();
        };
      };
    });
  }


/**
 *  Removes an article
 *
 * @param {number} primaryKey
 * @returns
 * @memberof LocalDbService
 */
removeArticle(primaryKey: number): Observable<any> {
      return new Observable(observer => {

      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        observer.error({
          status: 1100,
          statusText: 'No index database available'
        });
      }

      const open = indexedDB.open('ArticleDatabase', 1);

      open.onupgradeneeded = function () {
        const db = open.result;
        const store = db.createObjectStore('ArticleObjectStore', {autoIncrement : true });
        store.createIndex('PublishedIndex', 'publishedAt', { unique: false });
        store.createIndex('CategoryIndex', 'category', { unique: false });
        store.createIndex('TitleIndex', 'title', { unique: false });
      };

      open.onerror = function (error) {
        indexedDB.deleteDatabase('ArticleDatabase');
        observer.error({
          status: 1200,
          statusText: 'Indexed DB could not be opened '
        });
      };

      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');

        store.delete(primaryKey)
          .onsuccess = (_) => {
            observer.next(primaryKey);
          };

        tx.oncomplete = function() {
          observer.complete();
          db.close();
        };
      };
    });
  }

}
