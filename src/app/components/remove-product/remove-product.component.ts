import { ToastrService } from 'ngx-toastr';
import { Produtos } from './../../model/produtos-data.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CrudProductService } from './../../services/crud-product.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-remove-product',
  templateUrl: './remove-product.component.html',
  styleUrls: ['./remove-product.component.css']
})
export class RemoveProductComponent implements OnInit {

  produto: Produtos

  constructor(private crudProductService: CrudProductService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
     private toast: ToastrService) { }

  ngOnInit(): void {
    this.produto = this.data.produto
  }

  deleteProduto() {
    this.crudProductService.deleteProduct(this.produto.id).subscribe(() => {
      this.toast.success('Produduto Excluido com sucesso', 'Produto Excluido', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
      this.cancel()
      window.location.reload();
    })
  }

  cancel(): void {
    this.dialog.closeAll()
  }

}
