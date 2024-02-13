import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../../core/core.service';
import { ContributionsService } from '../../../services/contributions.service';
import { EventsService } from '../../../services/events.service';
import { StatusesService } from '../../../services/statuses.service';
import { PaymentStatesService } from '../../../services/payment-states.service';
import { MembersService } from '../../../services/members.service';
import { PrintingService } from '../../../services/printing.service';
import { routerTransition } from '../../../router.animations';
import * as _ from 'lodash';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  NgbDateStruct,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';


@Component({
  selector: 'app-contributions-details',
  templateUrl: './contributions-details.component.html',
  styleUrls: ['./contributions-details.component.css'],
})
export class ContributionsDetailsComponent implements OnInit {
  @ViewChild('contributionsContainer', { static: false })
  contributionsDataGrid: DxDataGridComponent;
  @ViewChild('expand', { static: true }) expand: any;
  @ViewChild('printableArea', { static: true }) printableArea: any;

  public dropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public memberDropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'full_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public currentDate = new Date();
  public currentYear = this.currentDate.getFullYear();
  public layoutFormGroup: FormGroup;
  public autoExpand = false;
  public layout = 'collapse';
  public loadingData = false;
  public contributions: any[] = [];
  public allContributions: any[] = [];
  public tempAllContributions: any[] = [];
  public contributionSum;
  public ongoingStatus: any;
  public eventSumsData: any[] = [];
  public members: any[] = [];
  public years: any[] = [
    { id: 1, name: '2023' },
    { id: 2, name: this.currentYear },
  ];
  public paymentStates: any[] = [];
  public events: any[] = [];
  public ongoingEvents: any[] = [];
  public statuses: any[] = [];
  public pageSize = 10;
  public defaultDataObject = { pageSize: this.pageSize };
  public limit = 10;
  public contributionsCount = 0;
  public eventsCount = 0;
  public animationType = 'wanderingCubes';

  public theContribution: any;
  public origin = 'contributions';
  public contributionModalAction = '';

  //print data
  public serviceProviderInfo: any;
  public allInfo: any;
  public pageCount: any;
  public pageGroup = [];
  public serviceFeeData: any;
  public currentPatient: any;

  //end print data
  //[customizeColumns]="customizeColumns"
  // public customizeColumns (columns) {
  //   columns[0].caption = 'ID'; 
  //   columns[0].visible = false;
  //   columns[1].caption = 'FULL NAMES'; 
  //   columns[1].width = 'auto';
  //   columns[2].dataField = 'amount_1';
  // }


  searchContributionForm: FormGroup;

  constructor(
    public _core: CoreService,
    private datePipe: DatePipe,
    private statusesService: StatusesService,
    private eventsService: EventsService,
    private fb: FormBuilder,
    private printingService: PrintingService,
    private paymentStatesService: PaymentStatesService,
    private membersService: MembersService,
    private contributionsService: ContributionsService
  ) {}

  ngOnInit(): void {
    this.getPaymentStates();
    this.getEvents();
    this.getStatuses();
    this.initSearchContributionsForm();
    this.initLayoutForm();
    //this.tests();
  }

  tests(){
    console.log('>>>',this.contributionsDataGrid);
  }
  //SEARCH BEGIN

  initLayoutForm() {
    this.layoutFormGroup = this.fb.group({
      layout: [''],
    });
  }

  loadLayoutForm() {
    this.layoutFormGroup.patchValue({
      layout: this.layout,
    });
  }

  onLayoutSelect(event) {
    let layoutChooser = this.layoutFormGroup.controls['layout'].value;
    if (!this._core.isEmptyOrNull(layoutChooser)) {
      this.layout = layoutChooser;
      if (this.layout == 'expand') {
        event.autoExpandAll = true;
      } else {
        event.autoExpandAll = false;
      }
    }
  }

  initSearchContributionsForm() {
    this.searchContributionForm = this.fb.group({
      member_id: [''],
      event_id: [''],
      year_id: [''],
    });
    this.loadForm();
  }

  loadForm() {

    let selectedYear = this.years.filter((year) => {
      return year.name ==this.currentYear.toString();
    });

    this.searchContributionForm.patchValue({
      year_id: selectedYear,
    });

    this.onSubmitSearchContributions();

  }

