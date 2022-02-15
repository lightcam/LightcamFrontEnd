import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CsvParserService} from '../csv-parser.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {
  public resources: any;
  public referenceId;
  private csvParser: CsvParserService;
  public searchBarContent: string;

  constructor(
    public platform: Platform,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.referenceId = route.snapshot.paramMap.get('id');
    if (this.referenceId === null){
      this.referenceId = [];
    }else{
      this.referenceId = this.referenceId.replace('resource-', '');
      if (this.referenceId.indexOf(',') > -1){
        this.referenceId = this.referenceId.split(',');
      }else{
        this.referenceId = [this.referenceId];
      }
    }
  }

  ngOnInit() {
    this.csvParser = new CsvParserService(this.http, 'resources', this.setResources.bind(this));
  }
  private setResources(argues: any){
    this.resources = argues;
    for (const resource of this.resources){
      resource.display = true;
    }

    // Smooth scroll to the reference (if not null)
    setTimeout(() => {

      if (this.referenceId[0] !== null){
        const tmpId = 'resource-' + this.referenceId[0];
        document.getElementById(tmpId).scrollIntoView({behavior: 'smooth', block: 'center'});
      }}, 200);
  }

  // Filter content that match a specific pattern
  filterOnSearch(){
    const pattern = this.searchBarContent.toLowerCase();
    for (const resource of this.resources){
      if (
        (resource.words[0].title !== undefined &&
          resource.words[0].description.toLowerCase().search(pattern) >= 0 ) ||
          pattern === ''
      ){
        resource.display = true;
      }else{
        resource.display = false;
      }
    }
  }

}
