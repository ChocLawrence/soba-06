import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { PaymentStatesService } from '../../services/payment-states.service';

@Component({
  selector: 'app-modal-payment-state',
  templateUrl: './modal-payment-state.component.html',
  styleUrls: ['./modal-payment-state.component.css']
})
export class ModalPaymentStateComponent implements OnInit {

  @ViewChild('paymentStateModal', { static: false }) paymentStateModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  paymentStateForm!: FormGroup;


  @Input() paymentState: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() paymentStateModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private paymentStatesService: PaymentStatesService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.paymentStateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.paymentStateForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'PaymentState details';
        this.modalReference = this.modalService.open(this.paymentStateModal, this.core.ngbModalOptions);
      } else if (this.action == 'addPaymentState') {
        this.modalTitle = 'Add PaymentState';
        this.modalReference = this.modalService.open(this.paymentStateModal, this.core.ngbModalOptions);
      } else if (this.action == 'updatePaymentState') {
        this.modalTitle = 'Update PaymentState details';
        this.populatePaymentStateForm();
        this.modalReference = this.modalService.open(this.paymentStateModal, this.core.ngbModalOptions);
      } else if (this.action == 'deletePaymentState') {
        this.modalTitle = 'Delete PaymentState' + " | " + `${this.paymentState.name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populatePaymentStateForm();
        this.modalReference = this.modalService.open(this.paymentStateModal, this.core.ngbModalOptions);
      }

      if (this.modalReference) {
        this.modalReference.result.then((result: any) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.notifyOfModalDismissal();
        });
      }
      clearTimeout(timer);
    }, 10);
  }

  onSubmitPaymentState() {

    if (this.paymentStateFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.paymentStateForm.value;
      if (values.name) values.name = values.name;

      if (this.action == "addPaymentState") {
        this.addPaymentState(values);
      } else if (this.action == "updatePaymentState") {
        this.updatePaymentState(values);
      }

    }

    return false;

  }

  addPaymentState(values: any) {

    this.paymentStatesService.addPaymentState(values).then(r => {
      this.core.showSuccess("Success", "Added Successfully...");
      this.loading = false;
      this.loadingData = false;
      this.closeModal();
    }).catch(e => {
      this.loading = false;
      this.loadingData = false;
      this.core.handleError(e);
    });

  }

  updatePaymentState(values: any) {
    let id = this.paymentState.id;

    this.paymentStatesService.updatePaymentState(values, id).then(r => {
      this.core.showSuccess("Success", "Update Successful...");
      this.loading = false;
      this.loadingData = false;
      this.closeModal();
    }).catch(e => {
      this.loading = false;
      this.loadingData = false;
      this.core.handleError(e);
    });
  }

  deletePaymentState() {
    this.loading = true;
    this.loadingData = true;
    let id = this.paymentState.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.paymentStatesService.deletePaymentState(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetPaymentStateForm();
        this.closeModal();
      }).catch(e => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
    } else {
      this.core.showError("Error", "Refreshing feed...");
    }
  }

  getLabelName() {

    return this.paymentState.name;

  }



  populatePaymentStateForm() {

    this.paymentStateForm.patchValue({
      name: this.paymentState.name,
      description: this.paymentState.description
    })

  }

  paymentStateFormIsValid() {

    if (this.action == "addPaymentState" || this.action == "updatePaymentState") {
      return this.paymentStateForm.controls['name'].valid && 
             this.paymentStateForm.controls['description'].valid;
    } else {
      return false;
    }

  }

  restorePaymentStateForm() {
    this.populatePaymentStateForm();
  }

  resetPaymentStateForm() {
    this.paymentStateForm?.reset();
  }

  getDate(date: string) {
    if (!this.core.isEmptyOrNull(date)) {
      return this.core.formatDate(date);
    } else {
      return "";
    }
  }

  closeModal() {
    this.modalReference.close();
    this.notifyOfModalDismissal();
  }

  notifyOfModalDismissal() {
    this.paymentStateModalClosed.emit();
    if (this.action == 'addPaymentState' || this.action == 'updatePaymentState') {
      this.resetPaymentStateForm();
    }
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}


