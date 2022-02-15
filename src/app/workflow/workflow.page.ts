import { Component, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';
import {CsvParserService} from '../csv-parser.service';
import {SvgParserService} from '../svg-parser.service';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.page.html',
  styleUrls: ['./workflow.page.scss'],
})
export class WorkflowPage implements OnInit {

  public csvParser; // Instance of CsvParserService
  public workflowSvg; // Svg model of the workflow
  constructor(
    public platform: Platform,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.csvParser = new SvgParserService(this.http, this.emptyCallback.bind(this));
  }
  emptyCallback(txt: string){
    this.workflowSvg = this.sanitizer.bypassSecurityTrustHtml(txt);
    // this.workflowSvg = this.sanitizer.bypassSecurityTrustUrl(this.workflowSvg);
  }

}
