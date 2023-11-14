import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { ContributionsService } from '../../services/contributions.service';
import { EventsService } from '../../services/events.service';
import { StatusesService } from '../../services/statuses.service';
import { PaymentStatesService } from '../../services/payment-states.service';
import { MembersService } from '../../services/members.service';
import { PrintingService } from '../../services/printing.service';
import { routerTransition } from '../../router.animations';
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

import { Pipe, PipeTransform } from '@angular/core';

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
  public layoutFormGroup: FormGroup;
  public autoExpand = false;
  public layout = 'collapse';
  public loadingData = false;
  public contributions: any[] = [];
  public allContributions: any[] = [];
  public tempAllContributions: any[] = [];
  public contributionSum;
  public eventSumsData: any[] = [];
  public members: any[] = [];
  public paymentStates: any[] = [];
  public events: any[] = [];
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
    this.getContributions(this.defaultDataObject);
    this.getPaymentStates();
    this.getEvents();
    this.getStatuses();
    this.initSearchContributionsForm();
    this.initLayoutForm();
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
      soba_member_id: [''],
      soba_event_id: ['']
    });
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

    this.getContributions(values);

    //this.allContributions = filteredContributions;
  }

  public onMemberSelect(contribution: any) {
    this.checkMemberSelection(contribution);
  }

  public onMemberDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      soba_member_id: null,
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
      soba_event_id: null,
    });
    this.onSubmitSearchContributions();
  }

  public checkEventSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedEvent = this.searchContributionForm.value.soba_event_id;

    if (selectedEvent.length == 1) {
      this.searchContributionForm.patchValue({
        soba_event_id: selectedEvent,
      });
    } else {
      this.searchContributionForm.patchValue({
        soba_event_id: null,
      });
    }

    this.onSubmitSearchContributions();
  }


  public checkMemberSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedMember = this.searchContributionForm.value.soba_member_id;

    if (selectedMember.length == 1) {
      this.searchContributionForm.patchValue({
        soba_member_id: selectedMember,
      });
    } else {
      this.searchContributionForm.patchValue({
        soba_member_id: null,
      });
    }

    this.onSubmitSearchContributions();
  }

  resetForm() {
    this.searchContributionForm.reset();
  }

  //SEARCH END

  //GROUPING

  calculGrouping = (rowData: any) => {
    return rowData.created_at;
  };

  public getTitle(cellInfo) {
    let stateValue = 'Continues on next page';
    //code has to be adjustment depending on how many groupings are allowed
    //the more grouping the grid has, the deeper the items[0].State goes into the object

    if (
      cellInfo.row.data.collapsedItems &&
      cellInfo.row.data.collapsedItems.length != 0
    ) {
      let member = cellInfo.row.data.collapsedItems[0].id;
      stateValue = `
      ${this.getMemberName(member)}`;
      return stateValue;
    } else if (cellInfo.row.data.items && cellInfo.row.data.items.length != 0) {
      let member = cellInfo.row.data.items[0].id;
      stateValue = `
      ${this.getMemberName(member)}`;
      return stateValue;
    }

    return stateValue;
  }

  //END GROUPING

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
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
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
                return item.soba_member_id == member.id;
              });

              if (!this._core.isEmptyOrNull(contributions.length)) {
                let pushItem = {};
                let contributionTotal = 0;
                contributions.forEach((contribution, index) => {
                  // let pushItem = { ...item, ...member };
                  // pushItem.contribution_status_id = item.soba_status_id;
                  //data.push(pushItem);
                  member['event_' + contribution.soba_event_id] =
                    contribution.soba_event_id;
                  member['amount_' + contribution.soba_event_id] =
                    contribution.amount;
                  member['status_' + contribution.soba_event_id] =
                    contribution.soba_status_id;
                  member['date_' + contribution.soba_event_id] =
                    contribution.created_at;
                  contributionTotal += Number(contribution.amount);
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

  computeDate(contribution:any) {
    
    let date = '--';

    if(contribution.date_1){
       date = this._core.getDate(contribution.date_1);
    }else if(contribution.date_2){
      date =  this._core.getDate(contribution.date_2);
    }else if(contribution.date_3){
      date =  this._core.getDate(contribution.date_3);
    }else if(contribution.date_4){
      date =  this._core.getDate(contribution.date_4);
    }else if(contribution.date_5){
      date =  this._core.getDate(contribution.date_5);
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
    return event[0].name ? event[0].name : '--';
  }

  oncontributionUpdated(id: any) {
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
        return item.soba_event_id == event.id;
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

  sumAllContributions( obj ) {
    let sum = obj.reduce(function (s, a) {
      return s + (isNaN(Number(a.total)) ? 0 : Number(a.total));
    }, 0);
    return sum
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
