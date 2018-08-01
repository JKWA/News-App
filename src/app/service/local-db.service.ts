import { Injectable } from '@angular/core';
import { Article } from '../article';
import { categoryToObject } from '../category.function';
import { Category } from '../category.enum';
import * as moment from 'moment';
import { Observable } from 'rxjs';


// TODO - look at changing promises to observables

@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor() { }
/**
 * set articles to indexed DB
 * @param category: the category
 * @param articles: the articles to save
 */
  setData(category: Category, articles: Article[]) {
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
 * observable that gets articles from indexed DB by category
 * @param category: the category
 * @param articles: the articles to save
 * @returns observer for articles
 */
  getData(category: Category) {
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
 * observable that gets old articles
 * @param category: the category
 * @returns observable for an array of article keys
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
 * Observable tht removes an article
 * @param primaryKey: indexed DB key for article
 */

  removeArticle(primaryKey: number) {
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
