import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  public apiUrl() {

    let url = location.href;
    let returnUrl = "";

    //returnUrl = "http://localhost:8000/api/";
    //returnUrl = "https://s06api.foodstability.com/api/";
    if (url.includes("localhost")) {
      returnUrl = "https://s06api.foodstability.com/api/";
    } else if (url.includes("soba06.com")) {
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
      returnUrl = "http://localhost:8000/storage/";
    } else if (url.includes("soba06.com")) {
      returnUrl = "https://cgapi.foodstability.com/storage/";
    } else {
      returnUrl = "https://cgapi.foodstability.com/storage/";
    }
    
    return returnUrl;
  }

  constructor() { }
}
