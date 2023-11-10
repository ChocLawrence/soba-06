import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { CategoriesService } from '../../services/categories.service';
import { ContributionsService } from '../../services/contributions.service';
import { BranchesService } from '../../services/branches.service';
import { EventsService } from '../../services/events.service';
import { MembersService } from '../../services/members.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  public animationType = 'wanderingCubes';
  public loadingData = false;
  public categoriesCount: any[] = [];
  public branchesCount: any[] = [];
  public membersCount: any[] = [];
  public contributionsCount: any[] = [];
  public eventsCount: any[] = [];
  public contributions: any[] = [];
  public projects: any[] = [];
  public pageSize = 10;
  public defaultDataObject = {pageSize:this.pageSize};

  public defaultStartDate = "";
  public defaultEndDate = "";
  public defaultStatus = "all";
  public stdate: any = { year: 0, month: 0, day: 0 };
  public endate: any = { year: 0, month: 0, day: 0 };
  public thisYears = new Date().getFullYear();
  public thisMonth = new Date().getMonth() + 1;
  public thisDay = new Date().getDate();
  public minDate = { year: 1930, month: 1, day: 1 };
  public maxDate = {
    year: this.thisYears,
    month: this.thisMonth,
    day: this.thisDay,
  };
   
  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private membersService: MembersService,
    private branchesService: BranchesService,
    private eventsService: EventsService,
    private contributionsService: ContributionsService,
    private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getContributions(this.defaultDataObject);
    this.getBranches();
    this.getEvents();
    this.getMembers();
    this.setDates();
  }

  setDates(){
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;
  }


  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then(categories => {
        this.categoriesCount = categories.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getBranches() {
    this.loadingData = true;

    this.branchesService
      .getBranches()
      .then(branches => {
        this.branchesCount = branches.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getEvents() {
    this.loadingData = true;

    this.eventsService
      .getEvents(this.defaultDataObject)
      .then(events => {
        this.eventsCount = events.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getMembers() {
    this.loadingData = true;

    this.membersService
      .getMembers(this.defaultDataObject)
      .then(members => {
        this.membersCount = members.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getContributions(dataObject:any) {
    this.loadingData = true;
    
    let data = {
      start: this.defaultStartDate,
      end: this.defaultEndDate,
    }

    this.contributionsService
      .getContributions(dataObject)
      .then(contributions => {
        if (contributions.data.data) {
          this.contributionsCount = contributions.data.total;
          this.contributions = this._core.normalizeKeys(contributions.data.data);
        }else{
          this.contributionsCount = contributions.data.length;
          this.contributions = this._core.normalizeKeys(contributions.data);
        }
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


}
