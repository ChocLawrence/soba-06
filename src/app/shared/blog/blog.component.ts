import { Component, OnInit, Input } from "@angular/core";
import { CoreService } from "../../core/core.service";
import { UrlsService } from "../../core/urls.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.css"],
})
export class BlogComponent implements OnInit {
  @Input()
  posts: Array<{
    image: string;
    images: string;
    title: string;
    subtitle: string;
    description: string;
    category_id: string;
    pdf: string;
    tag: string;
    slug: string;
    date: string;
  }> = [];

  constructor(public _core: CoreService, public _urls: UrlsService) {}

  ngOnInit(): void {}
}
