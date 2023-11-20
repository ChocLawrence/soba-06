import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { CoreService } from '../../core/core.service';
import { EventsService } from '../../services/events.service';
import { CategoriesService } from '../../services/categories.service';
import { StatusesService } from '../../services/statuses.service';
import { PaymentStatesService } from '../../services/payment-states.service';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.css'],
})

/**
 * Event Component
 */
export class ContributionsComponent implements OnInit {
  /**
   * Nav Light Class Add
   */
  navClass = 'nav-light';

  public loadingData = false;
  public deadlineState = null;
  public events: any[] = [];
  public members: any[] = [];
  public paymentStates: any[] = [];
  public categories: any[] = [];
  public statuses: any[] = [];
  public ongoingStatus:any;
  public limit = 10;
  public eventsCount = 0;
  public animationType = 'wanderingCubes';
  public theEvent: any;
  public origin = 'Events';
  public eventModalAction = '';
  public deadline:any;
  public pageSize = 10;
  public defaultDataObject = {pageSize:this.pageSize}

  constructor(
    private modalService: NgbModal,
    public _core: CoreService,
    private statusesService: StatusesService,
    private categoriesService: CategoriesService,
    private paymentStatesService: PaymentStatesService,
    private membersService: MembersService,
    private eventsService: EventsService
  ) {}

  /**
   * Review Testimonial Data
   */
  reviewData = [
    {
      profile: 'assets/images/client/01.jpg',
      name: 'Thomas Israel ',
      designation: 'C.E.O',
      message: `" It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. The most well-known dummy text is the 'Lorem Ipsum', which is said to have originated in the 16th century. "`,
    },
    {
      profile: 'assets/images/client/02.jpg',
      name: 'Carl Oliver',
      designation: 'P.A',
      message: `" The advantage of its Latin origin and the relative meaninglessness
      of Lorum Ipsum is that the text does not attract attention to itself or distract the viewer's attention
      from the layout. "`,
    },
    {
      profile: 'assets/images/client/03.jpg',
      name: 'Barbara McIntosh',
      designation: 'M.D',
      message: `" There is now an abundance of readable dummy texts. These are
      usually used when a text is required purely to fill a space. These alternatives to the classic Lorem
      Ipsum texts are often amusing and tell short, funny or nonsensical stories. "`,
    },
    {
      profile: 'assets/images/client/04.jpg',
      name: 'Christa Smith',
      designation: 'Manager',
      message: `" According to most sources, Lorum Ipsum can be traced back to a text
      composed by Cicero in 45 BC. Allegedly, a Latin scholar established the origin of the text by compiling
      all the instances of the unusual word 'consectetur' he could find "`,
    },
    {
      profile: 'assets/images/client/05.jpg',
      name: 'Dean Tolle',
      designation: 'Developer',
      message: `" It seems that only fragments of the original text remain in the
      Lorem Ipsum texts used today. The most well-known dummy text is the 'Lorem Ipsum', which is said to have
      originated in the 16th century. "`,
    },
    {
      profile: 'assets/images/client/06.jpg',
      name: 'Jill Webb',
      designation: 'Designer',
      message: `" It seems that only fragments of the original text remain in the
      Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added
      or deleted at various positions within the text. "`,
    },
  ];

  /**
   * Blog Data
   */
  blogData = [
    {
      image: 'assets/images/event/b01.jpg',
      title: 'Design your apps in your own way',
      like: '33',
      message: '08',
      name: 'Calvin Carlo',
      date: '13th August, 2019',
    },
    {
      image: 'assets/images/event/b02.jpg',
      title: 'How apps is changing the IT world',
      like: '33',
      message: '08',
      name: 'Calvin Carlo',
      date: '13th August, 2019',
    },
    {
      image: 'assets/images/event/b03.jpg',
      title: 'Smartest Applications for Business',
      like: '33',
      message: '08',
      name: 'Calvin Carlo',
      date: '13th August, 2019',
    },
  ];

  private _diff: number | undefined;
  _days: number | undefined;
  _hours: number | undefined;
  _minutes: number | undefined;
  _seconds: number | undefined;
  private _trialEndsAt: any;

  ngOnInit(): void {
    this.getStatuses();
    this.getPaymentStates();
    this.getCategories();
    this.getMembers();
  }

  setTimeline() {
    this._trialEndsAt = this.deadline;
    //Day Counter
    interval(1000)
      .pipe(
        map((x) => {
          this._diff =
            Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
        })
      )
      .subscribe((x) => {
        this._days = this.getDays(this._diff);
        this._hours = this.getHours(this._diff);
        this._minutes = this.getMinutes(this._diff);
        this._seconds = this.getSeconds(this._diff);
      });
  }

  getPaymentStates() {
    this.loadingData = true;

    this.paymentStatesService
      .getPaymentStates()
      .then((states) => {
        this.paymentStates = states.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getStatuses() {
    this.loadingData = true;

    this.statusesService
      .getStatuses()
      .then((statuses) => {
        this.statuses = statuses.data;
        let ongoingStatus = this.getStatus("ongoing");
        this.ongoingStatus = ongoingStatus;
        this.getEvents();
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then((categories) => {
        this.categories = categories.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getEvents() {
    this.loadingData = true;

    let dataObject = {
      soba_status_id : this.ongoingStatus
    };

    this.eventsService
      .getEvents(dataObject)
      .then((events) => {
        this.eventsCount = events.data.length;
        this.events = this._core.normalizeKeys(events.data);
        this.deadline = this.events[0].deadline;
        var todayDate = new Date().toISOString().slice(0, 10);
        if(this.deadline <  todayDate){
          this.deadlineState = "Deadline has passed";
        }
        this.setTimeline();
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getMembers() {
    this.loadingData = true;

    this.membersService
      .getMembers(this.defaultDataObject)
      .then((members) => {
        this.members = members.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getCategoryName(value: string) {
    let category = this.categories.filter((item) => {
      return item.id == value;
    });
    return category[0]?.name;
  }

  getStatusName(value: string) {
    if(this.statuses){
      let status = this.statuses.filter((item) => {
        return item.id == value;
      });
      return status[0]?.name;
    }
  }

  getStatus(value: string) {
      let status = this.statuses.filter((item) => {
        return item.slug == value;
      });
      return status;
  }

  getMemberName(value: string) {
    let member = this.members.filter((item) => {
      return item.id == value;
    });
    return member[0]?.full_name;
  }

  getPaymentStateName(value: string) {
    let paymentState = this.paymentStates.filter((item) => {
      return item.id == value;
    });
    return paymentState[0].name;
  }

  /**
   * Open modal for show the video
   * @param content content of modal
   */
  openWindowCustomClass(content) {
    this.modalService.open(content, {
      windowClass: 'dark-modal',
      size: 'lg',
      centered: true,
    });
  }

  /***
   * Get day
   */
  getDays(t: any) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  /***
   * Get Hours
   */
  getHours(t: any) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  /***
   * Get Minutes
   */
  getMinutes(t: any) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  /***
   * Get Secounds
   */
  getSeconds(t: any) {
    return Math.floor((t / 1000) % 60);
  }
}
