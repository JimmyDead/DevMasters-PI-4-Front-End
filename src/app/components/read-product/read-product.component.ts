import { Produtos } from './../../model/produtos-data.model';
import { CrudProductService } from './../../services/crud-product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-read-product',
  templateUrl: './read-product.component.html',
  styleUrls: ['./read-product.component.css']
})
export class ReadProductComponent implements OnInit {

  products: Produtos[]

  displayedColumns: string[] = ['id', 'title', 'price', 'quantity',
   'description', 'image', 'images', 'category', 'action']

  constructor(private crudProductService: CrudProductService) { }

  ngOnInit(): void {
    this.crudProductService.readProducts().subscribe(products => {
      this.products = products
    })
  }

}
