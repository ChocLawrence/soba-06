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
export class EligibilityService {

  public apiUrl: string;
  public httpOptions;

  constructor(
    private http: HttpClient,
    private urlService: UrlsService,
    public core: CoreService
  ) {

    this.apiUrl = `${this.urlService.apiUrl()}` + 'eligibility';
    this.httpOptions = this.core.httpOptions;
  }


  getEligibility(
  ): Promise<any> {
    let url = this.apiUrl;
    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }


  /** PUT: update a currenciess basic data  */
  addEligibility(dataObject: any): Promise<any> {
    let url = this.apiUrl;

    let params = new FormData();

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.percentage)) {
      params.append("percentage", dataObject.percentage);
    }

    return this.core.makeRemoteRequest(url, "post", params, this.httpOptions);
  }




  getSingleEligibility(id: any
  ): Promise<any> {
    let url = this.apiUrl + '/' + id;

    return this.core.makeRemoteRequest(url, "get", null, httpOptions);
  }



  /** PUT: update a currenciess basic data  */
  updateEligibility(dataObject: any, id: any): Promise<any> {
    let url = this.apiUrl + '/' + id;

    let params = {};

    // These parameters are always passed
    if (!this.core.isEmptyOrNull(dataObject.percentage)) {
      params= dataObject;
    }

    return this.core.makeRemoteRequest(url, "put", params, null);
  }


  /** DELETE: delete a currencies  */
  deleteEligibility(id: any): Promise<any> {
    let url = '';

    // let params = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    if (!this.core.isEmptyOrNull(id)) {
      url = this.apiUrl + '/' + id;
    }

    return this.core.makeRemoteRequest(url, "delete", null, this.httpOptions);
  }

}
