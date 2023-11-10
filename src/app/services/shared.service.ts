import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private unreadNotificationCount: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public unreadNotificationCount$: Observable<any[]> = this.unreadNotificationCount.asObservable();


  constructor() { }


  updateUnreadNotificationCount(updatedCount: any) {
    this.unreadNotificationCount.next(updatedCount);
  }
  
}
