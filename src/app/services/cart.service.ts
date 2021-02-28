import { Produtos } from './../model/produtos-data.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { CartModelPublic, CartModelServer } from './../model/cart.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private SERVER_URL = environment.serverURL

  //criando objeto que vai armazenar os dados do carrinho
  private cartDataClient: CartModelPublic = {
    total: 0,
    produtoData: [{
      noCarrinho: 0,
      id: 0
    }]
  }

  //criando objeto que vai conter os dados do storage do navegador
  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      quantidadeEmCarrinho: 0,
      produto: undefined
    }]
  }

  //Observables para componentes de subscrição
  totalCarrinho = new BehaviorSubject<number>(0);
  dataCarrinho = new BehaviorSubject<CartModelServer>(this.cartDataServer)

  constructor(private httpClient: HttpClient, private productService: ProductService,
    private orderService: OrderService, private router: Router,
    private toast: ToastrService, private spinner: NgxSpinnerService,
    private dialog: MatDialog) {

    //setando valores do storage do navegador no carrinho
    this.totalCarrinho.next(this.cartDataServer.total)
    this.dataCarrinho.next(this.cartDataServer)

    //pegando a informação do storage do navegador caso tenha
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'))

    //checando se a variavel é nula ou possui algum dado
    if (info !== null && info !== undefined && info.produtoData[0].noCarrinho !== 0) {
      this.cartDataClient = info
    }

    //interando os elementos pegos no storage server que foram passados para o client carrinho
    // caso o id seja maior chamamos o metodo para pegar produto, o metodo é uma promisse
    this.cartDataClient.produtoData.forEach(p => {
      if (p.id > 0) { //TALVEZ ESSE IF POSSA DAR PAU
        this.productService.getProduct(p.id).subscribe((produtoAtualInfo: Produtos) => {
          if (this.cartDataServer.data[0].quantidadeEmCarrinho === 0) {
            //caso não tenha nada estamos salvando no storage
            this.cartDataServer.data[0].quantidadeEmCarrinho = p.noCarrinho
            this.cartDataServer.data[0].produto = produtoAtualInfo
            // TODO criar funcao que calcula o total e colocar aqui
            this.calcularTotalProduto()
            this.cartDataClient.total = this.cartDataServer.total
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          } else {
            this.cartDataServer.data.push({
              quantidadeEmCarrinho: p.noCarrinho,
              produto: produtoAtualInfo
            })
            // TODO criar funcao que calcula o total e colocar aqui
            this.calcularTotalProduto()
            this.cartDataClient.total = this.cartDataServer.total
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          }

          this.dataCarrinho.next({ ...this.cartDataServer })
        });
      }
    });
  }

  private calcularTotalProduto() {
    let total = 0;

    this.cartDataServer.data.forEach(p => {
      const { quantidadeEmCarrinho } = p;
      const { price } = p.produto

      total += quantidadeEmCarrinho * price

    });
    this.cartDataServer.total = total;
    this.totalCarrinho.next(this.cartDataServer.total)
  }
}
