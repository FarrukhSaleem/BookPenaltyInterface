import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Country } from '../app/Model/Country'
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  checkoutDate: Date;
  returnDate: Date;
  countryId: Number;
  countries: Country[];
  title = 'PCFE';
  BusinessDays: String;
  PenaltyDays: String;
  Fine: String;
  Currency: String;
  penalizedFactor: String;

  constructor(private httpClient: HttpClient, public datePipe: DatePipe) {}

  ngOnInit() {
    
    this.checkoutDate = new Date(this.datePipe.transform(Date.now(), 'yyyy-MM-dd'));
    this.returnDate = new Date(Date.now());
    this.getAllCountry();
  }

  getAllCountry() {

        this.httpClient.get('https://localhost:44374/api/Country/GetAllCountries')
          .pipe(map((response: Country[]) => {
              return response.map(d => {
                console.log('Map: ', d)
                return new Country(d);
              });
          }))
          .subscribe(result => {
            console.log('Final: ', result)
            this.countries = result;
            //this.countryId = result[0].Id;
            console.log('Country ID: ', this.countryId)
          });
  }
  
  changeValue(selectedCountry: Number) {
    console.log('selectedCountry: ', selectedCountry);
    this.countryId = selectedCountry
  }

  calculatePenalty() {

    let formatedDateCheckout = this.datePipe.transform(this.checkoutDate, 'MM/dd/yyyy');
    let formatedreturnDate = this.datePipe.transform(this.returnDate, 'MM/dd/yyyy');

    console.log('checkoutDate: ', formatedDateCheckout);
    console.log('returnDate: ', formatedreturnDate);

    let queryString = "?countryId=" + this.countryId + "&checkoutDate=" + formatedDateCheckout + "&returnDate=" + formatedreturnDate;
    this.httpClient.get('https://localhost:44374/api/Country/GetPaneltyByCountry' + queryString)
          .subscribe((result: any) => {
            console.log('penaltyAmount: ', result)
            this.BusinessDays = result.BusinessDays;
            this.PenaltyDays = result.PenaltyDays;
            this.Fine = result.Fine;
            this.Currency = result.Currency;
            this.penalizedFactor = result.penalizedFactor;
          });

    
  }

}
