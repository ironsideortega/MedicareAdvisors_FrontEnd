import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpInvokeService } from './http-invoke.service';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
  private cache: any = {};

  constructor(private http: HttpInvokeService) {}

  getEmailType(): Observable<any> {
    if (!this.cache.emailType) {
      this.cache.emailType = this.http.GetRequest('api/email/type').pipe(map(response => response));
    }
    return this.cache.emailType;
  }

  getPhoneType(): Observable<any> {
    if (!this.cache.phoneType) {
      this.cache.phoneType = this.http.GetRequest('api/phone/type').pipe(map(response => response));
    }
    return this.cache.phoneType;
  }

  getAddressType(): Observable<any> {
    if (!this.cache.addressType) {
      this.cache.addressType = this.http.GetRequest('api/address/type').pipe(map(response => response));
    }
    return this.cache.addressType;
  }

  getDataForProspect(ContactId:number): Observable<any> {
    if (!this.cache.dataForProspect) {
      this.cache.dataForProspect = this.http.GetRequest(`api/contact/prospect/${ContactId}`).pipe(map(response => response));
    }
    return this.cache.dataForProspect;
  }

  getPhoneByProspect(ContactId:number): Observable<any> {
    if (!this.cache.phoneByProspect) {
      this.cache.phoneByProspect = this.http.GetRequest(`api/phone/${ContactId}`).pipe(map(response => response));
    }
    return this.cache.phoneByProspect;
  }

  getGenders(): Observable<any> {
    if (!this.cache.genders) {
      this.cache.genders = this.http.GetRequest('api/genders').pipe(map(response => response));
    }
    return this.cache.genders;
  }

  getSuffixes(): Observable<any> {
    if (!this.cache.suffixes) {
      this.cache.suffixes = this.http.GetRequest('api/suffix').pipe(map(response => response));
    }
    return this.cache.suffixes;
  }

  getTitles(): Observable<any> {
    if (!this.cache.titles) {
      this.cache.titles = this.http.GetRequest('api/titles').pipe(map(response => response));
    }
    return this.cache.titles;
  }

  getStatus(): Observable<any> {
    if (!this.cache.status) {
      this.cache.status = this.http.GetRequest('api/status').pipe(map(response => response));
    }
    return this.cache.status;
  }

  getSources(): Observable<any> {
    if (!this.cache.sources) {
      this.cache.sources = this.http.GetRequest('api/sources').pipe(map(response => response));
    }
    return this.cache.sources;
  }

  getPLanguage(): Observable<any> {
    if (!this.cache.pLanguage) {
      this.cache.pLanguage = this.http.GetRequest('api/preferred-language').pipe(map(response => response));
    }
    return this.cache.pLanguage;
  }

  getMStatus(): Observable<any> {
    if (!this.cache.mStatus) {
      this.cache.mStatus = this.http.GetRequest('api/marital-status').pipe(map(response => response));
    }
    return this.cache.mStatus;
  }

  getSpecialD(): Observable<any> {
    if (!this.cache.specialD) {
      this.cache.specialD = this.http.GetRequest('api/designation').pipe(map(response => response));
    }
    return this.cache.specialD;
  }

  getEmailByProspect(contactID:number): Observable<any> {
    if (!this.cache.emailByProspect) {
      this.cache.emailByProspect = this.http.GetRequest(`api/email/${contactID}`).pipe(map(response => response));
    }
    return this.cache.emailByProspect;
  }

  getDoctorsByContactId(contactID:number): Observable<any> {
    if (!this.cache.doctorsByContactId) {
      this.cache.doctorsByContactId = this.http.GetRequest(`api/doctor/${contactID}`).pipe(map(response => response));
    }
    return this.cache.doctorsByContactId;
  }

  getDoctorStatus(): Observable<any> {
    if (!this.cache.doctorStatus) {
      this.cache.doctorStatus = this.http.GetRequest('api/doctor/status').pipe(map(response => response));
    }
    return this.cache.doctorStatus;
  }

  getDoctorImportance(): Observable<any> {
    if (!this.cache.doctorImportance) {
      this.cache.doctorImportance = this.http.GetRequest('api/doctor/importance').pipe(map(response => response));
    }
    return this.cache.doctorImportance;
  }

  getDoctorSpecialty(): Observable<any> {
    if (!this.cache.doctorSpecialty) {
      this.cache.doctorSpecialty = this.http.GetRequest('api/doctor/specialty').pipe(map(response => response));
    }
    return this.cache.doctorSpecialty;
  }
}
