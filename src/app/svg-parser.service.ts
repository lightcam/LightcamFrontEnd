import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SvgParserService {

  constructor(private http: HttpClient, callback) {
    const link = 'https://lightcam.fbk.eu/api?resource=workflow';
    const regex = /<svg [^>]*>/g;
    http.get(link, {responseType: 'text'}).subscribe(data => {
      let tmp = data.split('\n')[3];
      tmp = tmp.replace(regex, '');
      tmp = tmp.replace('</svg>', '');
      callback(tmp);
    });
  }
}
