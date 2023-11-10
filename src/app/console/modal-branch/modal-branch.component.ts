import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { BranchesService } from '../../services/branches.service';

@Component({
  selector: 'app-modal-branch',
  templateUrl: './modal-branch.component.html',
  styleUrls: ['./modal-branch.component.css']
})
export class ModalBranchComponent implements OnInit {

  @ViewChild('branchModal', { static: false }) branchModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  branchForm!: FormGroup;


  @Input() branch: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() branchModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private branchesService: BranchesService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.branchForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'Branch details';
        this.modalReference = this.modalService.open(this.branchModal, this.core.ngbModalOptions);
      } else if (this.action == 'addBranch') {
        this.modalTitle = 'Add Branch';
        this.modalReference = this.modalService.open(this.branchModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateBranch') {
        this.modalTitle = 'Update Branch details';
        this.populateBranchForm();
        this.modalReference = this.modalService.open(this.branchModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteBranch') {
        this.modalTitle = 'Delete Branch' + " | " + `${this.branch.name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateBranchForm();
        this.modalReference = this.modalService.open(this.branchModal, this.core.ngbModalOptions);
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

  onSubmitBranch() {

    if (this.branchFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.branchForm.value;
      if (values.name) values.name = values.name;

      if (this.action == "addBranch") {
        this.addBranch(values);
      } else if (this.action == "updateBranch") {
        this.updateBranch(values);
      }

    }

    return false;

  }

  addBranch(values: any) {

    this.branchesService.addBranch(values).then(r => {
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

  updateBranch(values: any) {
    let id = this.branch.id;

    this.branchesService.updateBranch(values, id).then(r => {
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

  deleteBranch() {
    this.loading = true;
    this.loadingData = true;
    let id = this.branch.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.branchesService.deleteBranch(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetBranchForm();
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

    return this.branch.name;

  }



  populateBranchForm() {

    this.branchForm.patchValue({
      name: this.branch.name,
      location: this.branch.location
    })

  }

  branchFormIsValid() {

    if (this.action == "addBranch" || this.action == "updateBranch") {
      return this.branchForm.controls['name'].valid && 
             this.branchForm.controls['location'].valid;
    } else {
      return false;
    }

  }

  restoreBranchForm() {
    this.populateBranchForm();
  }

  resetBranchForm() {
    this.branchForm?.reset();
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
    this.branchModalClosed.emit();
    if (this.action == 'addBranch' || this.action == 'updateBranch') {
      this.resetBranchForm();
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


