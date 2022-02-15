import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CsvParserService {

  csvString: string; // Csv string where the data is loaded from
  parsedCsv: string[]; // Full parsed csv
  csvTypes: string[] = [
    'timeline',
    'dictionary',
    'resources'
    ];
  remoteResources = { // Link to the remote resources
    [this.csvTypes[0]]: 'https://lightcam.fbk.eu/api?resource=timeline',
    [this.csvTypes[1]]: 'https://lightcam.fbk.eu/api?resource=dictionary',
    [this.csvTypes[2]]: 'https://lightcam.fbk.eu/api?resource=resources',
  };

  constructor(private http: HttpClient, private csvType: string, callback) {
    http.get(this.remoteResources[csvType], {responseType: 'text'}).subscribe(data => {
      const rows = CsvParserService.strToCsv(data);
      this.parsedCsv = null;
      if (csvType === this.csvTypes[0]){
        this.parsedCsv = this.parseTimelineContent(rows);
      }else if (csvType === this.csvTypes[1]){
        this.parsedCsv = this.parseDictionaryContent(rows);
      }else if (csvType === this.csvTypes[2]){
        this.parsedCsv = this.parseResourcesContent(rows);
      }
      callback(this.parsedCsv);
    });
  }

  static strToCsv(data: string){ // Parse a string into a grid
    // Row parsing
    const lines = [];
    const rows = []; // Lines split in columns
    let newLinePos = 0; // Position after the last newline character
    let inQuotationMarks: boolean; // Are the current /n in quotation marks or not, is so, avoid to create a row
    inQuotationMarks = false;

    // Split by \n
    for (let i = 0; i < data.length; i++){
      if (data[i] === '\n' && !inQuotationMarks){
        lines.push(data.substring(newLinePos, i));
        newLinePos = i + 1;
      }
      if (data[i] === '"' && i > 0 && data[i - 1] !== '\\'){
        inQuotationMarks = !inQuotationMarks;
      }
    }
    // Split by commas
    for (const l of lines){
      const splitLine = [];
      newLinePos = 0;
      inQuotationMarks = false;
      for (let i = 0; i < l.length; i++){
        if ((l[i] === ',' && !inQuotationMarks) || i === l.length - 1){
          if (l[newLinePos] === '"' && i > 0 && l[i - 1] === '"'){
            splitLine.push(l.slice(newLinePos + 1, i - 1));
          }else{
            splitLine.push(l.slice(newLinePos, i));
          }

          newLinePos = i + 1;
        }

        if (l[i] === '"' && i > 0 && l[i - 1] !== '\\'){
          inQuotationMarks = !inQuotationMarks;
        }
      }
      rows.push(splitLine);
    }
    lines.splice(0, lines.length); // Clear unused memory
    return rows;
  }

  parseTimelineContent(rows: string[]){
    // Content parsing
    enum columns{
      id,
      year,
      endYear,
      CvTitle,
      CvParagraph,
      CvMedia,
      CvMediaCredit,
      CvCaption,
      CvDictionaryRef,
      CvResourceRef,
      PhTitle,
      PhParagraph,
      PhMedia,
      PhMediaCredit,
      PhCaption,
      PhDictionaryRef,
      PhResourceRef,
      RoTitle,
      RoParagraph,
      RoMedia,
      RoMediaCredit,
      RoCaption,
      RoDictionaryRef,
      RoResourceRef
    }

    type Paragraph = { // TODO Look for attributes that could be set to optional
      paragraph_title?: string;
      paragraph_content: string;
      media?: string;
      mediaCredit?: string;
      caption?: string;
    };
    type Section = {
      paragraph?: [Paragraph];
      reference?: string;
      resourceRef?: string;
    };
    type Language = {
      photogrammetry: [Section]; // TODO Doesn't need to be vector, fix this
      computer_vision: [Section];
      robotics: [Section];
    };
    type CsvEvent = {
      date: Date;
      endDate: Date;
      language?: [Language];
    };
    rows = rows.slice(2);
    const CsvEvents = [];
    const emptySection: Section = {};
    for (const r of rows){
      // console.log(r);
      // Photogrammetry
      const P1: Paragraph = {
        paragraph_title : r[columns.PhTitle],
        paragraph_content : r[columns.PhParagraph],
        media : this.checkMediaLink(r[columns.PhMedia]),
        mediaCredit : r[columns.PhMediaCredit],
        caption : r[columns.PhCaption],
      };

      const S1: Section = {
        paragraph : [P1],
        reference : r[columns.PhDictionaryRef],
        resourceRef : r[columns.PhResourceRef]
      };
      // Robotics
      // console.log(r[columns.RoTitle]);
      const P2: Paragraph = {
        paragraph_title : r[columns.RoTitle],
        paragraph_content : r[columns.RoParagraph],
        media : this.checkMediaLink(r[columns.RoMedia]),
        mediaCredit : r[columns.RoMediaCredit],
        caption : r[columns.RoCaption],
      };

      const S2: Section = {
        paragraph : [P2],
        reference : r[columns.RoDictionaryRef],
        resourceRef : r[columns.RoResourceRef],
      };
      // Computer Vision
      const P3: Paragraph = {
        paragraph_title : r[columns.CvTitle],
        paragraph_content : r[columns.CvParagraph],
        media : this.checkMediaLink(r[columns.CvMedia]),
        mediaCredit : r[columns.CvMediaCredit],
        caption : r[columns.CvCaption],
      };

      const S3: Section = {
        paragraph : [P3],
        reference : r[columns.CvDictionaryRef],
        resourceRef : r[columns.RoResourceRef],
      };

      const lan: Language = {
        photogrammetry : r[columns.PhParagraph] !== '' ? [S1] : [emptySection],
        robotics : r[columns.RoParagraph] !== '' ? [S2] : [emptySection] ,
        computer_vision : r[columns.CvParagraph] !== '' ? [S3] : [emptySection],
      };

      const testEvent: CsvEvent = {
        date : this.strToDate(r[columns.year]),
        endDate : this.strToDate(r[columns.endYear]),
        language : [lan]
      };

      // TODO implement multi language support
      if (testEvent.date instanceof Date && !isNaN(testEvent.date.getTime())){
        CsvEvents.push(testEvent);
      }
    }
    //  console.log(CsvEvents);
    return CsvEvents;
  }

  parseDictionaryContent(rows: string[]){
    // Content parsing
    enum columns{
      id,
      CvTitle,
      CvDefinition,
      CvExternalLink,
      CvMedia,
      CvCaption,
      CvMediaCredit,
      CvDictionaryRef,
      PhTitle,
      PhDefinition,
      PhExternalLink,
      PhMedia,
      PhCaption,
      PhMediaCredit,
      PhDictionaryRef,
      RoTitle,
      RoDefinition,
      RoExternalLink,
      RoMedia,
      RoCaption,
      RoMediaCredit,
      RoDictionaryRef,
      RoMerge
    }
    type Word = { // TODO Look for attributes that could be set to optional
      title?: string;
      definition?: string;
      media?: string;
      mediaCredit?: string;
      mediaCaption?: string;
      externalLink?: string;
      resourceReference?: string; // Id relative to an item of the resource page
    };

    type Card = {
      photogrammetry: [Word]; // TODO Doesn't need to be vector, fix this
      computer_vision: [Word];
      robotics: [Word];
      roMerge?: string;
    };

    type language = { // TODO Better to use a more meaningful name
      language: [Card];
      id: string;
      hidden: boolean;
      shrink: boolean;
    };

    rows = rows.slice(2);
    let CsvCards = [];
    const emptyWord: Word = {};
    for (const r of rows){
      if (r[columns.RoTitle]  === '' && r[columns.PhTitle] === '' && r[columns.CvTitle] === ''){
        continue;
      }
      // Photogrammetry
      const W1: Word = {
        title : r[columns.PhTitle],
        definition : r[columns.PhDefinition],
        media : this.checkMediaLink(r[columns.PhMedia]),
        mediaCredit : r[columns.PhMediaCredit],
        mediaCaption : r[columns.PhCaption],
        externalLink : r[columns.PhExternalLink],
        resourceReference : r[columns.PhDictionaryRef],
      };
      // Robotics
      // console.log(r[columns.RoTitle]);
      const W2: Word = {
        title : r[columns.RoTitle],
        definition : r[columns.RoDefinition],
        media : this.checkMediaLink(r[columns.RoMedia]),
        mediaCredit : r[columns.RoMediaCredit],
        mediaCaption : r[columns.RoCaption],
        externalLink : r[columns.RoExternalLink],
        resourceReference : r[columns.RoDictionaryRef],
      };

      // Computer Vision
      const W3: Word = {
        title : r[columns.CvTitle],
        definition : r[columns.CvDefinition],
        media : this.checkMediaLink(r[columns.CvMedia]),
        mediaCredit : r[columns.CvMediaCredit],
        mediaCaption : r[columns.CvCaption],
        externalLink : r[columns.CvExternalLink],
        resourceReference : r[columns.CvDictionaryRef],
      };

      const card: Card = {
        photogrammetry : r[columns.PhDefinition] !== '' ? [W1] : [emptyWord],
        robotics : r[columns.RoDefinition] !== '' ? [W2] : [emptyWord] ,
        computer_vision : r[columns.CvDefinition] !== '' ? [W3] : [emptyWord],
        roMerge: r[columns.RoMerge],
      };

      const lan: language = {
        language : [card],
        id : r[columns.id],
        hidden : true,
        shrink: true,
      };

      // TODO implement multi language support
      // if (testEvent.date instanceof Date && !isNaN(testEvent.date.getTime())){
      //   CsvCards.push(testEvent);
      // }
      CsvCards.push(lan);
    }
    CsvCards = this.sortByTopic(CsvCards);
    return CsvCards;
  }

  parseResourcesContent(rawRows: string[]){
    enum columns{
      id,
      title,
      description,
      links
    }

    type Word = {
      title: string;
      description: string;
      link?: string;
    };

    type Language = {
      words: [Word];
      id: string;
    };

    rawRows = rawRows.slice(2);
    const Words = [];

    // Clear redundant quotes
    const rows = []; // TODO use a more fitting variable name
    for (const row of rawRows){
      const tmp: string[] = [];
      for (let column of row){
        if (column[0] === '"' && column[column.length - 1] === '"'){
          column = column.slice(1, column.length - 1);
        }
        tmp.push(column);
      }
      rows.push(tmp);
    }

    // Create the data structure to export
    for (const r of rows){
      if (r[columns.id]  === '' || (r[columns.title] === '' && r[columns.description] === '')){
        continue;
      }
      const W1: Word = { // TODO probably should create a class instead
        title : r[columns.title],
        description: r[columns.description],
        link: r[columns.links]
      };
      const L1: Language = {
        id : r[columns.id],
        words : [W1]
      };
      Words.push(L1);
    }
    return this.sortByTitle(Words);
  }

  parseWorkflowContent(rows: string[]){
    // console.log(rows);
    return rows;
  }

  sortByTopic(csvCards){ // Alphabetically sort by topic
    for (const csvCard of csvCards){
      if (csvCard.language[0].photogrammetry[0].title !== undefined){
        csvCard.topic = csvCard.language[0].photogrammetry[0].title;
      }else if (csvCard.language[0].computer_vision[0].title !== undefined){
        csvCard.topic = csvCard.language[0].computer_vision[0].title;
      }else if (csvCard.language[0].robotics[0].title !== undefined){
        csvCard.topic = csvCard.language[0].robotics[0].title;
      }else{
        csvCard.topic = null;
      }
    }

    let sorted = true;
    let ceiling = 0;
    do{
      sorted = true;
      for (let i = 0; i < csvCards.length - 1 - ceiling; i++){
        if (csvCards.topic !== null){
          if (csvCards[i].topic.localeCompare(csvCards[i + 1].topic) > 0){
            const tmp = csvCards[i];
            csvCards[i] = csvCards[i + 1];
            csvCards[i + 1] = tmp;
            sorted = false;
          }
        }
      }
      ceiling++;
    }while (!sorted);

    for (const csvCard of csvCards){
      delete csvCard.topic;
    }

    return csvCards;
  }
  sortByTitle(resources){ // Sort resources content by title
    let sorted = true;
    let ceiling = 0;
    do{
      sorted = true;
      for (let i = 0; i < resources.length - 1 - ceiling; i++){
        if (resources.topic !== null){
          if (resources[i].words[0].title.localeCompare(resources[i + 1].words[0].title) > 0){
            const tmp = resources[i];
            resources[i] = resources[i + 1];
            resources[i + 1] = tmp;
            sorted = false;
          }
        }
      }
      ceiling++;
    }while (!sorted);

    return resources;
  }

  checkMediaLink(link: string){ // Check whether the given link is a valid one or not, if not return a local path
    if (link.indexOf('http') < 0 && link !== ''){
      return '../../assets/imgs/timeline/' + link;
    }
    return link;
  }

  strToDate(txt: string): Date{ // Convert a year to a date type
    // txt = '2000/12/14';
    txt = txt.replace(' ', '');
    if (txt === ''){
      return null;
    }
    const date = new Date('');
    date.setFullYear(Number(txt));
    return date;
  }
}
