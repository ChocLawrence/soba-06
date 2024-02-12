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
import { ContributionsService } from "../../services/contributions.service";

@Component({
  selector: "app-modal-contribution",
  templateUrl: "./modal-contribution.component.html",
  styleUrls: ["./modal-contribution.component.css"],
})
export class ModalContributionComponent implements OnInit {
  @ViewChild("contributionModal", { static: false }) contributionModal: any;

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

  public memberDropdownSettings: any = {
    singleSelection: true,
    idField: "id",
    textField: "full_name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public modalTitle = "";
  public modalText = "";
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;

  contributionForm!: FormGroup;

  @Input() contribution: any;
  @Input() events: any;
  @Input() statuses: any;
  @Input() categories: any;
  @Input() members: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() contributionModalClosed = new EventEmitter();

  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private contributionsService: ContributionsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.contributionForm = this.fb.group({
      amount: ["", Validators.required],
      event_id: ["", Validators.required],
      status_id: [""],
      member_id: ["", Validators.required],
      comment: ["",]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.contributionForm.controls;
  }

  public onEventSelect(contribution: any) {
    this.checkEventSelection(contribution);
  }

  public onEventDeSelect(contribution: any) {
    this.contributionForm.patchValue({
      event_id: null,
    });
  }

  public onStatusSelect(contribution: any) {
    this.checkStatusSelection(contribution);
  }

  public onStatusDeSelect(contribution: any) {
    this.contributionForm.patchValue({
      status_id: null,
    });
  }

  public onMemberSelect(contribution: any) {
    this.checkMemberSelection(contribution);
  }

  public onMemberDeSelect(contribution: any) {
    this.contributionForm.patchValue({
      member_id: null,
    });
  }

  public checkEventSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedEvent = this.contributionForm.value.event_id;

    if (selectedEvent.length == 1) {
      this.contributionForm.patchValue({
        event_id: selectedEvent,
      });
    } else {
      this.contributionForm.patchValue({
        event_id: null,
      });
    }
  }


  public checkStatusSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedStatus= this.contributionForm.value.status_id;

    if (selectedStatus.length == 1) {
      this.contributionForm.patchValue({
        status_id: selectedStatus,
      });
    } else {
      this.contributionForm.patchValue({
        status_id: null,
      });
    }
  }

  public checkMemberSelection(contribution: any) {
    let value: any = contribution;
    // get packages and separate with commas
    const selectedMember= this.contributionForm.value.member_id;

    if (selectedMember.length == 1) {
      this.contributionForm.patchValue({
        member_id: selectedMember,
      });
    } else {
      this.contributionForm.patchValue({
        member_id: null,
      });
    }
  }


  openModal() {
    const timer = setTimeout(() => {
      if (this.action == "view") {
        this.modalTitle = "Contribution details";
        this.modalReference = this.modalService.open(
          this.contributionModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "addContribution") {
        this.modalTitle = "Add Contribution";
        this.modalReference = this.modalService.open(
          this.contributionModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "updateContribution") {
        this.modalTitle = "Update Contribution details";
        this.populateContributionForm();
        this.modalReference = this.modalService.open(
          this.contributionModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "deleteContribution") {
        this.modalTitle = "Delete Contribution" + " | " + `${this.contribution.event_id}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateContributionForm();
        this.modalReference = this.modalService.open(
          this.contributionModal,
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

  onSubmitContribution() {
    if (this.contributionFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.contributionForm.value;

      if (this.action == "addContribution") {
        this.addContribution(values);
      } else if (this.action == "updateContribution") {
        this.updateContribution(values);
      }
    }

    return false;
  }

  addContribution(values: any) {
    this.contributionsService
      .addContribution(values)
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

  updateContribution(values: any) {
    let id = this.contribution.id;

    this.contributionsService
      .updateContribution(values, id)
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

  deleteContribution() {
    this.loading = true;
    this.loadingData = true;
    let id = this.contribution.id;
    if (!this.core.isEmptyOrNull(id)) {
      this.contributionsService
        .deleteContribution(id)
        .then((r) => {
          this.core.showSuccess("Success", "Deletion Successful...");
          this.loading = false;
          this.loadingData = false;
          this.resetContributionForm();
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

  getContributionName() {
    return this.contribution.event_id;
  }

  populateContributionForm() {
    let selectedEvent = this.events.filter((paymentState: { id: any }) => {
      return paymentState.id == this.contribution.event_id;
    });

    let selectedStatus = this.statuses.filter((status: { id: any }) => {
      return status.id == this.contribution.status_id;
    });

    let selectedMember = this.members.filter((member: { id: any }) => {
      return member.id == this.contribution.member_id;
    });


    this.contributionForm.patchValue({
      amount: this.contribution.amount, 
      member_id: selectedMember,
      event_id: selectedEvent,
      status_id: selectedStatus,
      comment: this.contribution.comment,
    });
  }

  contributionFormIsValid() {
    if (this.action == "addContribution" || this.action == "updateContribution") {
      return (
        this.contributionForm.controls["amount"].valid &&
        this.contributionForm.controls["event_id"].valid &&
        this.contributionForm.controls["status_id"].valid &&
        this.contributionForm.controls["member_id"].valid
      );
    } else {
      return false;
    }
  }

  restoreContributionForm() {
    this.populateContributionForm();
  }

  resetContributionForm() {
    this.contributionForm?.reset();
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
    this.contributionModalClosed.emit();
    if (this.action == "addContribution" || this.action == "updateContribution") {
      this.resetContributionForm();
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
