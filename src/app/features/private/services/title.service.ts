import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private titleSubject = new BehaviorSubject<string>('');
  currentTitle = this.titleSubject.asObservable();

  changeTitle(title: string) {
    this.titleSubject.next(title);
  }
}
