import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CartService } from './../../services/cart.service';
import { CartModelServer } from './../../model/cart.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  carrinhoData: CartModelServer
  carrinhoTotal: number

  SERVICE_IMAGE = environment.serviceImage

  constructor(public cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    //pegando informacoes da classe cartService na inicializacao
    this.cartService.totalCarrinho.subscribe(total => this.carrinhoTotal = total)
    this.cartService.dataCarrinho.subscribe(data => this.carrinhoData = data)
  }

  //abre o dialogo perguntando se deseja excluir o produto
  openDialogDeleteProduct(index, produto) {
    this.cartService.openDialogDeleteProduct(index, produto)
  }

  selecionarProduto(id: number) {
    this.router.navigate(['/product', id]).then()
  }

}
