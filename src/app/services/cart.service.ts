import { DeleteProductComponent } from './../components/delete-product/delete-product.component';
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

  //metodo para adicionar um produto ao carrinho
  addingProductInCart(id: number, quantidade?: number) {
    this.productService.getProduct(id).subscribe(produto => {

      //caso o carrinho esteja vazio sem nenhum produto
      if (this.cartDataServer.data[0].produto === undefined) {
        this.cartDataServer.data[0].produto = produto;
        this.cartDataServer.data[0].quantidadeEmCarrinho = quantidade !== undefined
          ? quantidade : 1;

        this.calcularTotalProduto()

        this.cartDataClient.produtoData[0].noCarrinho =
          this.cartDataServer.data[0].quantidadeEmCarrinho;
        this.cartDataClient.produtoData[0].id = produto.id;
        this.cartDataClient.total = this.cartDataServer.total;

        localStorage.setItem('cart', JSON.stringify(this.cartDataClient))//salvando produto no storage
        this.dataCarrinho.next({ ...this.cartDataServer })

        //TODO display de notificação
        this.toast.success(`${produto.title} adicionado ao carrinho`, 'Produto Adicionado', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })

      } else {
        //caso o produto já exista no carrinho, então adicionamos mais

        let index = this.cartDataServer.data.findIndex(p => p.produto.id === produto.id) //retorna -1 ou um numero positivo

        if (index !== -1) {
          if (quantidade !== undefined && quantidade <= produto.quantity) {
            this.cartDataServer.data[index].quantidadeEmCarrinho =
              this.cartDataServer.data[index].quantidadeEmCarrinho < produto.quantity
                ? quantidade : produto.quantity
          } else {
            this.cartDataServer.data[index].quantidadeEmCarrinho < produto.quantity
              ? this.cartDataServer.data[index].quantidadeEmCarrinho++ : produto.quantity
          }

          this.cartDataClient.produtoData[index].noCarrinho =
            this.cartDataServer.data[index].quantidadeEmCarrinho

          this.calcularTotalProduto()
          this.cartDataClient.total = this.cartDataServer.total
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          this.toast.info(`${produto.title} quantidade atualizada no carrinho`, 'Produto Atualizado', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })

        } else {

          // Caso o carrinho não esteja vazio mas não tenha aquele produto

          this.cartDataServer.data.push({
            quantidadeEmCarrinho: 1,
            produto: produto
          })

          this.cartDataClient.produtoData.push({
            noCarrinho: 1,
            id: produto.id
          })

          //localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          this.toast.success(`${produto.title} adicionado ao carrinho`, 'Produto Adicionado', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })


          this.calcularTotalProduto()
          this.cartDataClient.total = this.cartDataServer.total
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          this.dataCarrinho.next({ ...this.cartDataServer })

        }
      }
    })
  }

  //metodo para atualizar a quantidade de um produto
  updatingCarrinhoItems(index: number, incremento: boolean) {

    let data = this.cartDataServer.data[index];
    if (incremento) { //aumentando a quantidade de um mesmo produto
      data.quantidadeEmCarrinho < data.produto.quantity ? data.quantidadeEmCarrinho++ : data.produto.quantity;
      this.cartDataClient.produtoData[index].noCarrinho = data.quantidadeEmCarrinho;
      this.calcularTotalProduto();
      this.cartDataClient.total = this.cartDataServer.total;
      this.dataCarrinho.next({ ...this.cartDataServer });
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // diminuindo a quantidade de um mesmo produto e quando o produto estiver em 1 e o 
      // usuario decrementar mais uma vez vai perguntar se deseja excluir o produto
      let fim = false
      if (data.quantidadeEmCarrinho - 1 !== 0) {
        data.quantidadeEmCarrinho--;
        fim = false
      } else {
        fim = true
      }
      this.calcularTotalProduto();
      if (data.quantidadeEmCarrinho - 1 === 0 && fim) {
        this.openDialogDeleteProduct(index, data.produto)
        this.dataCarrinho.next({ ...this.cartDataServer });
      } else {
        this.dataCarrinho.next({ ...this.cartDataServer });
        this.cartDataClient.produtoData[index].noCarrinho = data.quantidadeEmCarrinho;
        this.calcularTotalProduto();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

    }

  }

  //metodo para deletar um produto do carrinho, vai ser chamado atraves da caixa de dialogo de deletar produto
  async deleteProdutoCarrinho(index) {
    //removendo o index do produto do array 
    this.cartDataServer.data.splice(index, 1);
    this.cartDataClient.produtoData.splice(index, 1);

    this.calcularTotalProduto();
    this.cartDataClient.total = this.cartDataServer.total;

    //atualizando no storage
    if (this.cartDataClient.total === 0) {
      this.cartDataClient = { produtoData: [{ noCarrinho: 0, id: 0 }], total: 0 };
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    }

    //caso nao exista mais nenhum produto
    if (this.cartDataServer.total === 0) {
      this.cartDataServer = {
        data: [{
          produto: undefined,
          quantidadeEmCarrinho: 0
        }],
        total: 0
      };
      this.dataCarrinho.next({ ...this.cartDataServer });
    } else {
      this.dataCarrinho.next({ ...this.cartDataServer });
    }

  }

  //vai abrir uma janela de dialogo perguntando se deseja excluir o produto
  openDialogDeleteProduct(index, produto) {
    this.dialog.open(DeleteProductComponent, {
      data: {
        produto: produto,
        index: index
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

  //metodo usado na pagina do arrinho para calcular o subtotal da compra
  private calcularSubTotal(index): number {
    let subTotal = 0;
    const p = this.cartDataServer.data[index]
    subTotal = p.produto.price * p.quantidadeEmCarrinho
    return subTotal
  }
}
