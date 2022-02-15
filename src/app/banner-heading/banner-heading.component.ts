import { Component, OnInit } from '@angular/core';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-banner-heading',
  templateUrl: './banner-heading.component.html',
  styleUrls: ['./banner-heading.component.scss']
})
export class BannerHeadingComponent implements OnInit {

  constructor(public platform: Platform) { }

  ngOnInit() {}

}
