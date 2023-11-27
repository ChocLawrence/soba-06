import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { CoreService } from "../../core/core.service";
import { Router, NavigationEnd } from "@angular/router";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Title, Meta } from "@angular/platform-browser";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loading = false;
  public destination: any;
  public state = "pending";
  loginForm: FormGroup;

  public title = "Login | SOBA-06 Class";
  public date = new Date();

  constructor(
    public core: CoreService,
    public router: Router,
    private fb: FormBuilder,
    private metaTagService: Meta,
    private titleService: Title,
    private authenticationService: AuthenticationService
  ) {
    this.setupMeta();
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
    });
  }

  setupMeta() {
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      {
        name: "description",
        content:
          "Login to the SOBA-06 Class, Cameroon",
      },
      {
        name: "keywords",
        content:
          "Login to SOBA-06 Class,consulate general of cameroon in france,cameroon france consulate",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Lawrence Elango" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      },
      { name: "date", content: this.date.toString(), scheme: "YYYY-MM-DD" },
      { charset: "UTF-8" },
    ]);
  }


  ngOnInit(): void {
    this.checkState();
  }

  checkState(){
    if(this.core.isLoggedIn()){
      this.core.redirectToHome();
    }else{
      this.state = "login";
    }
  }

  onSubmitLogin() {
    if (this.loginFormIsValid()) {
      this.loading = true;
      let values = this.loginForm.value;
      values.username = values.username.trim();

      this.authenticationService
        .login(values)
        .then((r) => {
          this.core.encryptToLocalStorage(
            "currentUser",
            JSON.stringify(r.data)
          );
          this.core.encryptToLocalStorage(
            "menu",
            JSON.stringify(r.data.user.role_id)
          );
          let menu = this.core.decryptFromLocalStorage("menu");

          if (menu == "2") {
            this.destination = "/console";
          }

          if (!this.core.isEmptyOrNull(this.destination)) {
            this.redirectToDashboard(this.destination);
            this.core.showSuccess("Success", "Login Successful...");
          } else {
            this.core.showError("Oops", "Refresh page and try again..");
          }

          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.core.handleError(e);
        });
    }

    return false;
  }

  loginFormIsValid() {
    return (
      this.loginForm.controls["username"].valid &&
      this.loginForm.controls["password"].valid
    );
  }

  redirectToDashboard(destination: string) {
    let timer = setTimeout(() => {
      window.location.href = destination;
      clearTimeout(timer);
    }, 2000);
  }
}
