import { Produtos } from './../../model/produtos-data.model';
import { CartService } from './../../services/cart.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {

  constructor(private cartService: CartService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) { }

  produto: Produtos
  index: any

  ngOnInit(): void {
    this.produto = this.data.produto
    this.index = this.data.index
  }

  deleteProduto() {
    this.cartService.deleteProdutoCarrinho(this.index)
    this.cancel()
  }

  cancel(): void {
    this.dialog.closeAll()
  }


}
