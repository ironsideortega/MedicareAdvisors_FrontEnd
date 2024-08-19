import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDefineService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }




  getUserDefineByProfile(profileId: number): Observable<any> {
    return this.http.GetRequest(`api/userdefine-views/${profileId}`);
  }

  getUserDefineColumns(profileId: number): Observable<any> {
    return this.http.GetRequest(`api/userdefine-columns/${profileId}`);
  }


  createUserDefinedView(profileID: number, udvName: string, columnIDs: number[]): Observable<any> {
    const payload = {
      profileID,
      udvName,
      columnIDs,
    };
    const url = 'api/user-defined-view';
    return this.http.PostRequest<any, any>(url, payload);
  }

  deleteUDV(id: number): Observable<any> {
    return this.http.DeleteRequest(`api/user-defined-view/${id}`, '');
  }







}
