import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { StatusesService } from '../../services/statuses.service';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.css']
})
export class ModalStatusComponent implements OnInit {

  @ViewChild('statusModal', { static: false }) statusModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  statusForm!: FormGroup;


  @Input() status: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() statusModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private statusesService: StatusesService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.statusForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.statusForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'Status details';
        this.modalReference = this.modalService.open(this.statusModal, this.core.ngbModalOptions);
      } else if (this.action == 'addStatus') {
        this.modalTitle = 'Add Status';
        this.modalReference = this.modalService.open(this.statusModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateStatus') {
        this.modalTitle = 'Update Status details';
        this.populateStatusForm();
        this.modalReference = this.modalService.open(this.statusModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteStatus') {
        this.modalTitle = 'Delete Status' + " | " + `${this.status.name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateStatusForm();
        this.modalReference = this.modalService.open(this.statusModal, this.core.ngbModalOptions);
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

  onSubmitStatus() {

    if (this.statusFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.statusForm.value;
      if (values.name) values.name = values.name;

      if (this.action == "addStatus") {
        this.addStatus(values);
      } else if (this.action == "updateStatus") {
        this.updateStatus(values);
      }

    }

    return false;

  }

  addStatus(values: any) {

    this.statusesService.addStatus(values).then(r => {
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

  updateStatus(values: any) {
    let id = this.status.id;

    this.statusesService.updateStatus(values, id).then(r => {
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

  deleteStatus() {
    this.loading = true;
    this.loadingData = true;
    let id = this.status.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.statusesService.deleteStatus(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetStatusForm();
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

    return this.status.name;

  }



  populateStatusForm() {

    this.statusForm.patchValue({
      name: this.status.name,
      description: this.status.description
    })

  }

  statusFormIsValid() {

    if (this.action == "addStatus" || this.action == "updateStatus") {
      return this.statusForm.controls['name'].valid && 
             this.statusForm.controls['description'].valid;
    } else {
      return false;
    }

  }

  restoreStatusForm() {
    this.populateStatusForm();
  }

  resetStatusForm() {
    this.statusForm?.reset();
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
    this.statusModalClosed.emit();
    if (this.action == 'addStatus' || this.action == 'updateStatus') {
      this.resetStatusForm();
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


