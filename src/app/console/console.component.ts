import { Component, OnInit } from '@angular/core';
import { CoreService } from "../core/core.service";
// Service
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  public collapedSideBar: any;
  /**
   * nav light class add
   */
  navClass = 'nav-light';

  constructor(public core: CoreService) {}

  ngOnInit() {
    this.collapedSideBar = null;
  }

  receiveCollapsed($event:any) {
      this.collapedSideBar = $event;
  }


}
