import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Location, LocationsResponse } from './location'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class AppService {

  constructor(private http: HttpClient) {}

  getLocations(): Observable<LocationsResponse> {
    return this.http.get<LocationsResponse>('api/getLocations', httpOptions).pipe();
  }

}
