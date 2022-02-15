import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    public platform: Platform,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  navigateToAbout() {

    this.router.navigate(['about']);
  }
}
