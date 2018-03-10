import { Component, Inject } from '@angular/core';
import {ApiService} from './common/api.service';
import {LoginComponent} from './login/login.component';
import { HttpModule } from '@angular/http';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpModule,LoginComponent],
})
export class AppComponent {
  title = 'app';
  b:any;
  a:any;
  tests=[];
  tot:number=0;
  hvc:number=50;
  colc:number=0;
  isLoggedIn:boolean;
  showhidecart:boolean;
  //showhidepckgcart:boolean;
  private loginComponent;
  //public _api:ApiService;
  user:any=[];
  userInfo:any=[];
  obj:any=[];
  cartCnt:number=0;

  //idle,keepalive
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  postalCode:string;
  packagesCount:number;
  testsCount:number;
  public pckgs=[];
  constructor(private router :Router,LoginComponent:LoginComponent,private _api:ApiService,private idle: Idle, private keepalive: Keepalive) {
   this.setCart();
   this.loginComponent=LoginComponent;
   /*  this._api=_api;
      this._api.PinByGoogle("https://maps.googleapis.com/maps/api/geocode/json?latlng=17.432671,78.417993&key=AIzaSyCegOtEDutwtUyNWcOOLgoPedUYVob_AGk").subscribe(data=>{
        console.log(data);
      });
  */
    this.setFlag();
 /*   console.log(this.tests);
   this.tests.forEach(element => {
            this.tot=this.tot+parseInt(element.test_finalpr); 
          });*/

    //idle,keepalive
    idle.setIdle(10);
    idle.setTimeout(1800);//1800
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

   idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.toLogout();
    });

    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

   this.reset();
   //end keepalive,idle
  
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  OnInIt(){
   // this.a = localStorage.getItem('showCart');
   if(localStorage.getItem('tests')){
    this.b=JSON.parse(localStorage.getItem('tests'));
      if(this.b.length > 0){
        this.tests= this.b;
      }else{
        this.showhidecart=false;
      }

    if(localStorage.getItem('showcart')=="true"){
      this.showhidecart=true;
    }
   }
 
  }
  getPostalCode(){

    let req_url="https://maps.googleapis.com/maps/api/geocode/json?latlng=17.432671,78.417993&key=AIzaSyCegOtEDutwtUyNWcOOLgoPedUYVob_AGk";
   this._api.PinByGoogle(req_url).subscribe(data=>{
    this.postalCode = data[5].address_components[0].long_name;
     // console.log("Postalcode",data[5].address_components[0].long_name);
      localStorage.setItem('postalCode',this.postalCode);
    }); 
  }
  setCart(){ 
      //this.getPostalCode();
      this.postalCode = localStorage.getItem('postalCode');
      //console.log("pc=",this.postalCode);
        this.tests= JSON.parse(localStorage.getItem('tests'));
        this.tot=0;

        if(this.tests===null){
          this.showhidecart=false;
         // return false;
         this.tests=[];
         
        }else{    
          this.tests.forEach(element => {
            this.tot=this.tot+parseInt(element.test_finalpr); 
          });
            this.showhidecart=true;
        }
      
       //packages
        this.pckgs= JSON.parse(localStorage.getItem('packages'));  
        if((this.pckgs===null)){
            this.pckgs=[]; 
                 }else{
          this.pckgs.forEach(element => {
          this.tot=this.tot+parseInt(element.package_finalpr); 
        });
          this.showhidecart=true;
           
         }

         this.cartCnt=this.tests.length+this.pckgs.length;
         this.postcheckOut();
    return false;
  }
   setFlag(){
      if(localStorage.getItem('user')!=null){
        this.user=JSON.parse(localStorage.getItem('user'));
        this.isLoggedIn=true;
      }else{
        this.isLoggedIn=false;
      }
    }
  clearCart(){ 
      localStorage.removeItem('tests');
      localStorage.removeItem('packages');
      this.setCart();
  }
  hideCart(){
      localStorage.setItem('showcart',"false");
      this.showhidecart=false;  
  }
  checkOut(){
      this.hideCart();
      let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
      localStorage.setItem("cartValues",JSON.stringify(a));
   
      //return;
       this.router.navigate(['./cart']); 
  }
  postcheckOut(){
    
    let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
    localStorage.setItem("cartValues",JSON.stringify(a));
  }
  toLogin(){
    this.router.navigate(['./login']);
  }

  toLogout(){
      this.isLoggedIn=false;
      this.loginComponent.loggedOut();
      this.setCart();
      this.router.navigate(['./home']);
  }

  profile(){
    this.router.navigate(['./account']);
    /*this.tmp=true;
    this.user = localStorage.getItem("user");
    this.obj = JSON.parse(this.user);

     this._api.POST('GetProfile',{token: 'SomeTokenHere','user_id':this.obj.uid}).subscribe(data =>{
      this.userInfo=JSON.parse(data.json).data;
        this.user = this.userInfo[0];
        this.user.user_dob=this.getHumanDate(this.user.user_dob);
        console.log(this.user.user_dob);
     });*/
    
  }

  getHumanDate(dt:any){
    dt=dt.replace("/Date(","");
    dt=dt.replace(")/","");
    dt=dt.split("+");
    let hr=dt[1].substring(0,2)*60*1000;
    let min=dt[1].substring(2,4)*60*1000;
    let fdt=parseInt(dt[0])+hr+min;
    let theDate = new Date(fdt);
    let dateString = theDate.toUTCString();
    let date1 = (theDate.getMonth()+1).toString()+'/'+theDate.getDate().toString()+'/'+theDate.getFullYear().toString();
    return date1;
  }

 /* deleteCartItem(uid:number,tid:number){
    this.tests= JSON.parse(localStorage.getItem('tests'));
     //console.log(this.tests);
      this.tests.forEach( (item, index) => {
       if(item.tid === tid) this.tests.splice(index,1);
       
     });
      this.pckgs= JSON.parse(localStorage.getItem('packages'));
     //console.log(this.tests);
      this.pckgs.forEach( (item, index) => {
        if(item.id === tid) this.pckgs.splice(index,1);
     });

     //this.hideCart();
     localStorage.setItem("tests", JSON.stringify(this.tests));
     //console.log(JSON.parse(localStorage.getItem('tests')));
     localStorage.setItem("packages", JSON.stringify(this.pckgs));
     
   }*/


