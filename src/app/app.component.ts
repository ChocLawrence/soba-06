import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CoreService } from "./core/core.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "SOBA-06";

  constructor(public _core: CoreService, private router: Router) {
    /**
     * Unicons icon refreshed on route change.
     */
    if (this._core.checkIfOnline()) {
      this.router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          window["Unicons"]["refresh"]();
        }
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    }
  }
}
