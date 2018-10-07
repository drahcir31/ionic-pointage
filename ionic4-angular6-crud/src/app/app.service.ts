import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Semaine } from './home/horaire.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  apiPath = '/api/private';
  constructor(private http: HttpClient) { }


  getStorage(key: string): Observable<Semaine> {
    // Or to get a key/value pair
    return this.http.get<Semaine>(this.apiPath + '/semaine/' + key);
  }

  setStorage( data: Semaine): Observable<Semaine> {
  // Or to get a key/value pair
  return this.http.post<Semaine>(this.apiPath + '/semaine', { 'semaine': data});
  }

  getAllSemaine() {
    return this.http.get<Array<string>>(this.apiPath + '/semaineall');
  }

}
