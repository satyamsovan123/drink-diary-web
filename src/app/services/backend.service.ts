import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CommonService } from './common.service';
import { apiConstant } from '../constants/api.constant';
import { Data } from '../models/Data.model';
import { Authentication } from '../models/Authentication.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private backendUrl = environment.baseUrl;
  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) {}

  updateData(data: Data) {
    return this.httpClient.put(`${this.backendUrl}${apiConstant.DATA}`, data);
  }

  getData() {
    return this.httpClient.get(`${this.backendUrl}${apiConstant.DATA}`);
  }

  deleteData() {
    return this.httpClient.delete(`${this.backendUrl}${apiConstant.DATA}`);
  }

  deleteAccount() {
    return this.httpClient.delete(`${this.backendUrl}${apiConstant.ACCOUNT}`);
  }

  signin(data: Authentication) {
    return this.httpClient.post(
      `${this.backendUrl}${apiConstant.SIGN_IN}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  signup(data: Authentication) {
    return this.httpClient.post(
      `${this.backendUrl}${apiConstant.SIGN_UP}`,
      data,
      {
        observe: 'response',
      }
    );
  }
}
