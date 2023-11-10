import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { BranchesService } from '../../services/branches.service';
import { CategoriesService } from '../../services/categories.service';
import { StatusesService } from '../../services/statuses.service';
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
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  @ViewChild('memberModals', { static: false }) memberModals: any;
  @ViewChild("branchesContainer", { static: false }) branchesDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public branches: any[] = [];
  public members: any[] = [];
  public paymentStates: any[] = [];
  public categories: any[] = [];
  public statuses: any[] = [];
  public limit = 10;
  public branchesCount = 0;
  public animationType = 'wanderingCubes';

  public theMember: any;
  public origin = 'Branches';
  public memberModalAction = '';
  public pageSize = 10;
  public defaultDataObject = {pageSize:this.pageSize};

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private statusesService: StatusesService,
    private categoriesService: CategoriesService,
    private membersService: MembersService,
    private branchesService: BranchesService) { }

  ngOnInit(): void {
    this.getMembers();
    this.getBranches();
    this.getStatuses();
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


  getBranches() {
    this.loadingData = true;

    this.branchesService
      .getBranches()
      .then(branches => {
        this.branches = branches.data;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getStatusName(value: string) {
    let status = this.statuses.filter((item) => {
      return item.id == value;
    });
    return status[0].name;
  }

  getBranchName(value: string) {
    let branch = this.branches.filter((item) => {
      return item.id == value;
    });
    return branch[0].name;
  }

  openMemberModal(action: string, Member: any) {
    this.memberModalAction = action;
    this.theMember = Member;
    this.memberModals.openModal();
  }

  onMemberModalClosed() {
    this.memberModalAction = '';
    this.theMember = null;
    this.getMembers();
  }

  onMemberUpdated(id: any) {
    //this.getMember(id, 'update');
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


