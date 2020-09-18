import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import {AppComponent} from './app.component';
import {KKModule} from "./kiatnakin/kk.module";
import {VIBApplicationRoutingModule} from "./app-routing.module";
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from 'ng2-translate';
import {Ng2Webstorage} from 'ngx-webstorage';
import {HashLocationStrategy, LocationStrategy, DatePipe, PathLocationStrategy, APP_BASE_HREF} from "@angular/common";
import {TextMaskModule} from 'angular2-text-mask';
import {SelectTdPrincipalByIndexComponent} from './kiatnakin/user-module/select-td-principal-by-index/select-td-principal-by-index.component';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/kiatnakin/i18n', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        SelectTdPrincipalByIndexComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        KKModule,
        VIBApplicationRoutingModule,
        Ng2Webstorage,
        TextMaskModule,
        PdfViewerModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        })
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}, DatePipe,
        { provide: APP_BASE_HREF, useValue: 'VIB-UI' }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
