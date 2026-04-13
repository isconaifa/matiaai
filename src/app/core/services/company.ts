import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { RegisterCompanyRequest, RegisterCompanyResponse } from '../../shared/models/company.models';

@Injectable({
  providedIn: 'root',
})
export class Company {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3002/api/auth/companies';
  
registerCompany(data: RegisterCompanyRequest): Observable<RegisterCompanyResponse> {
  // Ajuste a URL conforme o seu ambiente (ex: http://localhost:3002/companies/register)
  const url = `${this.apiUrl}/register`; 
  
  return this.http.post<RegisterCompanyResponse>(url, data).pipe(
    take(1) // Garante que o stream feche após a primeira resposta
  );
}
  
}
