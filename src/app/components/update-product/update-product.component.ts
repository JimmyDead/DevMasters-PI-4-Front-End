import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CrudProductService } from './../../services/crud-product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Produtos } from './../../model/produtos-data.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit, AfterViewInit {

  id

  product: Produtos = {
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    images: '',
    quantity: 0
  }

  SERVICE_IMAGE

  images: string[]

  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileList = []

  constructor(private router: Router, private route: ActivatedRoute,
    private crudProductService: CrudProductService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.SERVICE_IMAGE = environment.serviceImage + '/download?file='
    this.id = this.route.snapshot.paramMap.get('id')
    this.crudProductService.readProduct(this.id).subscribe(product => {
      this.product = product;
      this.images = this.product.images.split(";")
    });
  }

  ngAfterViewInit(): void {
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

  updateProduct() {
    this.getFilesName()
    this.crudProductService.updateProduct(this.product).subscribe(() => {
      this.toast.success('Produduto Atualizado com sucesso', 'Produto Atualizado', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      })
      this.uploadFiles()
      this.router.navigate(['/view-crud'])
    })
  }

  cancel() {
    this.router.navigate(['/read-product'])
  }
}
