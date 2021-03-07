import { ToastrService } from 'ngx-toastr';
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
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private toast: ToastrService) { }

  produto: Produtos
  index: any

  ngOnInit(): void {
    this.produto = this.data.produto
    this.index = this.data.index
  }

  deleteProduto() {
    this.cartService.deleteProdutoCarrinho(this.index).then(() => {
      this.toast.success('Produduto removido com sucesso', 'Produto Removido', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
    })
    this.cancel()
  }

  cancel(): void {
    this.dialog.closeAll()
  }


}
