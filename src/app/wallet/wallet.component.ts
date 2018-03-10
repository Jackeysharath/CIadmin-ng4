import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
	public _api:ApiService;
	isTokenSet:boolean=false;
	user:any=[];
	wallet:any=[];
	wa:any=[];
	addW:boolean=false;
	tmp:boolean=false;
	updatedWI:any=[];
	walletHistory:any=[];
  constructor(_api :ApiService) {
  	this._api=_api;
   }

  ngOnInit() {
  	this.tokenCheck();
  	this.GetWallet();
  	this.GetWalletHistory();
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

   GetWallet(){
   	console.log(this.user.uid);
   	this._api.POST('GetWallet', {'TokenNo': 'SomeTokenHere','userid':this.user.uid}).subscribe(data =>{
        this.wallet=JSON.parse(data.json).data;
        if(this.wallet==undefined){

        }else{
         console.log('wd',this.wa.wallet);
        this.wa = this.wallet[0];
        }
        
        });
   }

   AW(){
   	this.addW=true;
   	this.tmp=false;
   }

   hm2(){
   	this.addW=false;
		this.tmp=true;
   }

    GetWalletHistory(){

	   	this._api.POST('GetWalletHistory', {'TokenNo': 'SomeTokenHere','userid':this.user.uid}).subscribe(data =>{
	        this.walletHistory=JSON.parse(data.json).data;
          if(this.walletHistory == undefined){
            this.walletHistory=[]; 
          }else{
            console.log('history', this.walletHistory);
          }
	        
	        });
	   }


   addAmount(form:any){
		console.log('wform==',form);
		let data={
			"TokenNo":'SomeTokenHere',
			"userid":form.userid,
      "type":1,
			"amount":form.amount
		};
	console.log(data);
   	 	this._api.POST('UpdateWallet', data).subscribe(data =>{
        this.updatedWI = JSON.parse(data.json).data;
        console.log(this.updatedWI[0].message);
        this.tmp=true;
        this.GetWallet();
        });
   }

}
