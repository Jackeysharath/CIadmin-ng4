import { Component, OnInit } from '@angular/core';
import { Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import {ApiService} from '../common/api.service';
import {ActivatedRoute,Router} from '@angular/router';

import { NgForm } from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
declare var swal: any;
const newLocal: string = 'USERNAME';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public _api:ApiService;
  public uid:number;
  public user_name:any;
  private token:any;
  public result:any;
  ivup:boolean=false;
  tmp:boolean=true;
  fp:boolean=false;
  votp:boolean=false;
  msg:string;
  msg1:string;
  cp:boolean=false;
  user:any=[];
 
  //private cookieWithUsername:any;
  //private cookieWithPassword:any;
  //private rememberMe:any;
  constructor(_api :ApiService,private router:Router,private rou:ActivatedRoute) {
    this._api=_api;
    this.tokenCheck();
    this.router=router;
    this.rou = rou;
 
    //get cookies
    /*this.cookieWithUsername = this._cookieService.get(newLocal);
    this.cookieWithPassword = this._cookieService.get('PASSWORD');
    this.rememberMe = this._cookieService.get('RM');*/

    //remove cookies
    /*this._cookieService.remove(newLocal);
    this._cookieService.remove('PASSWORD');
    this._cookieService.remove('RM');*/
   //swal("hello");

   }

  ngOnInit() {
    let params: any = this.rou.snapshot.params;
    //console.log("myurl=",params.msg);
    this.msg1 =params.msg;
  }
  
  loginSubmit(form: any){
//console.log(form);
  let data={
        "login_username":form.email,
        "password":form.password1
      };

    /*  if(rm==true){
       var date = new Date();
       var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
       //Cookies.set('visits', number, { expires: midnight });

        this._cookieService.put(newLocal, username, {expires:midnight});

        this._cookieService.put('PASSWORD', password, {expires:midnight});

        this._cookieService.put('RM', "true", {expires:midnight});

      }else{
        this._cookieService.removeAll();
      }*/

    this._api.POST('GetLoginUser',data).subscribe(data =>{
      let res=JSON.parse(data.json).data;
            if(res==undefined){
                this.ivup=true;
                console.log("Invalid authentication");
               //this.revert(form);
              }else{
             // console.log(res);
              this.user_name=res[0].user_name;
              if(this.user_name!=null){
               // console.log(this.token+" logged in successfully");
                localStorage.setItem('token',res[0].user_cd);
                localStorage.setItem('user',JSON.stringify(res[0]));
                //get temp cart data
                this.getCartData();
                if(!isNaN(this.user_name)){
                  this.router.navigate(['./account']);
                }
                if(JSON.parse(localStorage.getItem('tests'))=== null){
                  this.router.navigate(['./book']);
                }else{
                 let tests= JSON.parse(localStorage.getItem('tests'));
                 let sel_members=[];
                 let sel_locations=[];
                 let user=res[0];
                 if(tests.length > 0){
                  tests.forEach(element => {
                    
                    if(sel_members[element.tid]==undefined||sel_members[element.tid]==[]){
                      sel_members[element.tid]=user;
                    }
                    if(sel_locations[element.tid]==undefined){
                      sel_locations[element.tid]=user.user_address;
                     // this.sel_locations[element.tid]="Plot #119,Road No 10,Jubliee Hills";
                    }
                 
                }); 
                   localStorage.setItem('sel_members',JSON.stringify(sel_members));
                   localStorage.setItem('sel_locations',JSON.stringify(sel_locations));
                 }
                 
                  this.router.navigate(['./cart']);
                }
                
                console.log("logged in successfully");
              }else{
                this.ivup=true;
                ///this.revert(form);
                console.log("invalid authentication");
                 
              }
              this.uid=res[0].uid;
              }
     });
     
  }

  revert(form:any){
     form.reset();
  }

 save(form: NgForm,isValid: boolean) {

 //console.log(isValid);
  let data = {
        "TokenNo":'SomeTokenHere',
        "Mobile":form.value.Mobile,
        "password":form.value.password
           }

    //console.log(data);
    if(isValid){

      this._api.POST('AccountCreation', data).subscribe(data =>{

        this.result=(JSON.parse(data.json).data);

        //this.result = reslt[0].id;
          if(this.result== undefined){
            this.msg = "Mobile number already exists";
            swal("Mobile number already exists");
            form.resetForm();
           //window.location.reload();
           
          }else{
            this.result=(JSON.parse(data.json).data);
              if(this.result[0].id!=null){ 
                //this.msg = "Account created successfully";
                //window.alert("Account created");
                 swal("Account created!");
                 form.resetForm();
                //window.location.reload();
              }else{
               window.alert("failed to create an account");
                form.resetForm();
              }
          }
      
       });   

    }else{

    }

     
  }

  tokenCheck(){
    if (localStorage.getItem("token") === null) {
      this.token=null;
    }else{
      this.token=localStorage.getItem("token");
    }
  }

  fp1(){
    this.tmp=false;
    this.fp=true;
  }
  getForgotPassword(form:any){
    this._api.POST('GetForgotPassword', form).subscribe(data =>{
       let response=(JSON.parse(data.json).data);
       //console.log(response[0].mobile);
         if(response[0].mobile!=null){ 
           this.fp=false;
           this.votp=true;
          }else{
           window.alert("failed to send OTP");
          }
          this.uid = response[0].uid;
      
       });
  }

  getOtpVerification(form:any){
    this._api.POST('GetOtpVerification', form).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
     //  console.log(resp[0].uid);
      
         if(resp[0].uid!=null){ 
          this.cp =true;
          this.votp=false;
            //this.router.navigate(['./book']);
          }else{
           window.alert("failed to login");
          }
      
       });
  }

changePassword(form:any){
  
     this._api.POST('ChangePassword',form).subscribe(data =>{
      this.user=JSON.parse(data.json).data;
      console.log("Password changed Successfully");
      window.location.reload();
     }); 
  }

  loggedOut(){
  //console.log('rrr',localStorage.getItem('user'));
    if(localStorage.getItem('user')!==null){
            
              let tlist=[];
              tlist=JSON.parse(localStorage.getItem('tests'));
              if(tlist!==null){
                 if(tlist.length>0){
                  for(let ttest in tlist){
                    this.saveCartData(tlist[ttest].tid);
                  } 
                  localStorage.removeItem('tests');
                }
              }else{
                 this.saveCartClearData();
              }
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.clear();
               
          }
    }
    saveCartClearData(){
      let req_data={
        "TokenNo":"",
        "test_id":"0",
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "loc_id":"1",
        "status":"C",
        "is_wishlist":2
      }
      this._api.POST('AddtoWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
      //console.log(resp);
        });

    }
    saveCartData(tid){
      let req_data={
        "TokenNo":"",
        "test_id":tid,
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "loc_id":"1",
        "status":"A",
        "is_wishlist":2

      }
      this._api.POST('AddtoWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
      //console.log(resp);
        });
    }
    getCartData(){
      let req_data={
        "TokenNo":"",
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "Flag":2

      }
      this._api.POST('GetTestWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
      if(resp.length > 0){
        localStorage.setItem('tests',JSON.stringify(resp));
      }
      
        });

    }

}
