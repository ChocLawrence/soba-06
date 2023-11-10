import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, NavigationEnd } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() footerVariant: string;
  @Input() hideFooter: boolean;

  //Get Year
  year = new Date().getFullYear();

  public loading = false;
  public destination = "";
  subscriberForm: FormGroup;

  constructor(public core: CoreService,
    public router: Router) {
  }

  ngOnInit(): void {
  }

}

