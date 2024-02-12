import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {

  @ViewChild('userModal', { static: false }) userModal: any;


  public file: any;
  public preview: any;
  public default = 'assets/images/default.png';
  public modalTitle = '';
  public modalText = '';
  public loading = false;
  modalReference: any;
  closeResult!: string;


  userForm!: FormGroup;


  @Input() user: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() userModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    public _urls: UrlsService,
    private usersService: UsersService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      phone: [''],
      email: [''],
      gender: [''],
      dob: [''],
      image: [''],
      address: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'User details';
        this.modalReference = this.modalService.open(this.userModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateUser') {
        this.modalTitle = 'Update user details';
        this.populateUserForm();
        this.modalReference = this.modalService.open(this.userModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteUser') {
        this.modalTitle = 'Delete User' + " | " + `${this.user.firstname}` + " " + `${this.user.lastname}`;
        this.modalText = "Are you sure you want to delete ?";
        this.modalReference = this.modalService.open(this.userModal, this.core.ngbModalOptions);
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

  onSubmitUser() {

    if (this.userFormIsValid()) {
      this.loading = true;
      let values = this.userForm.value;
      if (this.file) values.file = this.file;
      let id = this.user.id;

      this.usersService.updateUser(values, id).then(r => {
        this.core.showSuccess("Success", "Update Successful...");
        this.loading = false;
        this.closeModal();
      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });

    }

    return false;

  }

  banUser() {
    this.loading = true;
    let id = this.user.id;
    if (!this.core.isEmptyOrNull(id)) {
      this.usersService.banUser(id).then(r => {
        this.core.showSuccess("Success", "Ban Successful...");
        this.loading = false;
        this.closeModal();
      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });
    } else {
      this.core.showError("Error", "Refreshing feed...");
    }
  }

  deleteUser() {
    this.loading = true;
    let id = this.user.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.usersService.deleteUser(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.closeModal();
      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });
    } else {
      this.core.showError("Error", "Refreshing feed...");
    }
  }

  populateUserForm() {

    if(this.user.image !== 'default.png'){
      this.preview = 'data:image/png;base64,' + this.user.image;
    }

    this.userForm.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      gender: this.user.gender,
      dob: this.user.dob,
      phone: this.user.phone, 
      address: this.user.address,
      email: this.user.email,
    })

  }

  userFormIsValid() {
    return this.userForm.controls['firstname'].valid
      && this.userForm.controls['lastname'].valid
      && this.userForm.controls['gender'].valid
      && this.userForm.controls['email'].valid;
  }

  restoreUserForm() {
    this.populateUserForm();
  }

  resetUserForm() {
    this.userForm?.reset();
  }

  fileChanged($event: any) {
    this.handleUpload($event);
  }
  

  handleUpload(event: any) {
    this.file = event.target.files[0];

    if (this.file && this.file.size > 1000000) {
      this.core.showError("Error", "Limit file to 1 mb");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.preview = reader.result;
    };

  }

  getDate(date: string) {
    if (!this.core.isEmptyOrNull(date)) {
      return this.core.formatDate(date);
    } else {
      return "";
    }
  }

  getRole(role: any) {
    if (role == "1") {
      return "Admin";
    } else if (role == "2") {
      return "User";
    }
    return false;
  }

  closeModal() {
    this.modalReference.close();
    this.notifyOfModalDismissal();
  }

  notifyOfModalDismissal() {
    this.userModalClosed.emit();
    if (this.action == 'updateUser') {
      this.resetUserForm();
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

