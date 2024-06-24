import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }


  saveNewPhone(phoneData: any): Observable<any> {
    const url = 'api/phone';
    return this.http.PostRequest<any, any>(url, phoneData);
  }

  getPhoneType(): Observable<any> {
    return this.http.GetRequest('api/phone/type');
  }

  deletePhone(phoneId:number): Observable<any>{
    return this.http.DeleteRequest(`api/phone/${phoneId}`, '');
  }

  updatePhone(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/phone/${phoneId}`, phoneData);
  }
}
