import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageTranslationModule } from "./shared/modules/language-translation/language-translation.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { AdminAuthGuard } from './core/admin-auth.guard';
import { AuthGuard } from './core/auth.guard';
import { ErrorInterceptor } from './core/error.interceptor';
import { JwtInterceptor } from './core/jwt.interceptor';
import { DxDataGridModule, DxTooltipModule, DxTemplateModule } from "devextreme-angular";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  NgbDropdownModule,
  NgbButtonsModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbAccordionModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LightboxModule } from 'ngx-lightbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountToModule } from 'angular-count-to';
import { NgxMasonryModule } from 'ngx-masonry';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from "./shared/shared.module";
import { environment } from '../environments/environment';
import { FeatherModule } from 'angular-feather';

import { allIcons } from 'angular-feather/icons';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SwitcherComponent } from './shared/switcher/switcher.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContributionsComponent } from './components/contributions/contributions.component';
import { ContributionsDetailsComponent } from './components/contributions/contributions-details/contributions-details.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    PageNotFoundComponent,
    SwitcherComponent,
    GalleryComponent,
    ContributionsComponent,
    ContributionsDetailsComponent,
  ],
  imports: [
    BrowserModule,
    LanguageTranslationModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PdfViewerModule,
    RouterModule,
    CarouselModule,
    FeatherModule.pick(allIcons),
    DxDataGridModule,
    DxTooltipModule,
    DxTemplateModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbDropdownModule,
    NgbButtonsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbAccordionModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollToModule.forRoot(),
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    NgxYoutubePlayerModule,
    NgbDropdownModule,
    NgbModule,
    NgbNavModule,
    SwiperModule,
    NgxTypedJsModule,
    FlatpickrModule.forRoot(),
    CountToModule,
    NgxMasonryModule,
    LightboxModule,
    SharedModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.4)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  exports: [
    FeatherModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthGuard, AdminAuthGuard, TitleCasePipe, DatePipe,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "en-GB" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
