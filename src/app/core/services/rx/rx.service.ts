import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { DrugFrequencyModel, NdcProperty, PackagingList, PrescriptionsModel, RxModel, RxPackageModel } from './models';



@Injectable({
  providedIn: 'root'
})
export class RxService {
  private providerUrl?:string;



  constructor(private http: HttpInvokeService, private http2: HttpClient) {
    this.providerUrl = environment.providerUrl;
  }


  getRxByName(rxName: string,): Observable<RxModel> {
    return this.http2.get<RxModel>(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${rxName}`);
  }

  getPackageByRxcui(rxCui:string):Observable<RxPackageModel>{
    return this.http2.get<RxPackageModel>(`https://rxnav.nlm.nih.gov/REST/ndcproperties.json?id=${parseInt(rxCui)}`);
  }

  saveDrugs(drugData: any): Observable<any> {
    const url = 'api/health';
    return this.http.PostRequest<any, any>(url, drugData);
  }

  getDrugsFrecuency(): Observable<DrugFrequencyModel> {
    return this.http.GetRequest('api/health/frequency');
  }

  getPrescriptionDrugsById(contactID:number): Observable<PrescriptionsModel> {
    return this.http.GetRequest(`api/health/drugs/${contactID}`);
  }

  saveHealthInfo(healthData: any): Observable<any> {
    const url = 'api/health-info';
    return this.http.PostRequest<any, any>(url, healthData);
  }

  getHealthInfoById(contactID:number): Observable<any> {
    return this.http.GetRequest(`api/health-info/${contactID}`);
  }

  updateHealthInfo(contactID:number, healthData: any): Observable<any>{
    return this.http.PutRequest(`api/health-info/${contactID}`, healthData);
  }

  getHealthTrackerById(contactID:number): Observable<any> {
    return this.http.GetRequest(`api/healthtracker/${contactID}`);
  }

  saveHealthTracker(healthData: any): Observable<any> {
    const url = 'api/healthtracker';
    return this.http.PostRequest<any, any>(url, healthData);
  }

  updateHealthTracker(contactID:number, healthData: any): Observable<any>{
    return this.http.PutRequest(`api/healthtracker/${contactID}`, healthData);
  }

}
