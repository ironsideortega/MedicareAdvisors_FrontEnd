import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {


  constructor(private http: HttpInvokeService) {
  }


  saveSocial(socialData: any): Observable<any> {
    const url = 'api/pdssn';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getSocialById(id: number): Observable<any> {
    return this.http.GetRequest(`api/pdssn/${id}`);
  }

  updateSocial(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/pdssn/${phoneId}`, phoneData);
  }

  //Medicare

  saveMedicare(socialData: any): Observable<any> {
    const url = 'api/medicare';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getMedicareById(id: number): Observable<any> {
    return this.http.GetRequest(`api/medicare/${id}`);
  }

  updateMedicare(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/medicare/${phoneId}`, phoneData);
  }

  //spap
  saveSpap(socialData: any): Observable<any> {
    const url = 'api/pdspap';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getSpapById(id: number): Observable<any> {
    return this.http.GetRequest(`api/pdspap/${id}`);
  }

  updateSpap(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/pdspap/${phoneId}`, phoneData);
  }

  //VA
  saveVA(socialData: any): Observable<any> {
    const url = 'api/pdVa';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getVAById(id: number): Observable<any> {
    return this.http.GetRequest(`api/pdVa/${id}`);
  }

  updateVA(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/pdVa/${phoneId}`, phoneData);
  }

  //VAULT
  saveVault(socialData: any): Observable<any> {
    const url = 'api/pdvault';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getVaultById(id: number): Observable<any> {
    return this.http.GetRequest(`api/pdvault/${id}`);
  }

  updateVault(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/pdvault/${phoneId}`, phoneData);
  }

  //Medicaid
  saveMedicaid(socialData: any): Observable<any> {
    const url = 'api/pdMedicaid';
    return this.http.PostRequest<any, any>(url, socialData);
  }

  getMedicaidById(id: number): Observable<any> {
    return this.http.GetRequest(`api/pdMedicaid/${id}`);
  }

  getAssistenceLevels(): Observable<any> {
    return this.http.GetRequest(`api/pdAsistence/`);
  }

  updateMedicaid(phoneId:number, phoneData:any): Observable<any>{
    return this.http.PutRequest(`api/pdMedicaid/${phoneId}`, phoneData);
  }
}
