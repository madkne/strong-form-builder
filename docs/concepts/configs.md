# Configuration

after install **StrongFB** and add it to your project, need to configure it for your project!

## steps

1. initial `StrongFBService` service to `app.component.ts` file in constructor (or any boot components)
2. add a `ng-container` tag into `app.component.html` file like:

```html
<ng-container #serviceRef></ng-container>
```

3. declare a property (class variable) as `ViewContainerRef` like:

```ts
@ViewChild('serviceRef', { read: ViewContainerRef }) ServiceRef: ViewContainerRef;
```

4. implement `ngAfterViewInit` method and wait until to `serviceRef` ready to use. you can use a simple `interval` like:

```ts
let ref = setInterval(() => {
      if (!this.ServiceRef) return;
      //YOUR CODE
      clearInterval(ref);
    }, 10);
```

5. after that you must to call `config` method of `StrongFBService` and fill option properties like:

```ts
this.srv.config({
    viewContainerRef: this.ServiceRef,
    apiEndPoint: 'http:localhost:8081/api',
});
```

## complete code

```ts
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { StrongFBService } from './StrongFB/services/StrongFB.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('serviceRef', { read: ViewContainerRef }) ServiceRef: ViewContainerRef;

  constructor(private srv: StrongFBService) {
  }


  ngAfterViewInit(): void {
    let ref = setInterval(() => {
      if (!this.ServiceRef) return;
      this.srv.config({
        viewContainerRef: this.ServiceRef,
        apiEndPoint: 'http:localhost:8081/api',
      });
      clearInterval(ref);
    }, 10);
  }
}
```

## options

| **name** | **type** | **required** | **default** | **description**|
|:------:|:------:|:----------:|:----------:|:----------:|
| apiEndPoint | string | **YES** | - | base url for api requests|
| viewContainerRef | ViewContainerRef | **YES** | - | a container for load dynamic components|
| localStorageTokenKey | string | NO | `'access_token'` | save access token by which key in localstorage? |
| localStorageRefreshTokenKey | string | NO | `'refresh_token'` | save refresh token by which key in localstorage? |
| authenticationHeaderName | string | NO | `'Authentication'` | access token set on request headers by which name? |
| loginUrl | string | NO | `'/login'` | used for redirect to login page |
| getRefreshTokenApi | function | NO | - | used for recovery access token |
| language | AvailableLanguage | NO | `'en'` | used for locales |
| customLocales | object | NO | - | define custom locales [more info](./locales.md) | 
| assetsBaseUrl | string | NO | `'/assets/StrongFB'` | set base url for StrongFB assets | 
| darkTheme | boolean | NO | false | set dark theme for widgets like editor widget |
| injectServices | object | NO | {} | you can inject your custom services and use them later on forms |