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
import { EventsService } from "../../services/events.service";

@Component({
  selector: "app-modal-event",
  templateUrl: "./modal-event.component.html",
  styleUrls: ["./modal-event.component.css"],
})
export class ModalEventComponent implements OnInit {
  @ViewChild("eventModal", { static: false }) eventModal: any;

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

  eventForm!: FormGroup;

  @Input() event: any;
  @Input() paymentStates: any;
  @Input() statuses: any;
  @Input() categories: any;
  @Input() members: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() eventModalClosed = new EventEmitter();

  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private eventsService: EventsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      amount: ["", Validators.required],
      payment_state: ["", Validators.required],
      category_id: ["", Validators.required],
      deadline: ["", Validators.required],
      handed_over_date: [""],
      handed_over_by: [""],
      collected_by: ["", Validators.required],
      comment: ["",],
      status_id: [""],
      member_id: [""],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.eventForm.controls;
  }

  public onPaymentStateSelect(event: any) {
    this.checkPaymentStateSelection(event);
  }

  public onPaymentStateDeSelect(event: any) {
    this.eventForm.patchValue({
      payment_state: null,
    });
  }

  public onCategorySelect(event: any) {
    this.checkCategorySelection(event);
  }

  public onCategoryDeSelect(event: any) {
    this.eventForm.patchValue({
      category_id: null,
    });
  }

  public onStatusSelect(event: any) {
    this.checkStatusSelection(event);
  }

  public onStatusDeSelect(event: any) {
    this.eventForm.patchValue({
      status_id: null,
    });
  }

  public onMemberSelect(event: any) {
    this.checkMemberSelection(event);
  }

  public onMemberDeSelect(event: any) {
    this.eventForm.patchValue({
      member_id: null,
    });
  }

  public checkPaymentStateSelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedPaymentState = this.eventForm.value.payment_state;

    if (selectedPaymentState.length == 1) {
      this.eventForm.patchValue({
        payment_state: selectedPaymentState,
      });
    } else {
      this.eventForm.patchValue({
        payment_state: null,
      });
    }
  }


  public checkCategorySelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedCategory = this.eventForm.value.category_id;

    if (selectedCategory.length == 1) {
      this.eventForm.patchValue({
        category_id: selectedCategory,
      });
    } else {
      this.eventForm.patchValue({
        category_id: null,
      });
    }
  }

  public checkStatusSelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedStatus= this.eventForm.value.status_id;

    if (selectedStatus.length == 1) {
      this.eventForm.patchValue({
        status_id: selectedStatus,
      });
    } else {
      this.eventForm.patchValue({
        status_id: null,
      });
    }
  }

  public checkMemberSelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedMember= this.eventForm.value.member_id;

    if (selectedMember.length == 1) {
      this.eventForm.patchValue({
        member_id: selectedMember,
      });
    } else {
      this.eventForm.patchValue({
        member_id: null,
      });
    }
  }


  openModal() {
    const timer = setTimeout(() => {
      if (this.action == "view") {
        this.modalTitle = "Event details";
        this.modalReference = this.modalService.open(
          this.eventModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "addEvent") {
        this.modalTitle = "Add Event";
        this.modalReference = this.modalService.open(
          this.eventModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "updateEvent") {
        this.modalTitle = "Update Event details";
        this.populateEventForm();
        this.modalReference = this.modalService.open(
          this.eventModal,
          this.core.ngbModalOptions
        );
      } else if (this.action == "deleteEvent") {
        this.modalTitle = "Delete Event" + " | " + `${this.event.name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateEventForm();
        this.modalReference = this.modalService.open(
          this.eventModal,
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

  onSubmitEvent() {
    if (this.eventFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.eventForm.value;

      if (this.action == "addEvent") {
        this.addEvent(values);
      } else if (this.action == "updateEvent") {
        this.updateEvent(values);
      }
    }

    return false;
  }

  addEvent(values: any) {
    this.eventsService
      .addEvent(values)
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

  updateEvent(values: any) {
    let id = this.event.id;

    this.eventsService
      .updateEvent(values, id)
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

  deleteEvent() {
    this.loading = true;
    this.loadingData = true;
    let id = this.event.id;
    if (!this.core.isEmptyOrNull(id)) {
      this.eventsService
        .deleteEvent(id)
        .then((r) => {
          this.core.showSuccess("Success", "Deletion Successful...");
          this.loading = false;
          this.loadingData = false;
          this.resetEventForm();
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

  getEventName() {
    return this.event.payment_state;
  }

  populateEventForm() {
    let selectedPaymentState = this.paymentStates.filter((paymentState: { id: any }) => {
      return paymentState.id == this.event.payment_state;
    });

    let selectedCategory = this.categories.filter((category: { id: any }) => {
      return category.id == this.event.category_id;
    });

    let selectedStatus = this.statuses.filter((status: { id: any }) => {
      return status.id == this.event.status_id;
    });

    let selectedMember = this.members.filter((member: { id: any }) => {
      return member.id == this.event.member_id;
    });


    this.eventForm.patchValue({
      name: this.event.name,
      description: this.event.description,
      amount: this.event.amount,
      payment_state: selectedPaymentState,
      category_id: selectedCategory,
      deadline: this.event.deadline,
      handed_over_date: this.event.handed_over_date,
      handed_over_by: this.event.handed_over_by,
      collected_by: this.event.collected_by,
      comment: this.event.comment,
      status_id: selectedStatus,
      member_id: selectedMember,
     
    });
  }

  eventFormIsValid() {
    if (this.action == "addEvent" || this.action == "updateEvent") {
      return (
        this.eventForm.controls["name"].valid &&
        this.eventForm.controls["description"].valid &&
        this.eventForm.controls["amount"].valid &&
        this.eventForm.controls["payment_state"].valid &&
        this.eventForm.controls["category_id"].valid &&
        this.eventForm.controls["deadline"].valid &&
        this.eventForm.controls["status_id"].valid &&
        this.eventForm.controls["member_id"].valid
      );
    } else {
      return false;
    }
  }

  restoreEventForm() {
    this.populateEventForm();
  }

  resetEventForm() {
    this.eventForm?.reset();
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
    this.eventModalClosed.emit();
    if (this.action == "addEvent" || this.action == "updateEvent") {
      this.resetEventForm();
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