deleteCartItem(uid:number,tid:number){

    this.tests= JSON.parse(localStorage.getItem('tests'));
      if(this.tests!=null){
              this.tests.forEach( (item, index) => {
              //console.log(this.sel_members[item.tid]['uid']);
                  if(item.tid === tid) this.tests.splice(index,1);
             });

       }

      this.pckgs= JSON.parse(localStorage.getItem('packages'));
           if(this.pckgs!=null){
            this.pckgs.forEach( (item, index) => {
              if(item.id === tid) this.pckgs.splice(index,1);
           });
      }

      localStorage.setItem("tests", JSON.stringify(this.tests));
      localStorage.setItem("packages", JSON.stringify(this.pckgs));
      // console.log(this.tests);
       this.tests = JSON.parse(localStorage.getItem('tests'));
       this.pckgs = JSON.parse(localStorage.getItem('packages'));
       this.tot=0;
      /* if(this.tests!==null){
         this.tests.forEach(element => {
                this.tot=this.tot+parseInt(element.test_finalpr); 
              });
         this.testsCount=this.tests.length;

       }else{
        this.testsCount=0;
       }*/
            if(this.tests){
                this.tests.forEach(element => {
                    this.tot=this.tot+parseInt(element.test_finalpr); 
                });
                this.testsCount=this.tests.length;
                
            }else{
                 this.testsCount=0;
            }
        

       /* if(this.pckgs!==null){
           this.pckgs.forEach(element => {
                this.tot=this.tot+parseInt(element.package_finalpr); 
              });
           this.packagesCount = this.pckgs.length;
          }else{
            this.packagesCount=0;
          }
          this.cartCnt=this.testsCount+this.packagesCount;*/ 
        
              if(this.pckgs){
                this.pckgs.forEach(element => {
                    this.tot=this.tot+parseInt(element.package_finalpr); 
                });
                 this.packagesCount = this.pckgs.length;
                
            }else{
                this.packagesCount=0;
            }

          // this.cartCnt=this.tests.length+this.pckgs.length;
          this.cartCnt=this.testsCount+this.packagesCount;
  
   }



}
