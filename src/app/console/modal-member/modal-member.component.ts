import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { CoreService } from "../../core/core.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { MembersService } from "../../services/members.service";

@Component({
  selector: "app-modal-member",
  templateUrl: "./modal-member.component.html",
  styleUrls: ["./modal-member.component.css"],
})
export class ModalMemberComponent implements OnInit {
  @ViewChild("memberModal", { static: false }) memberModal: any;

  public dropdownSettings: any = {
    singleSelection: true,
    idField: "id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public file: any;
  public preview: any = null;
  public default = "assets/images/chair.jpg";
  public modalTitle = "";
  public modalText = "";
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;

  memberForm!: FormGroup;

  @Input() member: any;
  @Input() paymentStates: any;
  @Input() statuses: any;
  @Input() categories: any;
  @Input() branches: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() memberModalClosed = new EventEmitter();

  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private membersService: MembersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      full_name: ["", Validators.required],
      dob: ["", Validators.required],
      image: [""],
      address: ["", Validators.required],
      email: [""],
      phone: ["", Validators.required],
      bio: [""],
      status_id: [""],
      branch_id: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.memberForm.controls;
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

  public onStatusSelect(status: any) {
    this.checkStatusSelection(status);
  }

  public onStatusDeSelect(status: any) {
    this.memberForm.patchValue({
      status_id: null,
    });
  }

  public onBranchSelect(member: any) {
    this.checkBranchSelection(member);
  }

  public onBranchDeSelect(member: any) {
    this.memberForm.patchValue({
      branch_id: null,
    });
  }

  public checkBranchSelection(branch: any) {
    let value: any = branch;
    // get packages and separate with commas
    const selectedBranch = this.memberForm.value.branch_id;

    if (selectedBranch.length == 1) {
      this.memberForm.patchValue({
        branch_id: selectedBranch,
      });
    } else {
      this.memberForm.patchValue({
        branch_id: null,
      });
    }
  }

  public checkStatusSelection(status: any) {
    let value: any = status;
    // get packages and separate with commas
    const selectedStatus= this.memberForm.value.status_id;

    if (selectedStatus.length == 1) {
      this.memberForm.patchValue({
        status_id: selectedStatus,
      });
    } else {
      this.memberForm.patchValue({
        status_id: null,
      });
    }
  }

  public checkMemberSelection(member: any) {
    let value: any = member;
    // get packages and separate with commas
    const selectedMember= this.memberForm.value.branch_id;

    if (selectedMember.length == 1) {
      this.memberForm.patchValue({
        branch_id: selectedMember,
      });
    } else {
      this.memberForm.patchValue({
        branch_id: null,
      });
    }
  }


  openModal() {
    const timer = setTimeout(() => {
      if (this.action == "view") {
        this.modalTitle = "Member details";
        this.modalReference = this.modalService.open(
          this.memberModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "addMember") {
        this.modalTitle = "Add Member";
        this.modalReference = this.modalService.open(
          this.memberModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "updateMember") {
        this.modalTitle = "Update Member details";
        this.populateMemberForm();
        this.modalReference = this.modalService.open(
          this.memberModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "deleteMember") {
        this.modalTitle = "Delete Member" + " | " + `${this.member.full_name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateMemberForm();
        this.modalReference = this.modalService.open(
          this.memberModal,
          this.core.ngbModalOptions
        );
      }

      if (this.modalReference) {
        this.modalReference.result.then(
          (result: any) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.notifyOfModalDismissal();
          }
        );
      }
      clearTimeout(timer);
    }, 10);
  }

  onSubmitMember() {
    if (this.memberFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.memberForm.value;
      if (this.file) values.file = this.file;

      if (this.action == "addMember") {
        this.addMember(values);
      } else if (this.action == "updateMember") {
        this.updateMember(values);
      }
    }

    return false;
  }

  addMember(values: any) {
    this.membersService
      .addMember(values)
      .then((r) => {
        this.core.showSuccess("Success", "Added Successfully...");
        this.loading = false;
        this.loadingData = false;
        this.closeModal();
      })
      .catch((e) => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
  }

  updateMember(values: any) {
    let id = this.member.id;

    this.membersService
      .updateMember(values, id)
      .then((r) => {
        this.core.showSuccess("Success", "Update Successful...");
        this.loading = false;
        this.loadingData = false;
        this.closeModal();
      })
      .catch((e) => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
  }

  deleteMember() {
    this.loading = true;
    this.loadingData = true;
    let id = this.member.id;
    if (!this.core.isEmptyOrNull(id)) {
      this.membersService
        .deleteMember(id)
        .then((r) => {
          this.core.showSuccess("Success", "Deletion Successful...");
          this.loading = false;
          this.loadingData = false;
          this.resetMemberForm();
          this.closeModal();
        })
        .catch((e) => {
          this.loading = false;
          this.loadingData = false;
          this.core.handleError(e);
        });
    } else {
      this.core.showError("Error", "Refreshing feed...");
    }
  }

  getMemberName() {
    return this.member.address;
  }

  populateMemberForm() {
    let selectedStatus = this.statuses.filter((status: { id: any }) => {
      return status.id == this.member.status_id;
    });

    let selectedBranch = this.branches.filter((branch: { id: any }) => {
      return branch.id == this.member.branch_id;
    });


    this.memberForm.patchValue({
      full_name: this.member.full_name,
      dob: this.member.dob,
      image: this.member.image,
      address:  this.member.address,
      email: this.member.email,
      phone: this.member.phone,
      bio: this.member.bio,
      status_id: selectedStatus,
      branch_id: selectedBranch,
     
    });
  }

  memberFormIsValid() {
    if (this.action == "addMember" || this.action == "updateMember") {
      return (
        this.memberForm.controls["address"].valid &&
        this.memberForm.controls["full_name"].valid
      );
    } else {
      return false;
    }
  }

  restoreMemberForm() {
    this.populateMemberForm();
  }

  resetMemberForm() {
    this.memberForm?.reset();
    this.preview = null;
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
    this.memberModalClosed.emit();
    if (this.action == "addMember" || this.action == "updateMember") {
      this.resetMemberForm();
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
