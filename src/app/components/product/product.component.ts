import { Produtos } from './../../model/produtos-data.model';
import { environment } from 'src/environments/environment';
import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';


declare let $: any; //usando jquery

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit, OnInit {

  id: number;
  produto: Produtos = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    images: '',
    quantity: 0
  }

  imagesProdutos: any[] = [];
  SERVER_IMAGE

  @ViewChild('quantity') quantityInput; //pegando elemento como um seletor javascript

  constructor(private productService: ProductService,
    private cartService: CartService, private router: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.SERVER_IMAGE = environment.serviceImage
    this.router.paramMap
      .pipe
      (map((param: ParamMap) => {
        return param.get('id') //estou pegando o parametro id que está sendo passado atraves da url quando clica em um determinado produto
      }))
      .subscribe(produtoId => {
        this.id = +produtoId;
        this.productService.getProduct(this.id).subscribe(prod => { //funcao buscando um produto especifico
          this.produto = prod
          if (prod.images !== null) {
            this.imagesProdutos = prod.images.split(';'); //pegando diversas imagens caso tenho, no caso as path estão separadas por ";" então faço um split e armazeno em um array
          }
        });
      });
  }

  ngAfterViewInit(): void {
    //funcoes pegas do jquery para tratar a visualizacao do produto especifico, mostrando um slide de imagem e zom automatico por exemplo
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: true,
      arrows: false,
      fade: true,
      adaptiveHeight: true,
      ocusOnSelect: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 950,
        settings: {
          vertical: false,
          centerMode: true,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  //funcao para adicionar produto ao carrinho, nesse caso é adicionar estando em sua pagina propria
  adicionarCarrinho(id: number) {
    this.cartService.addingProductInCart(id, this.quantityInput.nativeElement.value) //isso é javascript
  }

  // adiciona mais um produto
  incrementar() {
    let value = parseInt(this.quantityInput.nativeElement.value)

    if (this.produto.quantity >= 1) {
      value++;
      if (value > this.produto.quantity) {
        value = this.produto.quantity;
      }
    } else {
      return
    }

    this.quantityInput.nativeElement.value = value.toString()
  }

  //decrementa a quantidade do produto
  decrementar() {
    let value = parseInt(this.quantityInput.nativeElement.value)

    if (this.produto.quantity >= 0) {
      value--;
      if (value <= 1) {
        value = 1;
      }
    } else {
      return
    }

    this.quantityInput.nativeElement.value = value.toString()
  }

}
