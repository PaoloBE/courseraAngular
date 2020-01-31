import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish'
import { DISHES } from '../shared/dishes'

import { of, Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { baseURL } from '../shared/baseurl'
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})



export class DishService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
              .pipe(catchError(error => error));
  }
 
  getDishes(): Observable<Dish[]>{
    return this.http.get<Dish[]>(baseURL + 'dishes')
              .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  getDish(id: string): Observable<Dish>{
    return this.http.get<Dish>(baseURL + 'dishes/'+ id)
              .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeactureDish(): Observable<Dish> {
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0]))
              .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
