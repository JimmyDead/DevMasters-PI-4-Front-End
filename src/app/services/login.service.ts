import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private toast: ToastrService, private httpClient: HttpClient,
    private router: Router) { }

  private SERVER_URL = environment.serverURL

  login(userName: string, password: string) {
    let url = `${this.SERVER_URL}/login?username=${userName}&password=${password}`
    //AINDA NÃO ESTÁ PRONTO
    this.httpClient.get(url).subscribe(result => {
      let response = result[0]
      if (response.user_name === userName && response.password === password) {
        this.toast.success('Login Efetuado com sucesso', 'Login', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        this.router.navigate(['/view-crud'])
      } else {
        this.toast.error('Senha ou usuario incorretos', 'Login', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    })
  }
}
