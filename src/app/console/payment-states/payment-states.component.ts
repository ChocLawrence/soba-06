import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { PaymentStatesService } from '../../services/payment-states.service';
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
  selector: 'app-payment-states',
  templateUrl: './payment-states.component.html',
  styleUrls: ['./payment-states.component.css']
})
export class PaymentStatesComponent implements OnInit {

  @ViewChild('paymentStateModals', { static: false }) paymentStateModals: any;
  @ViewChild("paymentStatesContainer", { static: false }) paymentStatesDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public paymentStates: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public paymentStatesCount = 0;
  public animationType = 'wanderingCubes';

  public thePaymentState: any;
  public origin = 'PaymentStates';
  public paymentStateModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private paymentStatesService: PaymentStatesService) { }

  ngOnInit(): void {
    this.getPaymentStates();
  }


  getPaymentStates() {
    this.loadingData = true;

    this.paymentStatesService
      .getPaymentStates()
      .then(paymentStates => {
        this.paymentStatesCount = paymentStates.data.length;
        this.paymentStates = this._core.normalizeKeys(paymentStates.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getPaymentStateName(value: string) {
    let paymentState = this.paymentStates.filter((item) => {
      return item._id == value;
    });
    return paymentState[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openPaymentStateModal(action: string, PaymentState: any) {
    this.paymentStateModalAction = action;
    this.thePaymentState = PaymentState;
    this.paymentStateModals.openModal();
  }

  onPaymentStateModalClosed() {
    this.paymentStateModalAction = '';
    this.thePaymentState = null;
    this.getPaymentStates();
  }

  onPaymentStateUpdated(id: any) {
    //this.getPaymentState(id, 'update');
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


