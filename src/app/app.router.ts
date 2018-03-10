import {ModuleWithProviders} from '@angular/core';
import{Routes,RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {BookComponent} from './book/book.component';
import {ContactusComponent} from './contactus/contactus.component';
import {TestDetailsComponent} from './test-details/test-details.component';
import {CartComponent} from './cart/cart.component';
import {SlotsComponent} from './slots/slots.component';
import {LoginComponent} from './login/login.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {AccountComponent} from './account/account.component';
import {PaymentComponent} from './payment/payment.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OurFacilitiesComponent } from './our-facilities/our-facilities.component';
import { OurNetworkComponent } from './our-network/our-network.component';
import { OurPackagesComponent } from './our-packages/our-packages.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { WalletComponent } from './wallet/wallet.component';
import { NotFoundComponent } from './not-found/not-found.component';

//import {CookieService} from 'angular2-cookie/core';

export const router:Routes=[
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component : HomeComponent},
    {path:'book',component : BookComponent},
    {path:'contactus',component : ContactusComponent},
    {path:'network',component : OurNetworkComponent},
    {path:'packages',component : OurPackagesComponent},
    {path:'cart',component : CartComponent},
    {path:'login',component : LoginComponent},
    {path:'slots',component : SlotsComponent},
    {path:'payment',component : PaymentComponent},
    {path:'invoice',component : InvoiceComponent},
    {path:'account',component : AccountComponent},
    {path:'our-facilities',component : OurFacilitiesComponent},
    {path:'order-history',component : OrderHistoryComponent},
    {path:'book/test-details/:id',component : TestDetailsComponent},
    {path:'book/wishlist',component : WishlistComponent},
    {path:'wallet',component : WalletComponent},
    //these should be in the last of the routes
    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '/404'}

];
export const routes: ModuleWithProviders=RouterModule.forRoot(router,{ enableTracing: false });