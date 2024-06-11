import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { KPIContactModel, KPIGenderModel } from './models';

@Injectable({
  providedIn: 'root'
})
export class KPIService {

  constructor(private http: HttpInvokeService) {
  }

  getKpiForContact(): Observable<KPIContactModel> {
    return this.http.GetRequest<KPIContactModel>('api/kpi/contact');
  }

  getKpiForGendert(): Observable<KPIGenderModel> {
    return this.http.GetRequest<KPIGenderModel>('api/kpi/gender');
  }

  getKpiForPopulation(): Observable<any> {
    return this.http.GetRequest<any>('api/kpi/population');
  }
}
