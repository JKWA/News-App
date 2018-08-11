// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

let context;

// all tests
context = require.context('./', true, /\.spec\.ts$/);

// single test
// context = require.context('./', true, /article.component\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
