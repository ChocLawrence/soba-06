import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { UrlsService } from "../core/urls.service";
import { CoreService } from "../core/core.service";
import { CustomHttpParamEncoder } from "../core/custom-http-param-encoder";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded",
  }),
};



@Injectable({
  providedIn: 'root'
})
export class MembersService {

  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl()}` + 's_members';
    this.httpOptions = this.core.httpOptions;
  }


  getMembers(dataObject: any): Promise<any> {
    let url = this.apiUrl + '?';

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      url += `&soba_status_id=${encodeURIComponent(dataObject.soba_status_id[0].id)}`;
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_member_id)) {
      url += `&soba_member_id=${encodeURIComponent(dataObject.soba_member_id[0].id)}`;
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
  addMember(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.full_name)) {
      params.append("full_name", dataObject.full_name);
    }

    if (!this.core.isEmptyOrNull(dataObject.dob)) {
      params.append("dob", dataObject.dob);
    }

    if (!this.core.isEmptyOrNull(dataObject.file)) {
      params.append("image", dataObject.file);
    }

    if (!this.core.isEmptyOrNull(dataObject.address)) {
      params.append("address", dataObject.address);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.phone)) {
      params.append("phone", dataObject.phone);
    }

    if (!this.core.isEmptyOrNull(dataObject.bio)) {
      params.append("bio", dataObject.bio);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      params.append("soba_status_id", dataObject.soba_status_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_branch_id)) {
      params.append("soba_branch_id", dataObject.soba_branch_id[0].id);
    }


    return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
  }




  getSingleMember(id: any
  ): Promise<any> {
    let url = this.apiUrl + '/' + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }



  /** PUT: update a currenciess basic data  */
  updateMember(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + '/' + id;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.full_name)) {
      params.append("full_name", dataObject.full_name);
    }

    if (!this.core.isEmptyOrNull(dataObject.dob)) {
      params.append("dob", dataObject.dob);
    }

    if (!this.core.isEmptyOrNull(dataObject.file)) {
      params.append("image", dataObject.file);
    }

    if (!this.core.isEmptyOrNull(dataObject.address)) {
      params.append("address", dataObject.address);
    }

    if (!this.core.isEmptyOrNull(dataObject.email)) {
      params.append("email", dataObject.email);
    }

    if (!this.core.isEmptyOrNull(dataObject.phone)) {
      params.append("phone", dataObject.phone);
    }

    if (!this.core.isEmptyOrNull(dataObject.bio)) {
      params.append("bio", dataObject.bio);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_status_id)) {
      params.append("soba_status_id", dataObject.soba_status_id[0].id);
    }

    if (!this.core.isEmptyOrNull(dataObject.soba_branch_id)) {
      params.append("soba_branch_id", dataObject.soba_branch_id[0].id);
    }


    return this.core.makeRemoteRequest(url, "post", params, null);
  }


  /** DELETE: delete a currencies  */
  deleteMember(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + '/' + id;
    }

    return this.core.makeRemoteRequest(url, "delete", null, this.httpOptions);
  }

}
