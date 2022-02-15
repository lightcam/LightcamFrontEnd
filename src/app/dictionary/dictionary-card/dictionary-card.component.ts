import { Component, Input, OnInit } from '@angular/core';
import { Topics } from 'src/app/timeline/selection-buttons/selection-buttons.component';

@Component({
  selector: 'app-dictionary-card',
  templateUrl: './dictionary-card.component.html',
  styleUrls: ['./dictionary-card.component.scss'],
})
export class DictionaryCardComponent implements OnInit {

  @Input() item;
  @Input() referenceId;
  @Input() selectedTopics;

  mainTopic = "photogrammetry";   // TODO: should be user preference, not hard coded

  Topics = Topics;
  numberOfTopics: number = 0;

  constructor() { }

  ngOnInit() {
    this.calcNumberOfTopics();
    if ('dictionary-' + this.item.id === this.referenceId){
      this.item.shrink = false;
    }
  }

  calcNumberOfTopics(): number {

    let t = 0;

    if (this.item.language[0].photogrammetry[0].hasOwnProperty("title"))
      t++;

    if (this.item.language[0].computer_vision[0].hasOwnProperty("title"))
      t++;

    if (this.item.language[0].robotics[0].hasOwnProperty("title"))
      t++;

    this.numberOfTopics = t;

    return t;
  }

  hasTopic(t: Topics): boolean {

    switch (t) {

      case Topics.Photogrammetry:
        return this.item.language[0].photogrammetry[0].hasOwnProperty("title");
        break;

      case Topics.ComputerVision:
        return this.item.language[0].computer_vision[0].hasOwnProperty("title");
        break;

      case Topics.Robotics:
        return this.item.language[0].robotics[0].hasOwnProperty("title");
        break;
    }
  }

  toggleShrink(card){ // Toggle shrink status of a card
    card.shrink = ! card.shrink;
  }
}
