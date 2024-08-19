import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }




  getSearchParams(): Observable<any> {
    return this.http.GetRequest(`api/search-params`);
  }

  getSearchParamsColumns(): Observable<any> {
    return this.http.GetRequest(`api/userdefine-columns-id`);
  }

  // search(params: any): Observable<any> {
  //   return this.httpInvoker(params); // Utiliza tu método httpInvoker
  // }

  searchData(params: any): Observable<any> {
    // Transforma los parámetros en una cadena de consulta
    const queryParams = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const url = `api/search-contacts?${queryParams}`;
    return this.http.GetRequest(url);
  }





}
