import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private toast: ToastrService, private httpClient: HttpClient) { }

  login(userName: string, password: string) {
    if (userName === "marcos") {
      this.toast.success('Login Efetuado com sucesso', 'Login', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
    } else {
      this.toast.error('Senha ou usuario incorretos', 'Login', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
    }

  }
}
