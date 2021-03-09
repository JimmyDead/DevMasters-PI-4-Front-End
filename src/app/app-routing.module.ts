import { ViewCrudComponent } from './components/view-crud/view-crud.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { ReadProductComponent } from './components/read-product/read-product.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'thankyou', component: ThankyouComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'create-product', component: CreateProductComponent
  },
  {
    path: 'read-product', component: ReadProductComponent
  },
  {
    path: "product/update/:id", component: UpdateProductComponent
  },
  {
    path: "view-crud", component: ViewCrudComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
