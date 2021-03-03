import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  userName: string;
  password: string;

  ngOnInit(): void {
  }

  login() {
    this.loginService.login(this.userName, this.password)
    this.userName = ""
    this.password = ""
  }

}
