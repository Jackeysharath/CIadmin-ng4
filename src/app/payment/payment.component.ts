import { Component, OnInit,ElementRef,ViewChild,AfterViewInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
 
  isTokenSet: any;
  user:any;
  invoice:any;
  order_id:any;
  customer_id:any;
  industry_type_id:any;
  channel_id:any;
  txn_amount:any;
  @ViewChild('payform') payform: ElementRef;
  constructor(private router:Router) { 
    this.tokenCheck();
    this.testCheck();
    // this.demoSuccess();
    
  }
  ngAfterViewInit(){
   
    this.sub();
  }

  ngOnInit() {
  }
  tokenCheck(){
    if(localStorage.getItem('token')===null){
      this.isTokenSet=false;
    }else{
      this.isTokenSet=true;
      if(JSON.parse(localStorage.getItem('user'))){
        this.user=JSON.parse(localStorage.getItem('user'));
      }
      
  
  
    }
  }
  sub(){
    this.payform.nativeElement.submit();
  }
  testCheck(){
      if(this.isTokenSet){
        this.invoice= JSON.parse(localStorage.getItem('invoice'))[0];
        this.txn_amount=JSON.parse(localStorage.getItem('tempTotal'));
    //  console.log(this.txn_amount);
        
  //bring all test details name,location,slot time and date
  //payment gateway redirection here
      }
      
  }
  demoSuccess(){
    this.router.navigate(['./invoice']); 
    
  }

}
