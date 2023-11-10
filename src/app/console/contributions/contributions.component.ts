import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { ContributionsService } from '../../services/contributions.service';
import { EventsService } from '../../services/events.service';
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
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css']
})
export class ContributionsComponent implements OnInit {

  @ViewChild('contributionModals', { static: false }) contributionModals: any;
  @ViewChild("contributionsContainer", { static: false }) contributionsDataGrid: DxDataGridComponent | undefined;

  public dropdownSettings: any = {
    singleSelection: true,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public memberDropdownSettings: any = {
    singleSelection: true,
    idField: "id",
    textField: "full_name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };


  public loadingData = false;
  public contributions: any[] = [];
  public members: any[] = [];
  public paymentStates: any[] = [];
  public events: any[] = [];
  public statuses: any[] = [];
  public pageSize = 10;
  public defaultDataObject = {pageSize:this.pageSize};
  public limit = 10;
  public contributionsCount = 0;
  public animationType = 'wanderingCubes';

  public theContribution: any;
  public origin = 'contributions';
  public contributionModalAction = '';


  searchContributionForm: FormGroup;

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private statusesService: StatusesService,
    private eventsService: EventsService,
    private fb: FormBuilder,
    private paymentStatesService: PaymentStatesService,
    private membersService: MembersService,
    private contributionsService: ContributionsService) { }

  ngOnInit(): void {
    this.getContributions(this.defaultDataObject);
    this.getPaymentStates();
    this.getEvents();
    this.getStatuses();
    this.getMembers();
    this.initSearchContributionsForm();
  }

  //SEARCH BEGIN

  initSearchContributionsForm() {
    this.searchContributionForm = this.fb.group({
      soba_member_id: [""],
      soba_event_id: [""],
      soba_status_id: [""]
    });
  }

  searchContributionFormIsValid() {
    return true;
  }

  resetContributionsForm(){
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
    this.getContributions(values);
   
  }

  public onStatusSelect(contribution: any) {
    this.checkStatusSelection(contribution);
  }

  public onStatusDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      soba_status_id: null,
    });
  }

  public onMemberSelect(contribution: any) {
    this.checkMemberSelection(contribution);
  }

  public onMemberDeSelect(contribution: any) {
    this.searchContributionForm.patchValue({
      soba_member_id: null,
    });
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
  }


  public checkStatusSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedStatus= this.searchContributionForm.value.soba_status_id;

    if (selectedStatus.length == 1) {
      this.searchContributionForm.patchValue({
        soba_status_id: selectedStatus,
      });
    } else {
      this.searchContributionForm.patchValue({
        soba_status_id: null,
      });
    }
  }

  public checkMemberSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedMember= this.searchContributionForm.value.soba_member_id;

    if (selectedMember.length == 1) {
      this.searchContributionForm.patchValue({
        soba_member_id: selectedMember,
      });
    } else {
      this.searchContributionForm.patchValue({
        soba_member_id: null,
      });
    }
  }


  //SEARCH END


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


  getEvents() {
    this.loadingData = true;

    this.eventsService
      .getEvents(this.defaultDataObject)
      .then(events => {
        this.events = events.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getContributions(searchObject:any) {
    this.loadingData = true;

    this.contributionsService
      .getContributions(searchObject)
      .then(contributions => {
        this.contributionsCount = contributions.data.length;
        this.contributions = this._core.normalizeKeys(contributions.data);
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
    return event[0].name;
  }


  openContributionModal(action: string, contribution: any) {
    this.contributionModalAction = action;
    this.theContribution = contribution;
    this.contributionModals.openModal();
  }

  onContributionModalClosed() {
    this.contributionModalAction = '';
    this.theContribution = null;
    this.getContributions(this.defaultDataObject);
  }

  oncontributionUpdated(id: any) {
    //this.getcontribution(id, 'update');
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


