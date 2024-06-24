import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsChangeTableService {
  public isChange$ = new BehaviorSubject<boolean>(false);

  constructor() { }
}
