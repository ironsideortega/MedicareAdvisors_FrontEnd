import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { DoctorData, DoctorImportanceModel, DoctorModel, DoctorSpecialtyModel, DoctorStatusModel, ProviderModel } from './model';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private providerUrl?:string;



  constructor(private http: HttpInvokeService, private http2: HttpClient) {
    this.providerUrl = environment.providerUrl;
  }




  // searchByText(searchText: string): Observable<any> {
  //   const params = new HttpParams().set('$search', searchText);
  //   const url = `odata/FormRequest`;
  //   return this.http.get(url, params );
  // }

  // getDoctorByLastName(lastName:string): Observable<ProviderModel> {
  //   return this.http.GetRequestProvider(lastName)
  // }

  getDoctorByLastName(lastName: string, state:string, firstName:string, taxonomy:string): Observable<ProviderModel> {
    return this.http.GetRequest<ProviderModel>(`api/search/?last_name=${lastName}&postal_code=${state}&limit=200&version=2.1`);
  }

  getDoctorByContactID(ContactId:number): Observable<DoctorModel>{
    return this.http.GetRequest<DoctorModel>(`api/doctor/${ContactId}`);
  }

  getDoctorStatus():Observable<DoctorStatusModel>{
    return this.http.GetRequest<DoctorStatusModel>(`api/doctor/status`);
  }

  getDoctorSpecialty():Observable<DoctorSpecialtyModel>{
    return this.http.GetRequest<DoctorSpecialtyModel>(`api/doctor/specialty`);
  }

  getDoctorImportance():Observable<DoctorImportanceModel>{
    return this.http.GetRequest<DoctorImportanceModel>(`api/doctor/importance`);
  }

  saveNewDoctor(doctorData: any): Observable<any> {
    const url = 'api/doctor';
    return this.http.PostRequest<any, any>(url, doctorData);
  }

  deleteProvider(ProviderId:number): Observable<any>{
    return this.http.DeleteRequest(`api/doctor/${ProviderId}`,'');
  }
}
