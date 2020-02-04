import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { baseURL } from '../shared/baseurl'
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http : HttpClient,private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback>{
//    const httpOp = {
//      headers : {"Content-Type":"application/json"}
//    }
    return this.http.post<Feedback>(baseURL+'feedback',feedback,{headers : {"Content-Type":"application/json"}})
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }
}
