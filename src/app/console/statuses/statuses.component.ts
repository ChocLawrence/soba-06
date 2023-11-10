import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { StatusesService } from '../../services/statuses.service';
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
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.css']
})
export class StatusesComponent implements OnInit {

  @ViewChild('statusModals', { static: false }) statusModals: any;
  @ViewChild("statusesContainer", { static: false }) statusesDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public statuses: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public statusesCount = 0;
  public animationType = 'wanderingCubes';

  public theStatus: any;
  public origin = 'Statuses';
  public statusModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private statusesService: StatusesService) { }

  ngOnInit(): void {
    this.getStatuses();
  }


  getStatuses() {
    this.loadingData = true;

    this.statusesService
      .getStatuses()
      .then(statuses => {
        this.statusesCount = statuses.data.length;
        this.statuses = this._core.normalizeKeys(statuses.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getStatusName(value: string) {
    let status = this.statuses.filter((item) => {
      return item._id == value;
    });
    return status[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openStatusModal(action: string, Status: any) {
    this.statusModalAction = action;
    this.theStatus = Status;
    this.statusModals.openModal();
  }

  onStatusModalClosed() {
    this.statusModalAction = '';
    this.theStatus = null;
    this.getStatuses();
  }

  onStatusUpdated(id: any) {
    //this.getStatus(id, 'update');
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


