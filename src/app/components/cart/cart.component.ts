import { environment } from 'src/environments/environment';
import { CartService } from './../../services/cart.service';
import { CartModelServer } from './../../model/cart.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  dataCarrinho: CartModelServer;
  totalCarrinho: number;
  subTotal: number;

  SERVICE_IMAGE

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.SERVICE_IMAGE = environment.serviceImage + '/download?file='
    //pegando informacoes do cart service para serem mostradas na pagina
    this.cartService.dataCarrinho.subscribe((data: CartModelServer) => this.dataCarrinho = data)
    this.cartService.totalCarrinho.subscribe(total => this.totalCarrinho = total)
  }

  //metodo para incrementar ou decrementar a quantidade de um produto
  escolherQuantidade(index: number, incremento: boolean) {
    this.cartService.updatingCarrinhoItems(index, incremento)
  }

}
