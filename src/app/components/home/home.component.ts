import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { CartService } from './../../services/cart.service';
import { Produtos } from './../../model/produtos-data.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router,
    private cartService: CartService) { }

  produtos: Produtos[]
  SERVICE_IMAGE

  ngOnInit(): void {
    this.SERVICE_IMAGE = environment.serviceImage
    //carregando os valores do produto na inicialização da classe ultilizando metodo para pegar todos os produtos cadastrados
    this.productService.getAllProducts().subscribe(produtos => {
      this.produtos = produtos
    })
  }

  //metodo que leva para pagina de um produto especifico contendo suas informações
  selecionarProduto(id: number) {
    this.router.navigate(['/product', id]).then()
  }

  //metodo para adicionar um produto no carrinho
  addingProductInCart(id: number) {
    this.cartService.addingProductInCart(id)
  }

}
