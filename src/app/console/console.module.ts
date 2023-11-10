import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from "@angular/core";
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
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
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { ConsoleRoutingModule } from "./console-routing.module";
import { ConsoleComponent } from "./console.component";
import localeGb from "@angular/common/locales/en-GB";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { registerLocaleData } from "@angular/common";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CategoriesComponent } from './categories/categories.component';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LightboxModule } from 'ngx-lightbox';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountToModule } from 'angular-count-to';
import { NgxMasonryModule } from 'ngx-masonry';
import { ConsoleHeaderComponent } from './components/console-header/console-header.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StatusesComponent } from './statuses/statuses.component';
import { ModalStatusComponent } from './modal-status/modal-status.component';
import { MembersComponent } from './members/members.component';
import { ModalMemberComponent } from './modal-member/modal-member.component';
import { EventsComponent } from './events/events.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { BranchesComponent } from './branches/branches.component';
import { ContributionsComponent } from './contributions/contributions.component';
import { ModalBranchComponent } from './modal-branch/modal-branch.component';
import { ModalEligibilityComponent } from './modal-eligibility/modal-eligibility.component';
import { ModalEventComponent } from './modal-event/modal-event.component';
import { ModalContributionComponent } from './modal-contribution/modal-contribution.component';
import { ModalPaymentStateComponent } from './modal-payment-state/modal-payment-state.component';
import { PaymentStatesComponent } from './payment-states/payment-states.component';
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

registerLocaleData(localeGb);

@NgModule({
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    TranslateModule,
    PdfViewerModule,
    SwiperModule,
    NgxTypedJsModule,
    FlatpickrModule.forRoot(),
    CountToModule,
    NgxMasonryModule,
    DxDataGridModule,
    DxTooltipModule,
    DxTemplateModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.4)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    FeatherModule.pick(allIcons),
    ScrollToModule.forRoot(),
    LightboxModule,
    CarouselModule,
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
    NgbModule,
  ],
  declarations: [
    ConsoleComponent,
    DashboardComponent,
    SidebarComponent,
    CategoriesComponent,
    ModalCategoryComponent,
    ConsoleHeaderComponent,
    StatusesComponent,
    ModalStatusComponent,
    MembersComponent,
    ModalMemberComponent,
    EventsComponent,
    EligibilityComponent,
    BranchesComponent,
    ContributionsComponent,
    ModalBranchComponent,
    ModalEligibilityComponent,
    ModalEventComponent,
    ModalContributionComponent,
    ModalPaymentStateComponent,
    PaymentStatesComponent
  ],
  exports: [
    FeatherModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    NgbActiveModal
  ]
})
export class ConsoleModule { }
