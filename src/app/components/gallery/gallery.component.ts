import { Component, OnInit } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { NgxMasonryOptions } from "ngx-masonry";
import { Lightbox } from "ngx-lightbox";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.css"],
})
export class GalleryComponent implements OnInit {
  public title = "Gallery - Consulate General of Cameroon in Paris,France";
  public date = new Date();
  private _album = [];

  /**
   * Masonry Option
   */
  public myOptions: NgxMasonryOptions = {
    horizontalOrder: true,
  };

  /**
   * Portfolio Masonry Three Data
   */
  filterredImages;
  galleryFilter = "all";
  list = [
    {
      id: 1,
      image: "assets/images/work/1.jpg",
      title: "GROUP PICTURE, NEW CONSUL GENERAL",
      text: "Events",
      category: "events",
    },
    {
      id: 2,
      image: "assets/images/work/2.jpg",
      title: "MME CHANTAL BIYA REÇOIT UNE DÉLÉGATION",
      text: "News",
      category: "news",
    },
    {
      id: 3,
      image: "assets/images/work/3.jpg",
      title: "YAOUNDÉ ET MALABO SE CONCERTENT",
      text: "Diplomacy",
      category: "diplomacy",
    },
    {
      id: 4,
      image: "assets/images/work/4.jpg",
      title:
        "BUREAU CHARGÉ DE L'ACCOMPAGNEMENT DE LA DIASPORA CAMEROUNAISE DE FRANCE",
      text: "News",
      category: "news",
    },
    {
      id: 5,
      image: "assets/images/work/5.jpg",
      title: "JOHN BILLY EKO, NOUVEAU CONSUL GÉNÉRAL A PARIS",
      text: "Events",
      category: "events",
    },
    {
      id: 6,
      image: "assets/images/work/6.jpg",
      title: "L'AMBASSADEUR D'ESPAGNE EN FIN DE SEJOUR",
      text: "Diplomacy",
      category: "diplomacy",
    },
    {
      id: 7,
      image: "assets/images/work/7.jpg",
      title: "NOUVEAU CONSUL GÉNÉRAL A PARIS,SERRAGE DE MAINS",
      text: "Events",
      category: "events",
    },
    {
      id: 8,
      image: "assets/images/work/8.jpg",
      title:
        "LE TCHAD REMERCIE LE CAMEROUN POUR SON SOUTIEN AU DIALOGUE NATIONAL",
      text: "Diplomacy",
      category: "diplomacy",
    },
  ];

  constructor(
    private _lightbox: Lightbox,
    private metaTagService: Meta,
    private titleService: Title
  ) {
    //this.list.forEach((element, i) => {
    for (var i = 1; i <= this.list.length; i++) {
      const src = "../../../assets/images/work/" + i + ".jpg";
      const caption =
        "" +
        i +
        " " +
        (this.list[i - 1]?.title ? this.list[i - 1]?.title : " ");
      const thumb = "../../../assets/images/work/" + i + "-thumb.jpg";
      const item = {
        src: src,
        caption: caption,
        thumb: thumb,
      };
      this._album.push(item);
    }
  }

  ngOnInit(): void {
    this.setupMeta();
    this.filterredImages = this.list;
  }

  setupMeta() {
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      {
        name: "description",
        content: "Gallery of the Consulate General of Cameroon in Paris,France",
      },
      {
        name: "keywords",
        content:
          "gallery of the  Consulate General of Cameroon in Paris,France, consulate general gallery",
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

  activeCategory(category) {
    this.galleryFilter = category;
    if (this.galleryFilter === "all") {
      this.filterredImages = this.list;
    } else {
      this.filterredImages = this.list.filter(
        (x) => x.category === this.galleryFilter
      );
    }
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._album, index - 1);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
}
