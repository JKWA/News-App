import { Injectable } from '@angular/core';
import { Article } from '../article';
import { categoryToObject } from '../category.function';
import { Category } from '../category.enum';
import * as moment from 'moment';

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
    return new Promise<any>((resolve, reject) => {
      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        reject('No index database available');
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
              console.log(error);
              reject('database error');
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
              resolve('articles saved');
            };
            check.onerror = (event) => {
              reject('database error');
            };
          }
        });

        tx.oncomplete = () => {
            db.close();
        };
      };
  });
  }

/**
 * promise that gets articles from indexed DB by category
 * @param category: the category
 * @param articles: the articles to save
 * @returns promise for articles
 */
  getData(category: Category) {
    return new Promise<any>((resolve, reject) => {

      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        reject('No index database available');
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
        reject(error);
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
                      result.push(cursor.value);
                    }
                  }

              cursor.continue();
              } else {
                  resolve(result);
              }
          };
        tx.oncomplete = function() {
            db.close();
        };
      };
    });
  }

  /**
 * promise that gets old articles
 * @param category: the category
 * @returns promise for an array of article keys
 */

  getOldData(category: Category) {
    return new Promise<any>((resolve, reject) => {

      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        reject('No index database available');
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
        reject(error);
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
                  resolve(result);
              }
          };
        tx.oncomplete = function() {
            db.close();
        };
      };
    });
  }

  /**
 * promise tht removes an article
 * @param primaryKey: indexed DB key for article
 */

  removeArticle(primaryKey: number) {
    return new Promise<any>((resolve, reject) => {

      const indexedDB = window.indexedDB;

      if (! indexedDB ) {
        reject('No index database available');
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
        reject(error);
      };

      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');

        store.delete(primaryKey)
          .onsuccess = (_) => {
            resolve(primaryKey);
          };

        tx.oncomplete = function() {
            db.close();
        };
      };
    });
  }

}
