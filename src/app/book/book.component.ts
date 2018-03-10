import { Component, OnInit,Injectable } from '@angular/core';
import {ApiService} from '../common/api.service';
import {HomeComponent} from '../home/home.component';
import {AppComponent} from '../app.component';
// import {TestDetailsComponent} from '../test-details/test-details.component';
// import {Repeater} from './app/repeater';
import {ActivatedRoute,Router} from '@angular/router'

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers:[HomeComponent]
})
@Injectable()
export class BookComponent implements OnInit {
 public nearestLabLocation:any;
 public testConditions:any;
 public testsList:any;
 public testDetails:any;
 public testSpecialityList:any;
 public _api:ApiService;
 public test_id:any;
 public _homeComponent:any;
 public _appComponent:any;
 public _testDetailsComponent:any;
 public _tempTest=[];
 public temp2=[];
 public _packages=[];
 public _packageServices=[];
 packageServiceListSw:boolean=false;

 public _pckg:any=[];
 public tmp:any=[];
 //for search functionality
 private condition_id:any;
 private speciality_id:any;
 private category_id:any;
 private searchString:string;
 private sortBy:any; //1-name,2-price,3-popularity 
 private test_type:any; //1-filter,2-package
 private pincode:number=0;
 private sort_order:any=1; //1-ASC,2-DESC,Default Asending 
 private AlphaSearch="";
 //temp 
 public tempstr:string;
 selpackagename:any;

visible:boolean=false;
status:string;
user:any = [];
wishList:any=[];
loc_id:number;
is_wishlist:number=0;
color:string;
wl:any=[];
public temp3=[];
msg:string;
wList:boolean=false;
style:string;
packages:any=[];
tests:any=[];
postalCode:any;
testIds:any=[];
alphap:any=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  constructor(_api :ApiService,_homeComponent :HomeComponent,_appComponent :AppComponent,private router :Router,private rou:ActivatedRoute) { 
    this._api=_api;
    this._homeComponent=_homeComponent;
    this._appComponent=_appComponent;
    this._appComponent.setFlag();
    //console.log(this.testsList);
    this.user.uid="";
  }
  ngOnInit() {
      this.tests = JSON.parse(localStorage.getItem('tests'));

      this.packages = JSON.parse(localStorage.getItem('packages'));
      this.testIds = [];
      if(this.tests!=null){
             this.tests.forEach(element => {
              this.testIds.push(element.tid);
          });
      }
      if(this.packages!=null){
              this.packages.forEach(element => {
              this.testIds.push(element.id);
          });
      }
      this.postalCode = localStorage.getItem('postalCode');
      //this.postalCode =500033;
        let data = {
          'tests': this.testIds,
          'postalCode': this.postalCode
        }
    this.nearestLabLocation={ name:"Loading...",address:"Loading..."}
    //  this._api.POST('getLabLocation.php', {token: 'SomeTokenHere',coordinates:  this._homeComponent.getCordinates()}).subscribe(data =>{
    //   this.nearestLabLocation=JSON.parse(data.json).data;
    //   localStorage.setItem('nearestLabLocation',JSON.stringify(this.nearestLabLocation));
    //  });
    /*  this._api.POST('getLabLocation.php', {token: 'SomeTokenHere',data:data}).subscribe(data =>{
       this.nearestLabLocation=JSON.parse(data.json).data;
       localStorage.setItem('nearestLabLocation',JSON.stringify(this.nearestLabLocation));
      });*/
      this.rou.params.subscribe(params => this.searchString=params.searchString);
      this.tempstr=this.searchString;
      this._api.POST('GetTestCondition', {TokenNo: 'SomeTokenHere'}).subscribe(data =>{
        console.log(data);
       this.testConditions=JSON.parse(data.json).data;
      });
      this._api.POST('GetTestSpecality', {TokenNo: 'SomeTokenHere'}).subscribe(data =>{
        this.testSpecialityList=JSON.parse(data.json).data;
        //console.log(this.testSpecialityList);
       });
      // this._api.POST('GetServices', {pincode: '',test_name:'',test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:''}).subscribe(data =>{
      //   this.testsList=JSON.parse(data.json).data;
      //  });
      this.masterSearch();
      if(localStorage.getItem('user')!=null)this.wList =true;
     
  }
  getTestDetails(id:number){
    this.router.navigate(['./book/test-details/'+id]);
    // this.router.navigate(['./book/test-details', {testId:id}]);
  }

