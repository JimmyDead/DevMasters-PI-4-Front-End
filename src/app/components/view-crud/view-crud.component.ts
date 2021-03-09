import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-crud',
  templateUrl: './view-crud.component.html',
  styleUrls: ['./view-crud.component.css']
})
export class ViewCrudComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  newProduct(){
    this.router.navigate(['/create-product'])
  }
}
