import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }


  saveNewEmail(emailData: any): Observable<any> {
    const url = 'api/email';
    return this.http.PostRequest<any, any>(url, emailData);
  }

  getEmailType(): Observable<any> {
    return this.http.GetRequest('api/email/type');
  }

  deleteEmail(emailId:number): Observable<any>{
    return this.http.DeleteRequest(`api/email/${emailId}`, '');
  }

  updateEmail(emailId:number, emailData:any): Observable<any>{
    return this.http.PutRequest(`api/email/${emailId}`, emailData);
  }
}
