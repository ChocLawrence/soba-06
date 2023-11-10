import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { EventsService } from '../../services/events.service';
import { CategoriesService } from '../../services/categories.service';
import { StatusesService } from '../../services/statuses.service';
import { PaymentStatesService } from '../../services/payment-states.service';
import { MembersService } from '../../services/members.service';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser'
import {
  NgbDateStruct,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";
import { DxDataGridComponent } from "devextreme-angular";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  @ViewChild('eventModals', { static: false }) eventModals: any;
  @ViewChild("eventsContainer", { static: false }) eventsDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public events: any[] = [];
  public members: any[] = [];
  public paymentStates: any[] = [];
  public categories: any[] = [];
  public statuses: any[] = [];
  public limit = 10;
  public eventsCount = 0;
  public animationType = 'wanderingCubes';

  public theEvent: any;
  public origin = 'Events';
  public eventModalAction = '';

  public pageSize = 10;
  public defaultDataObject = {pageSize:this.pageSize};

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private statusesService: StatusesService,
    private categoriesService: CategoriesService,
    private paymentStatesService: PaymentStatesService,
    private membersService: MembersService,
    private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getEvents();
    this.getPaymentStates();
    this.getCategories();
    this.getStatuses();
    this.getMembers();
  }


  getPaymentStates() {
    this.loadingData = true;

    this.paymentStatesService
      .getPaymentStates()
      .then(states => {
        this.paymentStates = states.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }



  getStatuses() {
    this.loadingData = true;

    this.statusesService
      .getStatuses()
      .then(statuses => {
        this.statuses = statuses.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then(categories => {
        this.categories = categories.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getEvents() {
    this.loadingData = true;

    this.eventsService
      .getEvents(this.defaultDataObject)
      .then(events => {
        this.eventsCount = events.data.length;
        this.events = this._core.normalizeKeys(events.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getMembers() {
    this.loadingData = true;

    this.membersService
      .getMembers(this.defaultDataObject)
      .then(members => {
        this.members = members.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getCategoryName(value: string) {
    let category = this.categories.filter((item) => {
      return item.id == value;
    });
    return category[0]?.name;
  }

  getStatusName(value: string) {
    let status = this.statuses.filter((item) => {
      return item.id == value;
    });
    return status[0]?.name;
  }

  getMemberName(value: string) {
    let member = this.members.filter((item) => {
      return item.id == value;
    });
    return member[0]?.full_name;
  }



  getPaymentStateName(value: string) {
    let paymentState = this.paymentStates.filter((item) => {
      return item.id == value;
    });
    return paymentState[0].name;
  }


  openEventModal(action: string, Event: any) {
    this.eventModalAction = action;
    this.theEvent = Event;
    this.eventModals.openModal();
  }

  onEventModalClosed() {
    this.eventModalAction = '';
    this.theEvent = null;
    this.getEvents();
  }

  onEventUpdated(id: any) {
    //this.getEvent(id, 'update');
  }

  formatAmount(cost: any) {
    if (!this._core.isEmptyOrNull(cost) || cost !== "")
      return Number(cost).toFixed(2);
    else return "-";
  }

  getDate(date: string) {
    if (!this._core.isEmptyOrNull(date)) {
      return this._core.formatDate(date);
    } else {
      return "";
    }
  }

  customizeExcelCell = (options: any) => {
    var gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === "data") {

      if (gridCell.column.dataField === 'createdat') {
        options.value = this.datePipe.transform(gridCell.value, "medium");
      }

    }
  };

}


