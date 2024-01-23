import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public apiUrl() {

    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "https://cgapi.foodstability.com/api/";
    } else if (url.includes("cameroon-consulat.org")) {
      returnUrl = "https://cgapi.foodstability.com/api/";
    } else {
      returnUrl = "https://cgapi.foodstability.com/api/";
    }

    return returnUrl;
  }

  public apiStorageUrl() {
    
    let url = location.href;
    let returnUrl = "";

    if (url.includes("localhost")) {
      returnUrl = "https://cgapi.foodstability.com/storage/";
    } else if (url.includes("cameroon-consulat.org")) {
      returnUrl = "https://cgapi.foodstability.com/storage/";
    } else {
      returnUrl = "https://cgapi.foodstability.com/storage/";
    }
    
    return returnUrl;
  }

  constructor() { }
}
