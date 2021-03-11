import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CrudProductService } from './../../services/crud-product.service';
import { Produtos } from './../../model/produtos-data.model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  @Input() fileContent: any;

  product: Produtos = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    images: '',
    quantity: 0
  }

  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileList = []

  fileInfos: Observable<any>;

  constructor(private crudProductService: CrudProductService, private toast: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  insertProduct() {
    this.getFilesName()
    this.crudProductService.createProduct(this.product).subscribe(() => {
      this.toast.success('Produduto Cadastrado com sucesso', 'Cadastro Efetuado', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
      this.uploadFiles()
      this.router.navigate(['/view-crud'])
    })
  }


  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.fileList[i] = this.selectedFiles[i].name
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.crudProductService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          //this.fileInfos = this.crudProductService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }

  uploadFiles() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.selectedFiles.length >= 1) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  getFilesName() {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.selectedFiles.length > 1) {
        if (i < this.selectedFiles.length - 1) {
          this.product.images = this.product.images + this.selectedFiles[i].name + ";"
        } else {
          this.product.images = this.product.images + this.selectedFiles[i].name
        }
      } else {
        this.product.images = this.selectedFiles[0].name
      }
    }
  }

  changeMainImage(index) {
    this.product.image = this.selectedFiles[index].name
  }

  cancel() {
    this.router.navigate(['/view-crud'])
  }

}
