import { environment } from './../../../environments/environment';
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
  SERVICE_IMAGE

  constructor(private crudProductService: CrudProductService) { }

  ngOnInit(): void {
    this.crudProductService.readProducts().subscribe(products => {
      this.products = products
      this.SERVICE_IMAGE = environment.serviceImage + '/download?file='
    })
  }

  updateStatus(id: string, status: boolean) {
    this.crudProductService.readProduct(id).subscribe(product => {
      if (status) {
        product.status = false
      } else {
        product.status = true
      }
      this.crudProductService.updateProductStatus(product).subscribe(() => {
      })
    })
  }

}
