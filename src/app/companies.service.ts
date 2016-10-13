import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Company } from './company';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CompaniesService {

  private companiesUrl = 'assets/companies.json';  // URL to web api

  constructor(private http: Http) { }

  getCompanies(): Promise<Company[]> {
    return this.http.get(this.companiesUrl)
    .toPromise()
    .then(response => response.json().map(elt => {
      return new Company(elt);
    }))
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
