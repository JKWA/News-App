import { Injectable } from '@angular/core';
import { Article } from '../article';
import { Category, categoryToObject } from '../state/state.category';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor() { }

  setData(category: Category, articles: Article[]) {
    return new Promise<any>((resolve, reject) => {
      const indexedDB = window.indexedDB;
      // console.log('setting data');

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
        // console.log(categoryToObject(category).id);
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
              // console.log(cursor.value.timestamp);
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
            // console.log(`DELETED: ${primaryKey}`);
            resolve(primaryKey);
          };

        tx.oncomplete = function() {
            db.close();
        };
      };
    });
  }

}
