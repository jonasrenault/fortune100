import { Component, OnInit } from '@angular/core';
import { Company } from '../company';
import { CompaniesService } from '../companies.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  public companies : Company[];
  public filteredCompanies: Company[];
  public nameControl = new FormControl();
  public name = '';
  private selectedCompany : Company;
  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
    this.companiesService.getCompanies().then(companies => {
      this.companies = companies;
      this.filteredCompanies = companies;
    });
    this.nameControl.valueChanges.debounceTime(300).subscribe(newValue => {
      this.name = newValue;
      this.filter();
    });
  }

  public filter(): void {
    const nameFilter = this.name ? this.name.toLowerCase() : null;
    this.filteredCompanies = this.companies.filter((elt: Company) => !nameFilter || elt.name.toLowerCase().indexOf(nameFilter) !== -1 );
  }

  public onSelect(company: Company) {
    this.selectedCompany = company;
  }

}
