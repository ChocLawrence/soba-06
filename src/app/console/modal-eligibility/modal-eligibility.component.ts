import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { EligibilityService } from '../../services/eligibility.service';

@Component({
  selector: 'app-modal-eligibility',
  templateUrl: './modal-eligibility.component.html',
  styleUrls: ['./modal-eligibility.component.css']
})
export class ModalEligibilityComponent implements OnInit {

  @ViewChild('eligibilityModal', { static: false }) eligibilityModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  eligibilityForm!: FormGroup;


  @Input() eligibility: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() eligibilityModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private eligibilityService: EligibilityService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.eligibilityForm = this.fb.group({
      percentage: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.eligibilityForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'Eligibility details';
        this.modalReference = this.modalService.open(this.eligibilityModal, this.core.ngbModalOptions);
      } else if (this.action == 'addEligibility') {
        this.modalTitle = 'Add Eligibility';
        this.modalReference = this.modalService.open(this.eligibilityModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateEligibility') {
        this.modalTitle = 'Update Eligibility details';
        this.populateEligibilityForm();
        this.modalReference = this.modalService.open(this.eligibilityModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteEligibility') {
        this.modalTitle = 'Delete Eligibility' + " | " + `${this.eligibility.percentage}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateEligibilityForm();
        this.modalReference = this.modalService.open(this.eligibilityModal, this.core.ngbModalOptions);
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

  onSubmitEligibility() {

    if (this.eligibilityFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.eligibilityForm.value;
      if (values.percentage) values.percentage = values.percentage;

      if (this.action == "addEligibility") {
        this.addEligibility(values);
      } else if (this.action == "updateEligibility") {
        this.updateEligibility(values);
      }

    }

    return false;

  }

  addEligibility(values: any) {

    this.eligibilityService.addEligibility(values).then(r => {
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

  updateEligibility(values: any) {
    let id = this.eligibility.id;

    this.eligibilityService.updateEligibility(values, id).then(r => {
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

  deleteEligibility() {
    this.loading = true;
    this.loadingData = true;
    let id = this.eligibility.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.eligibilityService.deleteEligibility(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetEligibilityForm();
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

    return this.eligibility.percentage;

  }



  populateEligibilityForm() {

    this.eligibilityForm.patchValue({
      percentage: this.eligibility.percentage
    })

  }

  eligibilityFormIsValid() {

    if (this.action == "addEligibility" || this.action == "updateEligibility") {
      return this.eligibilityForm.controls['percentage'].valid;
    } else {
      return false;
    }

  }

  restoreEligibilityForm() {
    this.populateEligibilityForm();
  }

  resetEligibilityForm() {
    this.eligibilityForm?.reset();
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
    this.eligibilityModalClosed.emit();
    if (this.action == 'addEligibility' || this.action == 'updateEligibility') {
      this.resetEligibilityForm();
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


