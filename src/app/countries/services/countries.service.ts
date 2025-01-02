import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CachStore } from '../interfaces/cach-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cachStore: CachStore = {
    byCapital: {
      term: '',
      countries: [],
    },
    byCountries: {
      term: '',
      countries: [],
    },
    byRegion: {
      region: '',
      countries: [],
    },
  };

  constructor(private http: HttpClient) {

    this.loadFromLocalStorage();

  }

  private saveToLocalStorage() {
    localStorage.setItem('cachStore', JSON.stringify(this.cachStore));
  }

  private loadFromLocalStorage() {
    const cachStore = localStorage.getItem('cachStore');
    if (cachStore) {
      this.cachStore = JSON.parse(cachStore);
    }
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url).pipe(catchError((error) => of([])));
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.http.get<Country[]>(url).pipe(
      map((countries) => countries?.[0] || null),
      catchError((error) => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => this.cachStore.byCapital = { term, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => this.cachStore.byCountries = { term, countries }),
      tap(() => this.saveToLocalStorage())
    );;
  }

  searchRegion(term: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => this.cachStore.byRegion = { region: term, countries }),
      tap(() => this.saveToLocalStorage())
    );;
  }
}
