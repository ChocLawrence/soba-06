import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { EligibilityService } from '../../services/eligibility.service';
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
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.css']
})
export class EligibilityComponent implements OnInit {

  @ViewChild('eligibilityModals', { static: false }) eligibilityModals: any;
  @ViewChild("eligibilityContainer", { static: false }) eligibilityDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public eligibility: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public eligibilityCount = 0;
  public animationType = 'wanderingCubes';

  public theEligibility: any;
  public origin = 'Eligibility';
  public eligibilityModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private eligibilityService: EligibilityService) { }

  ngOnInit(): void {
    this.getEligibility();
  }


  getEligibility() {
    this.loadingData = true;

    this.eligibilityService
      .getEligibility()
      .then(eligibility => {
        this.eligibilityCount = eligibility.data.length;
        this.eligibility = this._core.normalizeKeys(eligibility.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getEligibilityName(value: string) {
    let eligibility = this.eligibility.filter((item) => {
      return item._id == value;
    });
    return eligibility[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openEligibilityModal(action: string, Eligibility: any) {
    this.eligibilityModalAction = action;
    this.theEligibility = Eligibility;
    this.eligibilityModals.openModal();
  }

  onEligibilityModalClosed() {
    this.eligibilityModalAction = '';
    this.theEligibility = null;
    this.getEligibility();
  }

  onEligibilityUpdated(id: any) {
    //this.getEligibility(id, 'update');
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


