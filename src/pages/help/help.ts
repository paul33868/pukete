import { Component } from '@angular/core';
import { Nav } from "ionic-angular";
import { IndexPage } from "../index/index";

@Component({
  selector: 'help-page',
  templateUrl: 'help.html'
})
export class HelpPage {
  constructor(private nav: Nav) { }
  skip() {
    this.nav.setRoot(IndexPage);
  }
}
