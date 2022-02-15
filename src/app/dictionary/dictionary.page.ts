import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js';

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Platform } from '@ionic/angular';
import {CsvParserService} from '../csv-parser.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.page.html',
  styleUrls: ['./dictionary.page.scss'],
})

@Injectable()
export class DictionaryPage implements OnInit {

  private csvParser: CsvParserService;
  public referenceId: string;


  constructor(
    public platform: Platform,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.referenceId = route.snapshot.paramMap.get('id');
  }

  public csvCards: any;
  public selectedLanguage: string;
  public mainTopic: string;
  public searchBarContent: string;

  public csvCardsFiltered: any;
  public selectedTopics = [ true, true, true ];


  ngOnInit() {
    this.csvParser = new CsvParserService(this.http, 'dictionary', this.reloadCsv.bind(this));
    // this.getXmlContent();
    this.selectedLanguage = 'EN';
    this.mainTopic = 'photogrammetry';
  }

  reloadCsv(data){
    this.csvCards = data;
    setTimeout(() => {
      if (document.getElementById(this.referenceId) !== null){
        document.getElementById(this.referenceId).scrollIntoView({block: 'center', behavior: 'smooth'});
      }
    }, 200);
  }

  filterOnLanguage(language, xmlItems){ // Keeps only the cards that correspond to the selected language
    const attributeTag = '$';
    let counter = 0;
    for (const card of xmlItems){
      for (const lan of card.language){
        if (lan[attributeTag].country === language){
          card.language = [lan];
          card.id = counter;
          counter++;
        }
      }
    }
    console.log(xmlItems[0].language[0]);
  }

  filterOnSearch(){ // Filter content that match a specific pattern
    const pattern = this.searchBarContent.toLowerCase();
    for (const card of this.csvCards){
      if (
        (card.language[0].computer_vision[0].title !== undefined &&
          card.language[0].computer_vision[0].title.toLowerCase().search(pattern) >= 0 ) ||
        (card.language[0].photogrammetry[0].title !== undefined &&
          card.language[0].photogrammetry[0].title.toLowerCase().search(pattern) >= 0 ) ||
        (card.language[0].robotics[0].title !== undefined &&
          card.language[0].robotics[0].title.toLowerCase().search(pattern) >= 0 ) ||
        pattern === ''
      ){
        card.hidden = true;
      }else{
        card.hidden = false;
      }
    }
  }

  changeTopicsEvent(event, topic) {
    this.selectedTopics[topic] = event.detail.checked;
  }

}
