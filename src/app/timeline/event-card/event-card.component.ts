import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Topics } from '../selection-buttons/selection-buttons.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit, AfterViewInit {

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

  @Input() id: number = null;
  @Input() xmlEvent: any;       // TODO: ideally a type/model should be made...
  @Input() selectedTopic: Topics = Topics.Photogrammetry;
  @Input() platform: Platform;

  @Output() height = new EventEmitter<number>();

  public selectedTopicXml = 'photogrammetry';   // TODO: set to user-selected default topic
  public cardButtons: Topics[] = [];
  public cardButtonsBackground = '#9e9e9e';

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit() {

    // console.log(this.id + '\n' + this.xmlEvent);
    this.cardButtons = [];
    this.computeSelBtns();
  }

  // When stuff changes (including @Input) re-init component
  ngOnChanges(model: any) {
    this.ngOnInit();
  }

  ngAfterViewInit() {

    // console.log(this.element.nativeElement.offsetHeight);
    this.height.emit(this.element.nativeElement.offsetHeight);
  }

  computeSelBtns() {

    // console.log(this.xmlEvent);

    this.cardButtonsBackground = '#9e9e9e';
    // this.selectedTopic.push(this.mainTopic);

    if (this.xmlEvent.language[0].photogrammetry[0].hasOwnProperty('paragraph')) {
      this.cardButtons.push(Topics.Photogrammetry);
    }
    if (this.xmlEvent.language[0].computer_vision[0].hasOwnProperty('paragraph')) {
      this.cardButtons.push(Topics.ComputerVision);
    }
    if (this.xmlEvent.language[0].robotics[0].hasOwnProperty('paragraph')) {
      this.cardButtons.push(Topics.Robotics);
    }
  }

  topicChange(e: Event) {

    this.selectedTopic = e as unknown as Topics;
    this.selectedTopicXml = this.decodeTopic(e as unknown as Topics);
    this.cardButtonsBackground = this.decodeColor(e as unknown as Topics);
    // console.log(this.xmlEvent.language[0][this.selectedTopicXml][0]['paragraph'])
  }

  getTopicReadable(t: Topics) {

    switch (t) {

      case Topics.Photogrammetry:
        return 'Photogrammetry';
      case Topics.ComputerVision:
        return 'Computer Vision';
      case Topics.Robotics:
        return 'Robotics';
    }
  }

  dateFormatter(roman= false){ // Format Dates in a fancy way
    let rtn = '';
    if (roman){
      rtn += this.IntToRoman(Math.abs(this.xmlEvent.date.getFullYear()));
    }else{
      rtn += Math.abs(this.xmlEvent.date.getFullYear());
    }

    if (this.xmlEvent.endDate !== undefined){
      if (roman){
        rtn += ' - ' + this.IntToRoman(Math.abs(this.xmlEvent.endDate.getFullYear()));
      }else {
        rtn += ' - ' + Math.abs(this.xmlEvent.endDate.getFullYear());
      }

    }

    if (this.xmlEvent.date.getFullYear() < 0){
      rtn += ' AC';
    }
    return rtn;
  }

  romanToInt(str) { // Convert a roman date into a integer one
    let result = 0;
    let previous = 0;
    for (const char of str.split('').reverse()) {
      const current = EventCardComponent.values.get(char);
      if (current >= previous) {
        result += current;
      } else {
        result -= current;
      }
      previous = current;
    }
    return result;
  }

  IntToRoman(num) // Convert an integer to a roman number
  {
    let rtn = '';
    for (const key of Array.from(EventCardComponent.values.keys()).reverse())
    {
      let div = Math.floor(num / EventCardComponent.values.get(key));
      num = num % EventCardComponent.values.get(key);
      while (div--)
      {
        rtn += key;
      }
    }
    return rtn;
  }

  private decodeTopic(t: Topics) {

    switch (t) {

      case Topics.Photogrammetry:
        return 'photogrammetry';
      case Topics.ComputerVision:
        return 'computer_vision';
      case Topics.Robotics:
        return 'robotics';
    }
  }

  private decodeColor(t: Topics) {

    switch (t) {

      case Topics.Photogrammetry:
        return 'var(--photogrammetry-color)';
      case Topics.ComputerVision:
        return 'var(--computervision-color)';
      case Topics.Robotics:
        return 'var(--robotics-color)';
    }
  }

}
