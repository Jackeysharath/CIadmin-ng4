import { Component, OnInit,ViewChild } from '@angular/core';
import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-our-packages',
  templateUrl: './our-packages.component.html',
  styleUrls: ['./our-packages.component.css'],
  providers:[BookComponent],
  //directives:[BookComponent]
})
export class OurPackagesComponent implements OnInit {

  //@ViewChild(myChildComponent)
  //private myChild: BookComponent;

  public _api:ApiService;
  public bookComponent:any;
  public _packages=[];
  _packageServices:any=[];
  testsList:any=[];
  packageServicesList:any=[];
  msg:string=null;
  constructor(private router :Router, _api :ApiService, bc:BookComponent) {
    this._api=_api;
    this.bookComponent=bc;
    this.getPackages();

   }

  ngOnInit() {

  }
  
   searchBasedOnString(str:any){
    this.router.navigate(['./book', {searchString:str}]);
  }
  contactusSubmit(data:any){
    data.purpose="2";
    this._api.POST('ContactUs', data).subscribe(data =>{ 
      let responce=JSON.parse(data.json).data;
      this.msg=responce[0].message;
 
      });
  }
  getPackages(){
   
    this._api.POST('GetPackages',{"pincode":"","package_name":"","package_code":"","sort_by":"","sort_order":"","alphaSearch":""}).subscribe(data =>{
      if(data.status==1){
        this._packages=JSON.parse(data.json).data;
        //this.testsList=[];
      }else{
        this._packages=[];
      }
      //console.log('packages',this._packages);
              if(this._packages.length > 0){
              this.getPackagesDetails();
              }
         //console.log(this._packages);
     });
   
  }
  getPackagesDetails(){
    
       this._packages.forEach(element => {
        
              this.getTests(element);
        }); 
    
      
         console.log(this.packageServicesList);
  }

  getTests(element){
 //this.packageServicesList=[];

        this._api.POST('GetPackageServices',{"Pckage_id":element.id}).subscribe(data =>{
            if(data.status==1){
              let _packageServices=JSON.parse(data.json).data;
              this.packageServicesList[element.id]=[];
              this.packageServicesList[element.id] = _packageServices;
             
            }else{
              this._packageServices=[];
            }

            

           });
  }

  addPackageCart(pckg:any){
    this.bookComponent.getAddPackageCart(pckg);
   /*this.router.navigate(['./book', {searchString:str}]);*/
  }



}
