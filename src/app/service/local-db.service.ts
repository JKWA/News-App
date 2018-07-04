import { Injectable } from '@angular/core';
import { Article } from '../article';
import { Category, categoryToObject, stringToCategory } from '../category';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class LocalDbService {

  constructor() { }

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
          const check = index.get(article.title);

          check.onerror = function (event) {
            reject('database error');
          };

          check.onsuccess = function(event) {
            if ( !check.result ) {
              store.put({
                category: categoryToObject(category).id,
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

      open.onsuccess = function() {
        const db = open.result;
        const tx = db.transaction('ArticleObjectStore', 'readwrite');
        const store = tx.objectStore('ArticleObjectStore');
        const index = store.index('CategoryIndex');
        const result: Article[] = [];
        index.openCursor(categoryToObject(category).id).onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            // todo clean this section up
              if (cursor.value.publishedAt) {
                const date: moment.Moment = moment(cursor.value.publishedAt);
                if ( date.add(120, 'm').isAfter(moment(new Date())) ) {
                  result.push(cursor.value);
                } else {
                  result.push(cursor.value);
                  if ( window.navigator.onLine ) {
                  cursor.delete();
                  }
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



}