  searchContributionFormIsValid() {
    return true;
  }

  resetContributionsForm() {
    this.searchContributionForm.reset();
  }

  onSubmitSearchContributions() {
    if (this.searchContributionFormIsValid()) {
      this.searchContributions();
    }
  }

  searchContributions() {
    let values = this.searchContributionForm.value;
    //let name = values.name.trim();
    //this.getMembers(values);
    //filter contributions

    let eventObj = [];
    if (values.event_id) {
      eventObj.push(values.event_id[0].id);
      values.event_id = eventObj;
    }

    this.getContributions(values);
  }

  public onMemberSelect(contribution: any) {
    this.checkMemberSelection(contribution);
  }

  public onMemberDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      member_id: null,
    });
    this.onSubmitSearchContributions();
  }

  public onYearSelect(contribution: any) {
    this.checkYearSelection(contribution);
  }

  public onYearDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      year_id: null,
    });
    this.onSubmitSearchContributions();
  }

  get f() {
    return this.searchContributionForm.controls;
  }

  public onEventSelect(contribution: any) {
    this.checkEventSelection(contribution);
  }

  public onEventDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      event_id: null,
    });
    this.onSubmitSearchContributions();
  }

  public checkEventSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedEvent = this.searchContributionForm.value.event_id;

    if (selectedEvent.length == 1) {
      this.searchContributionForm.patchValue({
        event_id: selectedEvent,
      });
    } else {
      this.searchContributionForm.patchValue({
        event_id: null,
      });
    }

    this.onSubmitSearchContributions();
  }

  public checkMemberSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedMember = this.searchContributionForm.value.member_id;

    if (selectedMember.length == 1) {
      this.searchContributionForm.patchValue({
        member_id: selectedMember,
      });
    } else {
      this.searchContributionForm.patchValue({
        member_id: null,
      });
    }

    this.onSubmitSearchContributions();
  }

  public checkYearSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedMember = this.searchContributionForm.value.year_id;

    if (selectedMember.length == 1) {
      this.searchContributionForm.patchValue({
        year_id: selectedMember,
      });
    } else {
      this.searchContributionForm.patchValue({
        year_id: null,
      });
    }

    this.onSubmitSearchContributions();
  }


  resetForm() {
    this.searchContributionForm.reset();
  }

  //SEARCH END

  getPaymentStates() {
    this.loadingData = true;

    this.paymentStatesService
      .getPaymentStates()
      .then((states) => {
        this.paymentStates = states.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getStatuses() {
    this.loadingData = true;

    this.statusesService
      .getStatuses()
      .then((statuses) => {
        this.statuses = statuses.data;
        let ongoingStatus = this.getStatus('ongoing');
        this.ongoingStatus = ongoingStatus;
        this.getOngoingEvents();
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getOngoingEvents() {
    if (this.events && this.ongoingStatus) {
      let ongoingEvents = this.events.filter((item) => {
        return item.status_id == this.ongoingStatus[0].id;
      });

      this.ongoingEvents = ongoingEvents;
    }

    //this.getContributions(this.defaultDataObject);
  }

  getStatus(value: string) {
    let status = this.statuses.filter((item) => {
      return item.slug == value.toString();
    });
    return status;
  }

  getEvents() {
    this.loadingData = true;

    this.eventsService
      .getEvents(this.defaultDataObject)
      .then((events) => {
        this.eventsCount = events.data.length;
        this.events = events.data;
        this.getEventColumnHeaders();
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getEventColumnHeaders() {}

  getContributions(searchObject: any) {
    this.loadingData = true;

    //check for ongoing
    //&& this._core.isEmptyOrNull(searchObject.event_id)

    if (this.ongoingEvents.length > 0) {
      let ongoingObject = [];

      this.ongoingEvents.forEach((item) => {
        ongoingObject.push(item.id);
      });

      searchObject.event_id = ongoingObject;
    }

    //end check for ongoing events

    this.contributionsService
      .getContributions(searchObject)
      .then((contributions) => {
        this.contributionsCount = contributions.data.length;

        this.contributions = this._core.normalizeKeys(contributions.data);
        this.getMembers(searchObject);
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getMembers(searchObject) {
    this.loadingData = true;
    let dataObject = !this._core.isEmptyOrNull(searchObject)
      ? searchObject
      : this.defaultDataObject;

    this.membersService
      .getMembers(dataObject)
      .then((allMembers) => {
        let data = [];

        this.members = this._core.normalizeKeys(allMembers.data);

        if (allMembers.data.length != 0) {
          allMembers.data.forEach((member) => {
            if (!this._core.isEmptyOrNull(this.contributions.length)) {
              let contributions = this.contributions.filter((item) => {
                return item.member_id == member.id;
              });

              if (!this._core.isEmptyOrNull(contributions.length)) {
                let pushItem = {};
                let contributionTotal = 0;

                contributions.forEach((contribution, index) => {
                  member['event_' + contribution.event_id] =
                    contribution.event_id;
                  member['amount_' + contribution.event_id] =
                    contribution.amount;
                  member['status_' + contribution.event_id] =
                    contribution.status_id;
                  member['date_' + contribution.event_id] =
                    contribution.created_at;
                  contributionTotal += contribution.amount
                    ? Number(contribution.amount)
                    : Number(0);
                });
                pushItem = { ...member, total: contributionTotal };
                data.push(pushItem);
              } else {
                let pushItem = { ...member };
                data.push(pushItem);
              }
            }
          });
        }

        //sort in alphabetical order of column
        data = _.orderBy(data, ['full_name'], ['asc']);
        this.allContributions = data;
        this.tempAllContributions = this.allContributions;
        //console.log(data.length);
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  computeDate(contribution: any) {
    let date = '--';

    if (contribution.date_1) {
      date = this._core.getDate(contribution.date_1);
    } else if (contribution.date_2) {
      date = this._core.getDate(contribution.date_2);
    } else if (contribution.date_3) {
      date = this._core.getDate(contribution.date_3);
    } else if (contribution.date_4) {
      date = this._core.getDate(contribution.date_4);
    } else if (contribution.date_5) {
      date = this._core.getDate(contribution.date_5);
    } else if (contribution.date_6) {
      date = this._core.getDate(contribution.date_6);
    } else if (contribution.date_7) {
      date = this._core.getDate(contribution.date_7);
    } else if (contribution.date_8) {
      date = this._core.getDate(contribution.date_8);
    }

    return date;
  }

  getCategoryName(value: string) {
    let category = this.events.filter((item) => {
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

  getEventName(value: string) {
    let event = this.events.filter((item) => {
      return item.id == value;
    });
    return event && event[0] && event[0].name ? event[0].name : '--';
  }

  onContributionUpdated(id: any) {
    //this.getcontribution(id, 'update');
  }

  //PRINT

  printContributions() {
    this.loadingData = true;
    this.pageCount = 1;
    this.contributionSum = this.sumAllContributions(this.allContributions);
    //get sum of individual events
    let data = [];
    this.events.forEach((event) => {
      //for each event, filter contributions and sum amount

      let contributions = this.contributions.filter((item) => {
        return item.event_id == event.id;
      });

      let eventSum = this.sumContributions(contributions);
      data.push({
        sum: eventSum,
        id: event.id,
        collected_by: event.collected_by,
      });
    });
    this.eventSumsData = data;
    this.printingService.print(this.printableArea);
    this.loadingData = false;
  }

  sumAllContributions(obj) {
    let sum = obj.reduce(function (s, a) {
      return s + (isNaN(Number(a.total)) ? 0 : Number(a.total));
    }, 0);
    return sum;
  }

  sumContributions(obj) {
    let sum = obj.reduce(function (s, a) {
      return s + (isNaN(Number(a.amount)) ? 0 : Number(a.amount));
    }, 0);
    return sum;
  }

  //END PRINT

  formatAmount(cost: any) {
    if (!this._core.isEmptyOrNull(cost) || cost !== '')
      return Number(cost).toFixed(2);
    else return '-';
  }

  getDate(date: string) {
    if (!this._core.isEmptyOrNull(date)) {
      return this._core.formatDate(date);
    } else {
      return '';
    }
  }

  customizeExcelCell = (options: any) => {
    var gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === 'data') {
      if (gridCell.column.dataField === 'createdat') {
        options.value = this.datePipe.transform(gridCell.value, 'medium');
      }
    }
  };
}
