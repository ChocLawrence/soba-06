import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { BranchesService } from '../../services/branches.service';
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
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  @ViewChild('branchModals', { static: false }) branchModals: any;
  @ViewChild("branchesContainer", { static: false }) branchesDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public branches: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public branchesCount = 0;
  public animationType = 'wanderingCubes';

  public theBranch: any;
  public origin = 'Branches';
  public branchModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private branchesService: BranchesService) { }

  ngOnInit(): void {
    this.getBranches();
  }


  getBranches() {
    this.loadingData = true;

    this.branchesService
      .getBranches()
      .then(branches => {
        this.branchesCount = branches.data.length;
        this.branches = this._core.normalizeKeys(branches.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getBranchName(value: string) {
    let branch = this.branches.filter((item) => {
      return item._id == value;
    });
    return branch[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openBranchModal(action: string, Branch: any) {
    this.branchModalAction = action;
    this.theBranch = Branch;
    this.branchModals.openModal();
  }

  onBranchModalClosed() {
    this.branchModalAction = '';
    this.theBranch = null;
    this.getBranches();
  }

  onBranchUpdated(id: any) {
    //this.getBranch(id, 'update');
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


