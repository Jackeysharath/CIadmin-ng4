import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import { AccountComponent } from '../account/account.component';
import {Router} from '@angular/router';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers:[AccountComponent]
})
export class InvoiceComponent implements OnInit {
  pdf:any=[];
  nearestLabLocation:any;
  public _api:ApiService;
  orderno:string;
  tmp:any=[];
  temp:any=[];
  toArray:any=[];
  order_data:any=[];
  user:any=[];
  userInfo:any=[];
  public accountComponent:any;
  orderDetails:any=[];
  orderInfo:any=[];
  orderInfo1:any=[];
  testInstrs:any=[];
  ti:boolean=false;
  pdf1:string;
  res:any=[];
  constructor(_api :ApiService, private router :Router,accountComponent:AccountComponent) {
    this._api=_api;
    this.accountComponent =accountComponent;
    this.getOrderInvoice();
    this.getOrderDetails();
    this.user = JSON.parse(localStorage.getItem('user'));

   }

  ngOnInit() {
    this.getNearestLab();
    this.getInvoice();
  }
  getInvoice(){

  }
  getNearestLab(){
    if(localStorage.getItem('nearestLabLocation')===null){
      this.nearestLabLocation="";
    }else{
      this.nearestLabLocation=JSON.parse(localStorage.getItem('nearestLabLocation'));
    }
  }

  getOrderInvoice(){

   if(sessionStorage.getItem('invoice')){
        let orderInfo = JSON.parse(sessionStorage.getItem('invoice'));
        console.log("my",orderInfo);
       console.log('ses',orderInfo[0].order_nos);
         if(orderInfo[0].order_nos.indexOf(',') > -1) {
            let ord_nos  = orderInfo[0].order_nos.split(',');
            this.order_data=[];
              for (let ord_no of ord_nos) {
                //  console.log('loop',ord_no); // 1, "string", false
                  this.pdf=[];
                      this._api.POST('GetOrderInvoice', {TokenNo: 'SomeTokenHere',orderno: ord_no}).subscribe(data =>{
                      this.tmp=JSON.parse(data.json).data;
                      this.pdf={'message':this.tmp[0].message,'ordNo':ord_no}
                      if(this.pdf){
                       this.order_data.push(this.pdf);
                      }
                     });
                     
              }

           }else{
            this.pdf=[];
            //console.log('else',orderInfo[0].order_nos);
              this._api.POST('GetOrderInvoice', {TokenNo: 'SomeTokenHere',orderno: orderInfo[0].order_nos}).subscribe(data =>{
                this.tmp=JSON.parse(data.json).data;
                this.pdf = this.tmp[0].message;
                this.pdf={'message':this.tmp[0].message,'ordNo':orderInfo[0].order_nos}
                if(this.pdf){
                       this.order_data.push(this.pdf);
                      }
                //console.log(this.pdf);
               });
           }
      }
    
  }



  getOrderDetails(){
  this.user = JSON.parse(localStorage.getItem('user'));
   let orderInfo = JSON.parse(sessionStorage.getItem('invoice'));
  
     if(orderInfo[0].order_nos.indexOf(',') > -1) {
            let ord_nos  = orderInfo[0].order_nos.split(',');
            this.orderDetails=[];
              for (let ord_no of ord_nos) {
                  this._api.POST('GetOrderDetails', {TokenNo: 'SomeTokenHere',orderno: ord_no,mobileno:''}).subscribe(data =>{
                     this.orderDetails=JSON.parse(data.json).data;

                      if(this.orderDetails.length>0){
                        let ords:any=[];
                        this.orderDetails.forEach(element => {
                                  element.order_date= this.getHumanDate(element.order_date);
                                  ords.push(element);
                                   //this.orderInfo.push(element);//org
                                });
                        this.orderInfo.push(ords);

                     }else{}

                   });
                   //console.log(this.orderInfo);
               }

           }else{
            let invpdf:any;
              this._api.POST('GetOrderDetails', {TokenNo: 'SomeTokenHere',orderno: orderInfo[0].order_nos,mobileno:''}).subscribe(data =>{
              this.orderInfo1=JSON.parse(data.json).data;
              console.log(this.orderInfo1);
                  this.orderInfo1.forEach(element => {
                    element.order_date= this.getHumanDate(element.order_date);
                            }); 

                  //invpdf = this.getOrderInvoice1(orderInfo[0].order_nos);
            
                 /*  let valueArr = this.orderInfo.map(function(item){ return item.patient_name });
                    let isDuplicate = valueArr.some(function(item, idx){ 
                        return valueArr.indexOf(item) != idx ;
                    });
                    console.log('boolean',isDuplicate);*/

               });

           }
           console.log(this.orderInfo);

  }

   getOrderInvoice1(billNo:string){

      /*     let pdf1:any
          this._api.POST('GetOrderInvoice', {TokenNo: 'SomeTokenHere',orderno: billNo}).subscribe(data =>{
                    this.res =JSON.parse(data.json).data;
                   //console.log('getOrderInvoice=',this.res);
                 pdf1 = this.res[0].message;
                    //console.log('pdf',pdf1);
                    return pdf1;               
                     });
      */
       }


  getHumanDate(date:any){
    date=date.replace("/Date(","");
    date=date.replace(")/","");
    date=date.split("+");
    let hr=date[1].substring(0,2)*60*1000;
    let min=date[1].substring(2,4)*60*1000;
    let fdt=parseInt(date[0])+hr+min;
    let theDate = new Date(fdt);
    let dateString = theDate.toUTCString();
    let date1 = (theDate.getMonth()+1).toString()+'/'+theDate.getDate().toString()+'/'+theDate.getFullYear().toString();
    //return date1;
    return dateString;
    //console.log(date1);
  }

  getTestInstructions(tid:any){
  
     this._api.POST('GetOrderInstructions', {TokenNo: 'SomeTokenHere',serviceid:tid}).subscribe(data =>{
                   this.testInstrs=JSON.parse(data.json).data;
                  console.log('test Instrutions=',this.testInstrs);
                 // this.ti=true;
                  
                 });
  }

  testInst(){
    this.ti=false;
  }

}
