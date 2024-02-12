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
export class BranchesService {

  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl()}` + 'branches';
    this.httpOptions = this.core.httpOptions;
  }


  getBranches(
  ): Promise<any> {
    let url = this.apiUrl;
    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  /** PUT: update a currenciess basic data  */
  addBranch(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.name)) {
      params.append("name", dataObject.name);
    }

    if (!this.core.isEmptyOrNull(dataObject.location)) {
      params.append("location", dataObject.location);
    }

    return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
  }




  getSingleBranch(id: any
  ): Promise<any> {
    let url = this.apiUrl + '/' + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  /** PUT: update a currenciess basic data  */
  updateBranch(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + '/' + id;

    let params = {};

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.name)) {
      params = dataObject;
    }

    if (!this.core.isEmptyOrNull(dataObject.location)) {
      params = dataObject;
    }

    return this.core.makeRemoteRequest(url, "put", params, null);
  }


  /** DELETE: delete a currencies  */
  deleteBranch(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + '/' + id;
    }

    return this.core.makeRemoteRequest(url, "delete", null, this.httpOptions);
  }

}
