import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {routes} from './app.router';
import { AppComponent } from './app.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { BookComponent } from './book/book.component';
import { HttpModule } from '@angular/http';
import { TestDetailsComponent } from './test-details/test-details.component';
import { ApiService } from './common/api.service';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { SlotsComponent } from './slots/slots.component';
import { PaymentComponent } from './payment/payment.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { NgForm,FormsModule } from '@angular/forms';
import { EqualValidator } from './login/password.match.directive';
import { AccountComponent } from './account/account.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import {CookieService} from 'angular2-cookie/core';

//ng2-idle
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { MomentModule } from 'angular2-moment';

import { OwlModule } from 'ng2-owl-carousel';
import { OurFacilitiesComponent } from './our-facilities/our-facilities.component';
import { OurNetworkComponent } from './our-network/our-network.component';
import { OurPackagesComponent } from './our-packages/our-packages.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { WalletComponent } from './wallet/wallet.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactusComponent,
    HomeComponent,
    BookComponent,
    TestDetailsComponent,
    CartComponent,
    LoginComponent,
    SlotsComponent,
    PaymentComponent,
    InvoiceComponent,
    EqualValidator,
    AccountComponent,
    WishlistComponent,
    OurFacilitiesComponent,
    OurNetworkComponent,
    OurPackagesComponent,
    OrderHistoryComponent,
    WalletComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    routes,
    HttpModule,
    FormsModule,
    MomentModule,
    OwlModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [HomeComponent,ApiService,AppComponent,LoginComponent,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
