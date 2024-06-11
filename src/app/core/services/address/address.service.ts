import { Injectable } from '@angular/core';
import { HttpInvokeService } from '../http-invoke.service'
import { Observable } from 'rxjs';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AddrressService {
  private backendUrl?: string;


  constructor(private http: HttpInvokeService) {
    this.backendUrl = environment.backendUrl;
  }


  saveNewAddress(addressData: any): Observable<any> {
    const url = 'api/address';
    return this.http.PostRequest<any, any>(url, addressData);
  }

  getAddressType(): Observable<any> {
    return this.http.GetRequest('api/address/type');
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.DeleteRequest(`api/address/${id}`,'');
  }

  updateAddress(ContactAddressID:number, addressData:any): Observable<any>{
    return this.http.PutRequest(`api/address/${ContactAddressID}`, addressData);
  }
}
