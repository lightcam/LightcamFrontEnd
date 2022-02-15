import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-common-ground',
  templateUrl: './common-ground.page.html',
  styleUrls: ['./common-ground.page.scss'],
})
export class CommonGroundPage implements OnInit {

  constructor(public platform: Platform,) { }

  ngOnInit() {
  }

}
