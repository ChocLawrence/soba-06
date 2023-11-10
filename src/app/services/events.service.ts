import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { UrlsService } from '../core/urls.service';
import { CoreService } from '../core/core.service';
import { CustomHttpParamEncoder } from '../core/custom-http-param-encoder';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {
    this.apiUrl = `${this.urlService.apiUrl()}` + 's_events';
    this.httpOptions = this.core.httpOptions;
  }

  getEvents(dataObject: any): Promise<any> {
    let url = this.apiUrl + '?';

    if (!this.core.isEmptyOrNull(dataObject.amount)) {
      url += `amount=${encodeURIComponent(dataObject.amount)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_event_id)) {
      url += `&soba_event_id=${encodeURIComponent(
        dataObject.soba_event_id[0].id
      )}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_category_id)) {
      url += `&soba_category_id=${encodeURIComponent(
        dataObject.soba_category_id[0].id
      )}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      url += `&soba_status_id=${encodeURIComponent(
        dataObject.soba_status_id[0].id
      )}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_member_id)) {
      url += `&soba_member_id=${encodeURIComponent(
        dataObject.soba_member_id[0].id
      )}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.keyword)) {
      url += `&keyword=${encodeURIComponent(dataObject.keyword)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.sortBy)) {
      url += `&sortBy=${encodeURIComponent(dataObject.sortBy)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.sortOrder)) {
      url += `&sortOrder=${encodeURIComponent(dataObject.sortOrder)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.page_size)) {
      url += `&page_size=${encodeURIComponent(dataObject.page_size)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.page)) {
      url += `&page=${encodeURIComponent(dataObject.page)}`;
    } else {
      url += `&page=1`;
    }

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  /** PUT: update a currenciess basic data  */
  addEvent(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.name)) {
      params.append('name', dataObject.name);
    }

    if (!this.core.isEmptyOrNull(dataObject.description)) {
      params.append('description', dataObject.description);
    }

    if (!this.core.isEmptyOrNull(dataObject.amount)) {
      params.append('amount', dataObject.amount);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_payment_state)) {
      params.append('soba_payment_state', dataObject.soba_payment_state[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_category_id)) {
      params.append('soba_category_id', dataObject.soba_category_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.deadline)) {
      params.append('deadline', dataObject.deadline);
    }

    if (!this.core.isEmptyOrNull(dataObject.handed_over_date)) {
      params.append('handed_over_date', dataObject.handed_over_date);
    }

    if (!this.core.isEmptyOrNull(dataObject.handed_over_by)) {
      params.append('handed_over_by', dataObject.handed_over_by);
    }

    if (!this.core.isEmptyOrNull(dataObject.collected_by)) {
      params.append('collected_by', dataObject.collected_by);
    }

    if (!this.core.isEmptyOrNull(dataObject.comment)) {
      params.append('comment', dataObject.comment);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      params.append('soba_status_id', dataObject.soba_status_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_member_id)) {
      params.append('soba_member_id', dataObject.soba_member_id[0].id);
    }

    return this.core.makeRemoteRequest(url, 'post', params, this.httpOptions);
  }

  getSingleEvent(id: any): Promise<any> {
    let url = this.apiUrl + '/' + id;

    return this.core.makeRemoteRequest(url, 'get', null, httpOptions);
  }

  /** PUT: update a currenciess basic data  */
  updateEvent(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + '/' + id;

    let params = {};

    // These parameters are always passed

    if (!this.core.isEmptyOrNull(dataObject.name)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.description)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.amount)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_payment_state)) {
      dataObject.soba_payment_state = dataObject.soba_payment_state[0].id;
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_category_id)) {
      dataObject.soba_category_id = dataObject.soba_category_id[0].id;
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.deadline)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.handed_over_date)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.handed_over_by)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.collected_by)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.comment)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      dataObject.soba_status_id = dataObject.soba_status_id[0].id;
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_member_id)) {
      dataObject.soba_member_id = dataObject.soba_member_id[0].id;
      params = dataObject;
    }

    return this.core.makeRemoteRequest(url, 'put', params, null);
  }

  /** DELETE: delete a currencies  */
  deleteEvent(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + '/' + id;
    }

    return this.core.makeRemoteRequest(url, 'delete', null, this.httpOptions);
  }
}