  getTestId(){
    return this.test_id;
  }
  myIndexOf(o) {
   
        for (var i = 0; i < this._tempTest.length; i++) {
          let a=this._tempTest[i];
          let b=o;
         
            if (a.tid===b.tid) {

                return i;
            }
        }
        return -1;
    }

    IndexOf(p){
        for (var i = 0; i < this._pckg.length; i++) {
          let a=JSON.stringify(this._pckg[i]);
          let b=JSON.stringify(p);
            if (a===b) {
                return i;
            }
        }
        return -1;
    }

  getAddTestCart(test:any){
  this._tempTest=[]; 
  this.temp2=[]; 
let testshere = JSON.parse(localStorage.getItem('tests')); 

  
     if(testshere){
          
      this.temp2=JSON.parse(localStorage.getItem('tests'));
      this.temp2.forEach(element => {
          this._tempTest.push(element);  
      });
     if(this.myIndexOf(test) < 0){
      test.quant=1;
      this._tempTest.push(test);
     }else{
      let i=this.myIndexOf(test);
      let t=this._tempTest[i].quant;
      t=t+1;
      this._tempTest[i].quant=t;
     }
      }else{
        test.quant=1;
        this._tempTest.push(test);
      }
    localStorage.setItem('tests',JSON.stringify(this._tempTest));
    this._appComponent.setCart();
  }

    getAddPackageCart(pckg:any){
      
    this._pckg=[];
    console.log('pkgs=',(localStorage.getItem('packages')));
    if(localStorage.getItem('packages')===null){
        this._pckg.push(pckg);
        localStorage.setItem('packages',JSON.stringify(this._pckg));
     
    }else{
        
       this.tmp=JSON.parse(localStorage.getItem('packages'));
        this.tmp.forEach(element => {
                  this._pckg.push(element);  
              });
      //console.log('pkgs=',(localStorage.getItem('packages')));
     /* if(this.tmp){

              this.tmp.forEach(element => {
                  this._pckg.push(element);  
              });
              
      }else{
          this._pckg.push(pckg);
      }*/
       
       if(this.IndexOf(pckg) < 0){
        this._pckg.push(pckg);
       }
        localStorage.setItem('packages',JSON.stringify(this._pckg));
    
    }

    localStorage.setItem('showcart',"true");
    this._appComponent.setCart();

  }

  /*getAddPackageCart(pckg:any){
    this._pckg=[];
  console.log('pkgs=',localStorage.getItem('packages'));
    if((localStorage.getItem('packages'))!==null){

      this.tmp=JSON.parse(localStorage.getItem('packages'));

        this.tmp.forEach(element => {
            this._pckg.push(element);  
        });
       if(this.IndexOf(pckg) < 0){
        this._pckg.push(pckg);
       }
        localStorage.setItem('packages',JSON.stringify(this._pckg));
     
    }else{
      this._pckg.push(pckg);
      localStorage.setItem('packages',JSON.stringify(this._pckg));
    }

    this._appComponent.setCart();

  }*/

  hideCart(){ 
    localStorage.setItem('showcart',"false");
    this._appComponent.setCart();
  }
  getNearestLabLocation(){
    return this.nearestLabLocation;
  }
  
  search(event,attrib){
    let sId = event.target.id;
    if(attrib=="cond"){
      this.condition_id=sId;
    }
    if(attrib=="spl"){
      this.speciality_id=sId;
    }
    this.masterSearch();
   }
   masterSearch(){
    this.checkUndefined();
    //console.log("pin=",this.pincode,"search=",this.searchString,"tt",this.test_type,"cond=",this.condition_id,"spc",this.speciality_id,"srtby",this.sortBy,"so",this.sort_order,"as",this.AlphaSearch);
    this.user = localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    if(this.user==null){
      this.user=[];
      this.user.uid="";
    }
    this._api.POST('GetServices', {pincode: this.pincode,test_name:this.searchString,test_code:'',test_type:this.test_type,condition_id:this.condition_id,speciality_id:this.speciality_id,sort_by:this.sortBy,sort_order:this.sort_order,AlphaSearch:this.AlphaSearch,user_id:this.user.uid,is_home_collection:""}).subscribe(data =>{
      if(data.status==1){
        this.testsList=JSON.parse(data.json).data;
      }else{
        this.testsList=[];
      }
    //console.log(this.testsList)
     });
   }
   
