import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js';

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { CsvParserService} from '../csv-parser.service';

import { Topics } from './selection-buttons/selection-buttons.component';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})

@Injectable()
export class TimelinePage implements OnInit {
  private static values = new Map([
    ['I', 1],
    ['V', 5],
    ['X', 10],
    ['L', 50],
    ['C', 100],
    ['CD', 400],
    ['D', 500],
    ['CM', 900],
    ['M', 1000]
    /*....*/
  ]);

  constructor(
    public platform: Platform,
    private http: HttpClient,
  ) { }
  Math = Math;

  public primaryXmlEvents: any;
  public secondaryXmlEvents: any;
  public xmlEvents: any;
  public csvEvents: any;
  public cardButtons: Topics[][] = [];
  public cardButtonsBackground: string[] = [];
  //public selectedTopic: string[] = [];
  public cardsHeight: number[];
  public cardsPosition: number[];
  public secondRowCounter: number;      // Same as $counter in old SCSS file
  public containerHeight: number;       // Same as $container-height in SCSS file ()
  public selectedLanguage: string;
  public mainTopic: string;
  public avatar;
  private csvParser: CsvParserService;

  // Topics selection functionality
  public xmlEventsFiltered: any;
  public selectedTopics = [ true, true, true ];

  ngOnInit() {
    this.selectedLanguage = 'EN';
    // this.getXmlContent(true);

    this.csvParser = new CsvParserService(this.http, 'timeline', this.setCsvEvents.bind(this));
    // this.getCsvContent();
    this.mainTopic = 'photogrammetry';

  }

  public setCsvEvents(value){ // Set CsvEvents to the given value
    this.csvEvents = value;
    this.xmlEvents = this.csvEvents; // TODO convertXmlEvents to CsvEvents
    this.xmlEventsFiltered = this.xmlEvents;
    this.cardsHeight = Array(this.xmlEvents.length);
    this.cardsPosition = Array(this.xmlEvents.length);
    this.cardsPosition[0] = 0;
    this.sortByDate();

    // The following calculations comes from the old SCSS file, $item = $counter - $rows + 2
    // $rows = ceil($items/2);
    this.secondRowCounter = this.xmlEvents.length - Math.ceil(this.xmlEvents.length / 2) + 2;

    // Container height for timeline (only for 2 columns visualization?)
    // Same calculation used in SCSS file
    this.containerHeight = Math.ceil(this.xmlEvents.length / 2) * (400 + 90) + 180;
    // console.log(this.xmlEvents);
  }

  sortByDate(){ // Sort xml events
    // console.dir(this.primaryXmlEvents);
    this.xmlEvents.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });
  }

  setCardHeight(i: number, height: number) {

    this.cardsHeight[i] = height;
    console.log(i);
    //console.log(this.cardsHeight[i]);

    if (i > 0) {

      this.cardsPosition[i] = this.cardsPosition[i-1] + this.cardsHeight[i-1] + 32;
      console.log(this.cardsPosition);
    }
  }

  filterBySelectedTopics() {

    // If all topics selected, no need to filter
    if (this.selectedTopics.every(v => v === true)) {
      return this.xmlEvents;
    }

    let filteredTopics = [];

    for(let el of this.xmlEvents) {

      if (
        this.selectedTopics[0] && el.language[0].photogrammetry[0].hasOwnProperty('paragraph') ||
        this.selectedTopics[1] && el.language[0].computer_vision[0].hasOwnProperty('paragraph') ||
        this.selectedTopics[2] && el.language[0].robotics[0].hasOwnProperty('paragraph')
        ) {
        filteredTopics.push(el);
      }
    }

    return filteredTopics;
  }

  changeTopicsEvent(event, topic) {

    this.selectedTopics[topic] = event.detail.checked;

    this.xmlEventsFiltered = this.filterBySelectedTopics();
  }

  counter(i: number) {
    return new Array(i);
  }
}
