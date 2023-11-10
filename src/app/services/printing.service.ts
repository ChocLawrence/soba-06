import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PrintingService {
  constructor() {}

  print(printableArea) {
    let timer = setTimeout(() => {
      const printContents = printableArea.nativeElement.innerHTML;
      const popupWin = window.open(
        "",
        "_blank",
        "width=1000,height=1000,location=no,left=200px"
      );
      popupWin.document.open();
      popupWin.document.write(
        '\
          <html> \
              <head> \
                  <title></title> \
                  <link rel="stylesheet" type="text/css" href="../../assets/css/print.css" media="print" /> \
              </head> \
              <body> \
                  <div>'
      );
      popupWin.document.write(printContents);
      popupWin.document.write(
        "\
                  </div> \
              </body> \
          </html>"
      );
      popupWin.document.close();

      popupWin.addEventListener("load", () => {
        popupWin.focus();
        popupWin.print();
        popupWin.close();
      });
      clearTimeout(timer);
    }, 10);
  }
}