   serClick(srt_by:any,strng:any){
    this.sortBy=srt_by;
    this.searchString=strng;
    this.masterSearch();
   }
   checkUndefined(){
    if(this.searchString === undefined){
      this.searchString="";
    }
    if(this.speciality_id === undefined){
      this.speciality_id="";
    }
    if(this.condition_id === undefined){
      this.condition_id="";
    }
    if(this.test_type === undefined){
      this.test_type="";
    }
   }
   clrClick(){
    this.tempstr="";
    this.sortBy="";
    this.searchString="";
    this.speciality_id="";
    this.condition_id="";
    this.test_type="";
    this.AlphaSearch="";
    this.masterSearch();

  }
  alphaPaginate(alpha:any){
    this.AlphaSearch=alpha;
    this.masterSearch(); 
  }
  getPackages(){
   return  this._api.POST('GetPackages',{"pincode":"","package_name":"","package_code":"","sort_by":"","sort_order":"","alphaSearch":""}).subscribe(data =>{
      if(data.status==1){
        this._packages=JSON.parse(data.json).data;
        this.testsList=[];

      }else{
        this._packages=[];
      }
      //console.log(this._packages);
      return this._packages;
     
   
     });
  }
  getPackageDetails(package_id:any,selpackagename:any){
    //console.log(package_id);  
    this.selpackagename=selpackagename;
    this._api.POST('GetPackageServices',{"Pckage_id":package_id}).subscribe(data =>{
      if(data.status==1){
        this._packageServices=JSON.parse(data.json).data;
        this.testsList=[];
        this.packageServiceListSw=true;
      }else{
        this._packageServices=[];
      }
      console.log(this._packageServices);
     });
  }

  addToWishlist(event,test:any,i) {
   //console.log("heart id",event.currentTarget.firstChild.id);
    this.visible = !this.visible;
    
        if(this.visible==true){
                event.currentTarget.firstChild.style.color="red";
                //Add
                if(localStorage.getItem('user')!=null){
                this.user = localStorage.getItem('user');
                this.user = JSON.parse(this.user);
                this.status='A';
                this.loc_id=1;
                this.is_wishlist=1;
                this._api.POST('AddtoWishList', {"uid":this.user.uid,"test_id":test.tid,"loc_id":this.loc_id,"status":this.status,"is_wishlist":this.is_wishlist}).subscribe(data =>{
                this.temp3 = JSON.parse(data.json).data;
                      //console.log(this.wishList);
                this.temp3.forEach(element => {
                      this.temp3.push(element);  
                      });
                 localStorage.setItem('wishlist',JSON.stringify(this.temp3));
                 this.wl = localStorage.getItem('wishlist');
                 this.wl = JSON.parse(this.wl);

               });

            }else{
              this.msg = "Please enter your details to continue...";
              this.router.navigate(['./login', {msg:this.msg}]);
              console.log("Please enter your details to continue...");
            }
    
        }else{

            event.currentTarget.firstChild.style.color="";
            this.user = localStorage.getItem('user');
            this.user = JSON.parse(this.user);
            let status:string='D';
            let loc_id:number=1;
            let is_wishlist:number=1;
            this._api.POST('AddtoWishList', {"uid":this.user.uid,"test_id":test.tid,"loc_id":loc_id,"status":status,"is_wishlist":is_wishlist}).subscribe(data =>{
            this.wishList = JSON.parse(data.json).data;
                //console.log("res=",this.wishList);
             });
        } 
  }
  getWishlist(){
      if(localStorage.getItem('user')!=null){
        this.router.navigate(['./book/wishlist']);
      }else{
        this.msg = "Please enter your details to continue...";
        this.router.navigate(['./login', {msg:this.msg}]);
      }
  }

}
