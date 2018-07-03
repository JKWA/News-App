import { Injectable } from '@angular/core';
import { Article } from '../article';
import { Category, stringToCategory } from '../category';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor() { }

  setData(category: string, articles: Article[]) {
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
          const check = index.get(article.title);

          check.onerror = function (event) {
            reject('database error');
          };

          check.onsuccess = function(event) {
            // console.log(check.result);
            if ( !check.result ) {
              // console.log('SAVE: ' + article.title);
              store.put({
                category: category,
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
        });

        tx.oncomplete = function() {
            db.close();
        };
      };
  });
  }


  getData(category: string) {
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
        const index = store.index('CategoryIndex');
        const result: Article[] = [];

        index.openCursor(category).onsuccess = function(event) {
          const cursor = event.target.result;

          if (cursor) {
              if (cursor.value.publishedAt) {
                const date: moment.Moment = moment(cursor.value.publishedAt);
                if ( date.add(120, 'm').isAfter(moment(new Date())) ) {
                  result.push(cursor.value);
                } else {
                  cursor.delete();
                }
              } else {
                cursor.delete();
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
  private _upgrade(open) {
    const db = open.result;
    const store = db.createObjectStore('ArticleObjectStore', {autoIncrement : true });
    store.createIndex('PublishedIndex', 'publishedAt', { unique: false });
    store.createIndex('CategoryIndex', 'category', { unique: false });
    store.createIndex('TitleIndex', 'title', { unique: false });
    return store;
  }


}
