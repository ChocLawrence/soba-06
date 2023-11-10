import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from "@angular/router";
import { Title, Meta } from '@angular/platform-browser';
import { CoreService } from '../../core/core.service';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  

  public title = "Contact Us - Consulate General of Cameroon in Paris,France";
  public date = new Date();
  public loading = false;
  public destination: any;
  contactForm: FormGroup;

  constructor(private modalService: NgbModal,
    public core: CoreService,
    public router: Router,
    private metaTagService: Meta,
      private titleService: Title) { 
    }

  ngOnInit(): void {
  this.setupMeta();
  }

  setupMeta() {
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      {
        name: "description",
        content:
          "Contact the SOBA 06 Class",
      },
      {
        name: "keywords",
        content:
          "Contact the SOBA-06 Class",
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

  mapView(content) {
    this.modalService.open(content, { windowClass: 'dark-modal', size: 'lg', centered: true })
  }
}
