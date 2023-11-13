import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public apiUrl() {

    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "http://urchin-app-mnvhl.ondigitalocean.app/api/";
    } else if (url.includes("cameroon-consulat.org")) {
      returnUrl = "https://api.cameroon-consulat.org/api/";
    } else {
      returnUrl = "https://urchin-app-mnvhl.ondigitalocean.app/api/";
    }

    return returnUrl;
  }

  public apiStorageUrl() {
    
    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "http://urchin-app-mnvhl.ondigitalocean.app/storage/";
    } else if (url.includes("cameroon-consulat.org")) {
      returnUrl = "https://api.cameroon-consulat.org/storage/";
    } else {
      returnUrl = "https://urchin-app-mnvhl.ondigitalocean.app/storage/";
    }
    
    return returnUrl;
  }

  constructor() { }
}
