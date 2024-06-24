import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { ContactDataResponse, Phone, PhoneDataResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }




  searchByText(searchText: string): Observable<any> {
    const params = new HttpParams().set('$search', searchText);
    const url = `odata/FormRequest`;
    return this.http.get(url, params );
  }

  saveNewProspect(prospectData: any): Observable<any> {
    const url = 'api/contact';
    return this.http.PostRequest<any, any>(url, prospectData);
  }

  getFormData(pageIndex:number, pageSize:number): Observable<any> {
    return this.http.GetRequest(`api/contact/prospect?page=${pageIndex}&limit=${pageSize}`);
  }

  getProspectByID(id:number): Observable<ContactDataResponse> {
    return this.http.GetRequest(`api/contact/prospect/${id}`)
  }

  getPhonesByProspect(id:number):Observable<any> {
    return this.http.GetRequest(`api/phone/${id}`);
  }

  getEmailByProspect(id:number):Observable<any> {
    return this.http.GetRequest(`api/email/${id}`);
  }

  getAddressByProspect(id:number):Observable<any> {
    return this.http.GetRequest(`api/contact/address/${id}`);
  }

  getGender():Observable<any>{
    return this.http.GetRequest('api/genders');
  }

  getTitle():Observable<any>{
    return this.http.GetRequest('api/titles');
  }

  getSuffix():Observable<any>{
    return this.http.GetRequest('api/suffix');
  }

  getStatus():Observable<any>{
    return this.http.GetRequest('api/status');
  }

  getSources():Observable<any>{
    return this.http.GetRequest('api/sources');
  }

  getMaritalStatus():Observable<any>{
    return this.http.GetRequest('api/marital-status');
  }

  getPLanguage():Observable<any>{
    return this.http.GetRequest('api/preferred-language');
  }

  getSpecialDesignation():Observable<any>{
    return this.http.GetRequest('api/designation');
  }


  updateProspect(data:any, id:number):Observable<any>{
    const url = `api/contact/name/${id}`;
    return this.http.PutRequest<any, any>(url, data);
  }

  deleteContact(contactId:number): Observable<any>{
    return this.http.DeleteRequest(`api/contact/delete/${contactId}`, '');
  }



}
