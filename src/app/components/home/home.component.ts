import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { OwlOptions } from "ngx-owl-carousel-o";
import { Router } from "@angular/router";
import { CoreService } from "../../core/core.service";
import { CategoriesService } from "../../services/categories.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Title, Meta } from "@angular/platform-browser";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = "-";

  parse(value: string): NgbDateStruct {
    let result: any = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: any = null;
    if (date) {
      result =
        date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
    }
    return result;
  }
}

@Component({
  selector: "app-index-construction",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})

/***
 * Home Component
 */
export class HomeComponent implements OnInit {
  /***
   * Nav bg light class add
   */
  navClass = 'nav-light';

  constructor(
    private metaTagService: Meta,
    private titleService: Title
    ) {}

  /***
   * Current date Get
   */
  checkin = new Date();
  checkout = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  /***
   * Destination Slider
   */
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    navSpeed: 700,
    dots: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 5
      },
      900: {
        items: 8
      }
    },
    nav: false
  };

  public title =
  "SOBA 06 - The Pace Setters.";
  public date = new Date();

  ngOnInit(): void {
    this.setupMeta();
  }

  setupMeta() {
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      {
        name: "description",
        content: "SOBA 06, The Pace setters. Saint Joseph's College Sasse Class of 2006",
      },
      {
        name: "keywords",
        content:
          "soba 06s,SJC Sasse, sasse college, saint joseph's college Sasse",
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
}
