import { Component, OnInit, ElementRef } from '@angular/core';
import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import {AppComponent} from '../app.component';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers:[BookComponent]
})
export class CartComponent implements OnInit {
  tests:any=[];
  cartValues:any=[];
  osw:boolean=false;
  isTokenSet:boolean=false;
  paymentMethods:any=[];
  cartTestIds:any=[];
  suggestedTests:any=[];
  public _api:ApiService;
  public sw:number=1;
  public couponVAlue:String;
  public couponRes:any;
  public _appComponent:any;
  public user:any=[];
  public bookComponent:any;
  ms1:boolean=false;
  ms2:boolean=false;
  ms3:boolean=false;
  ms4:boolean=false;
  ms5:boolean=false;
  tmp:boolean=false;
  ms6:boolean=false;
  members:any=[];
  locations:any=[];
  cities:any=[];
  public optionVal:number;
  areas:any=[];
  sel_members:any=[];
  sel_locations:any=[];
  sel_slot:any=[];
  tid:number=null;
  finalPostList:any=[];
  address:any=[];
  location:any=[];
  cityId:number;
  ms7:boolean=false;
  member:any=[];
  //packages
  pckgs:any=[];
  cartPckgIds:any=[];
  tempTotal:number=0;
  tot:number;
  hvc:number=50;
  colc:number=0;
  labs:any=[];
  lablocations:any=[];
  sel_type:any=[];
  sel_lablocation:any=[];
  modify_bill:any=null;
  modi_member:any=[];

  constructor(_api :ApiService,bc:BookComponent,private router :Router,_appComponent :AppComponent,private elementRef:ElementRef) {
    this._api=_api;
    this._appComponent=_appComponent;
    this.tokenCheck(); 
    if(this.isTokenSet){
      this.getUserFamily(this.user.uid,0);
      this.getUserLocation(this.user.uid,0);
    }
    this._appComponent.setFlag();
    this.getLocStorage();
    this.getLabLocations("Hyderabad");//this will be dynamic form google locations
    this.listPckgs();
    this.listTests();
    this.couponRes={"discount_amount":0}
    this.bookComponent=bc;
    this.getCities();
    
    console.log('this.user',this.user);
  }

  ngOnInit() {
     this._api.POST('PaymentMethods', {token: 'SomeTokenHere'}).subscribe(data =>{
      this.paymentMethods=JSON.parse(data.json).data;
     });
     this._api.POST('SuggestedTests', {token: 'SomeTokenHere','test_ids':this.cartTestIds}).subscribe(data =>{
     this.suggestedTests=JSON.parse(data.json).data;
     });
   }


  listTests(){
   this.tests= JSON.parse(localStorage.getItem('tests'));
 //console.log('tests=',this.tests);

   if(this.tests!==null){
            if(this.tests.length > 0){
              this.tests.forEach(element => {
                this.cartTestIds.push(element.tid);
                 if(this.sel_members[element.tid]==undefined||this.sel_members[element.tid]==[]){
                  
                  this.sel_members[element.tid]=this.user; 
                  
                 }
                
                 if(this.sel_locations[element.tid]==undefined){
                   
                   this.sel_locations[element.tid]=this.user.user_address;
                  
                  // this.sel_locations[element.tid]="Plot #119,Road No 10,Jubliee Hills";
                 }
                //  console.log(this.user);
                //  console.log(this.sel_locations);
                 if(this.sel_type[element.tid]==undefined||this.sel_type[element.tid]===null){
                  this.sel_type[element.tid]=1;
                }
                if(this.sel_lablocation[element.tid]==undefined){
                  this.sel_lablocation[element.tid]=this.lablocations[0];
                }
                if(this.modify_bill){
                this.sel_members[element.tid]=this.modi_member;
                }
               }); 
              // console.log(this.modi_member);
             }
   }else{

        this.tests=[];
   }
 
   
    if(this.sel_members.length==0){
      if(localStorage.getItem('sel_members')){
        this.sel_members=JSON.parse(localStorage.getItem('sel_members'));
        localStorage.removeItem('sel_members')
      }
    }
    if(this.sel_locations.length==0){
      if(localStorage.getItem('sel_locations')){
        this.sel_locations=JSON.parse(localStorage.getItem('sel_locations'));
        localStorage.removeItem('sel_locations')
      }
    }
  this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
 
    //  this.bookComponent.hideCart();
  }
  //packages
    listPckgs(){
    //console.log("pckgs=",this.pckgs);
    this.pckgs= JSON.parse(localStorage.getItem('packages'));
    if(this.pckgs != null){
      this.pckgs.forEach(element => {
        this.cartPckgIds.push(element.id);
         if(this.sel_members[element.id]==undefined||this.sel_members[element.id]==[]){
           this.sel_members[element.id]=this.user;
         }
         if(this.sel_locations[element.id]==undefined){
           this.sel_locations[element.id]=this.user.user_address;
          // this.sel_locations[element.tid]="Plot #119,Road No 10,Jubliee Hills";
         }
         if(this.sel_type[element.id]==undefined){
           this.sel_type[element.id]=1;
         }
   
       });
    }
    //this.sel_locations=this.cleanArray(this.sel_locations);
    if(this.sel_members.length==0){
      if(localStorage.getItem('sel_members')){
        this.sel_members=JSON.parse(localStorage.getItem('sel_members'));
        localStorage.removeItem('sel_members')
      }
    }
    if(this.sel_locations.length==0){
      if(localStorage.getItem('sel_locations')){
        this.sel_locations=JSON.parse(localStorage.getItem('sel_locations'));
        localStorage.removeItem('sel_locations')
      }
    }
  this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
  //  console.log(this.sel_members);
  }

  tokenCheck(){
    if(localStorage.getItem('token')===null){
      this.isTokenSet=false;
    }else{
      this.isTokenSet=true;
     
      if(JSON.parse(localStorage.getItem('user'))){
        this.user=JSON.parse(localStorage.getItem('user'));
      }
      // console.log(this.user); 
      // console.log(localStorage.getItem('token'))
    }
  
  }
  showHide(val:number){
    this.sw=val;
  }
  offerssw(){
    if(this.osw===true){
      this.osw=false;
    }else{
      this.osw=true;
    }
   
  }
  onKey(coupon:String){
    
    if(coupon==''){
      return;
    }
    this.couponVAlue=coupon;
    this._api.POST('coupon_apply.php', {token: 'SomeTokenHere',test_ids: this.tests}).subscribe(data =>{
      this.couponRes=JSON.parse(data.json).data;
     });

  }
  getAddTestCart(tst:any){
     this.bookComponent.getAddTestCart(tst);
     this.listTests();
     this.bookComponent._appComponent.hideCart();
     this.bookComponent._appComponent.checkOut(); 
  }

   getAddPackageCart(pkg:any){
     this.bookComponent.getAddPackageCart(pkg);
     this.listPckgs();
     this.bookComponent._appComponent.hideCart();
     this.bookComponent._appComponent.checkOut(); 
  }

  cleanArray(actual) {
    let newArray =[];
    for (var i = 0; i < actual.length; i++) {
      if(actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

  checkOut(){
    if(this.isTokenSet){
      
      this.finalPostList=[];
      if(this.tests!=null){
          this.tests=this.cleanArray(this.tests);
          this.tests.forEach(element => {
            //console.log(this.sel_members[element.tid]['uid']);
           if(this.sel_members[element.tid]['uid']===undefined){
             this.finalPostList['uid_'+this.user.uid]=[];
             this.finalPostList['uid_'+this.user.uid].push(element.tid);
           }else{
             
             if(this.finalPostList['uid_'+this.sel_members[element.tid]['uid']]==undefined){
               this.finalPostList['uid_'+this.sel_members[element.tid]['uid']]=[];
              this.finalPostList['uid_'+this.sel_members[element.tid]['uid']].tests=[];
              this.finalPostList['uid_'+this.sel_members[element.tid]['uid']].tests.push(element.tid);
             }else{
               this.finalPostList['uid_'+this.sel_members[element.tid]['uid']].tests.push(element.tid);
             }
             
           }
                     
       });
      }
      if(this.pckgs!=null){
          this.pckgs=this.cleanArray(this.pckgs);
         // console.log(this.pckgs);
          this.pckgs.forEach(element => {
            //console.log(this.sel_members[element.tid]['uid']);
           if(this.sel_members[element.id]['uid']===undefined){
             this.finalPostList['uid_'+this.user.uid]=[];
             this.finalPostList['uid_'+this.user.uid].push(element.id);
           }else{
             
             if(this.finalPostList['uid_'+this.sel_members[element.id]['uid']]==undefined){
               this.finalPostList['uid_'+this.sel_members[element.id]['uid']]=[];
              this.finalPostList['uid_'+this.sel_members[element.id]['uid']].tests=[];
              this.finalPostList['uid_'+this.sel_members[element.id]['uid']].tests.push(element.id);
             }else{
               this.finalPostList['uid_'+this.sel_members[element.id]['uid']].tests.push(element.id);
             }
             
           }
                     
       });
      }
      console.log(this.finalPostList);
      
    

    // this._api.POST('GetFamilyMembers', {'token': 'SomeTokenHere','user_id':uid}).subscribe(data =>{
    //   this.members=JSON.parse(data.json).data;
     
    //  });

     for(let key in this.finalPostList){
     let fuid=key.split("_")[1];
     var fiorder_no:any=[];
     let fitest=this.finalPostList[key].tests;
     let fiprice:any=[];
     let filocation:any=[];
     let fischedule:any=[];
     let fiseltype:any=[];

     this.tempTotal=0;
    
     fitest.forEach(element => {
       
      fiprice.push(this.getFpriceByTid(element));
      fiseltype.push(this.sel_type[element]);
      if(this.sel_type[element]==1){
        if(this.sel_locations[element].address==undefined){
          filocation.push(this.sel_locations[element]);
        }else{
          filocation.push(this.sel_locations[element].address);
        }
        
      }else{
        filocation.push(this.sel_lablocation[element].address);
      }
      
      if(this.sel_slot.length > 0){
        this.sel_slot.forEach(e=>{
         if(e[0].tid==element){
           let str=null;
           let strdt=e[0].temp[0].slot_date;
           let strtm=e[0].temp[0].slot_time;
           str=strdt.slice(0,4)+'-'+strdt.slice(4,6)+'-'+strdt.slice(6,8)+' '+strtm.slice(0,5);
          fischedule.push(str);
         }
        })
       
      }
     });
    
     if(this.modify_bill){
      this._api.POST('ModifyOrder', {'token': 'SomeTokenHere','test_id':fitest.join(),'user_name':fuid,'order_no':this.modify_bill,'item_net_amount':fiprice.join(),'item_center_id':1,'item_center_name':'banjara','order_net_amount':this.tempTotal,'status':'M','schdate':fischedule.join('`'),'schaddress':filocation.join('`'),'order_type':fiseltype.join()}).subscribe(data =>{
        let inv=JSON.parse(data.json).data;
  
       // console.log(inv[0].order_no);
        fiorder_no.push(inv[0].order_no);
  
        if(Object.keys(this.finalPostList).length==fiorder_no.length){
          
            this.orderModified(fiorder_no);
           
        }
       });
     }else{
      this._api.POST('OrderCreate', {'token': 'SomeTokenHere','test_id':fitest.join(),'user_name':fuid,'item_net_amount':fiprice.join(),'item_center_id':1,'item_center_name':'banjara','order_net_amount':this.tempTotal,'schdate':fischedule.join('`'),'schaddress':filocation.join('`'),'order_type':fiseltype.join()}).subscribe(data =>{
        let inv=JSON.parse(data.json).data;
        if(JSON.parse(data.json).status==1){
          console.log(inv);
          fiorder_no.push(inv[0].order_no);
        }
      
  
        if(Object.keys(this.finalPostList).length==fiorder_no.length){
          
            this.finalizeOrder(fiorder_no);
           
        }
       });
     }
      
     }

     
    }else{
      this.router.navigate(['./login']);
    }
    
  }
  finalizeOrder(fiorder_no:any){
    this._api.POST('FinalizeOrder', {'token': 'SomeTokenHere','Referenceid':this.user.uid,'order_no':fiorder_no.join(),'payment_type':'0'}).subscribe(data =>{
      let inv=JSON.parse(data.json).data;
      console.log(inv);
      sessionStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem('invoice', JSON.stringify(inv));
      localStorage.setItem('tempTotal', JSON.stringify(this.tempTotal));
      
      console.log("order finalized");

  //    console.log(inv);
     this.clearCart();
    console.log("payment gateway redirection here");
    this.router.navigate(['./payment']);
     });
  }
  orderModified(fiorder_no:any){
    this.clearCart();
    console.log("payment gateway redirection here");
    this.router.navigate(['./payment']);

  }
  clearCart(){
    this._api.POST('AddtoWishList', {'token': 'SomeTokenHere','uid':this.user.uid,'test_id':0,'loc_id':'1','status':'C','is_wishlist':'2'}).subscribe(data =>{
      let inv=JSON.parse(data.json).data;
    //  console.log("Cart Cleared");
      this.bookComponent._appComponent.clearCart();
     });

  }
  getFpriceByTid(tid){
    let a=0;
    this.tests.forEach(element => {
     
      if(element.tid==tid){
        a= element.test_finalpr;
      } 
    });
    //console.log("here",this.pckgs);
    if(this.pckgs){
      this.pckgs.forEach(element => {
        
         if(element.id==tid){
           a= element.package_finalpr;
         } 
       });
    }
    
    
    this.tempTotal=this.tempTotal+a;
    return a;
  }
  backToTests(){
    this.router.navigate(['./book']);
  }
  getUserFamily(uid:number,tid:number){
   this.tid=tid;
    // family_members
    this._api.POST('GetFamilyMembers', {'token': 'SomeTokenHere','user_id':uid}).subscribe(data =>{
    let res = JSON.parse(data.json).data;
     if(res==undefined){
      this.members.push(this.user);
             // console.log(this.members);
     }else{

            if(JSON.parse(data.json).data.length > 0){
              this.members=JSON.parse(data.json).data;
              this.members.push(this.user);
              this.members.reverse();
            }else{
              this.members.push(this.user);
            }
          }
     });

  /*  if(uid){
      this.ms1=true;
    }*/
  }

  hm1(){
    this.ms1=false;
  }
  
  addFM(){
    this.ms1=false;
    this.ms2=true;
  }
  hm2(){
    this.ms2=false;
  }
  getUserLocation(uid:number,tid:number){
    this.tid=tid;
     this._api.POST('GetUserAddress', {'token': 'SomeTokenHere','uid':uid}).subscribe(data =>{
    // console.log('locs',(JSON.parse(data.json).data.length));
    let res =JSON.parse(data.json).data;
    if(res==undefined){
         this.locations[0]=[];
         this.locations[0].address="NA";
         this.locations[0].area="NA";
         this.locations[0].city="NA";
         this.locations[0].area_id=0;

    }else{
       if(JSON.parse(data.json).data.length > 0){
        this.locations=JSON.parse(data.json).data;
       }else{
        this.locations[0]=[];
         this.locations[0].address="NA";
         this.locations[0].area="NA";
         this.locations[0].city="NA";
         this.locations[0].area_id=0;
       }

    }
      

       
      });
    /* if(uid){
       this.ms3=true;
     }*/ 
   }
   hm3(){
     this.ms3=false;
   }
   
   addLoc(){
     this.ms3=false;
     this.ms4=true;
   }
   hm4(){
     this.ms4=false;
   }
   getSlots(uid:number,test_id:number){
     this.tid=test_id;
    this.router.navigate(['./slots', {testId:test_id}]);
   }
   setFamilyMember(mem:any){
    //console.log(mem);
    this.sel_members[this.tid]=mem;
    this.hm1();
    this.setLocStorage();
   }


   setFamilyMember1(memId:any,tid:number){
 // console.log(memId);
  this.members.forEach( (item, index) => {
    //console.log(item.uid,memId);
      if(item.uid==memId){
        this.sel_members[tid]=item;
      } 

     });
  this.hm1();
  this.setLocStorage();
  //console.log(this.sel_members[tid]);
   }

  saveFamilyMembers(mem:any,uid:number){
    mem.user_id=uid;
   // console.log("mem=",mem);
    this._api.POST('AddFamilyMembers', mem).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      //console.log(mems);
      this.tmp = true;
      window.location.reload();
     });

   }

   setTestLocation(loc:any){
    //  console.log(loc.sub_area+','+loc.area+','+loc.pincode);
     this.sel_locations[this.tid]=loc.address+','+loc.area+','+loc.city;
     this.hm3();
     this.setLocStorage();
   }

   setTestLocation1(locId:any, tid:number){
    //console.log('setLoc',locId,tid);
    if(this.sel_type[tid]==1){
      this.locations.forEach( (item, index) => {
        if(item.area_id==locId){
          //this.sel_locations[tid]=item.address+','+item.area+','+item.city;
          this.sel_locations[tid]=item;
        }
      });
    }else{
    this.lablocations.forEach( (item, index) => {
        if(item.area_id==locId){
          //this.sel_locations[tid]=item.address+','+item.area+','+item.city;
          this.sel_lablocation[tid]=item;
        }
      });
    }
   // console.log(this.sel_lablocation);
      /* this.sel_locations[this.tid]=loc.address+','+loc.area+','+loc.city;*/
     this.hm3();
     this.setLocStorage();
   }

   setLocStorage(){
    localStorage.setItem("sel_locations",JSON.stringify(this.sel_locations));
    localStorage.setItem("sel_members",JSON.stringify(this.sel_members));
    localStorage.setItem("sel_lablocation",JSON.stringify(this.sel_lablocation));
    localStorage.setItem("sel_type",JSON.stringify(this.sel_type));
   }
   getLocStorage(){
     if(localStorage.getItem("sel_locations")){
      this.sel_locations=JSON.parse(localStorage.getItem("sel_locations"));
     }
     if(localStorage.getItem("sel_members")){
      this.sel_members=JSON.parse(localStorage.getItem("sel_members"));
     }
     if(localStorage.getItem("slot_details")){
      this.sel_slot=JSON.parse(localStorage.getItem("slot_details"));
      //console.log(this.sel_slot);
     }
     if(localStorage.getItem("sel_lablocation")){
      this.sel_lablocation=JSON.parse(localStorage.getItem("sel_lablocation"));
      //console.log(this.sel_slot);
     }
     if(localStorage.getItem("sel_type")){
      this.sel_type=JSON.parse(localStorage.getItem("sel_type"));
      //console.log(this.sel_slot);
     }
     if(localStorage.getItem("modify_bill")){
      let mm=JSON.parse(localStorage.getItem("modi_member"));
      console.log(mm);
       this.modi_member=mm;
      this.modify_bill=localStorage.getItem("modify_bill");
     }
     
   }

   getCities(){
    this._api.POST('GetCity',{token: 'SomeTokenHere'}).subscribe(data =>{
      this.cities=JSON.parse(data.json).data;
     // console.log(this.cities);
     });
   }
   getAreaByCity(event){
     this.optionVal = event.target.value;
     //console.log(optionVal);
      this._api.POST('GetAreasByCity',{'token': 'SomeTokenHere','City_id':this.optionVal}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
      console.log(this.areas);
     });
    
   }
   getAreaByCity1(cityId:number){
      this.cityId = cityId;
      this._api.POST('GetAreasByCity',{'token': 'SomeTokenHere','City_id':cityId}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
      console.log(this.areas);
     });
    
   }
   addUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
    address_info.user_id=uid;
    address_info.state_id=1;
    address_info.country_id=1;
  //  console.log(address_info);
     /*if(localStorage.getItem('token')!=null){
      }*/
      this._api.POST('AddUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
      console.log(this.address);
        this.ms5=true;
        window.location.reload();
      });
   }

    deleteCartItem(uid:number,tid:number){
    this.tests= JSON.parse(localStorage.getItem('tests'));
     // console.log(this.tests);
      //this.tests.splice(this.tests.indexOf(tid), 1);
      if(this.tests!=null){
      this.tests.forEach( (item, index) => {
      //console.log(this.sel_members[item.tid]['uid']);
        if(this.sel_members[item.tid]){  
          if(item.tid === tid) this.tests.splice(index,1);
        }
     });
    }

      this.pckgs= JSON.parse(localStorage.getItem('packages'));
     //console.log(this.tests);
     if(this.pckgs!=null){
      this.pckgs.forEach( (item, index) => {
        if(item.id === tid) this.pckgs.splice(index,1);
     });
     }
    
    localStorage.setItem("tests", JSON.stringify(this.tests));
    localStorage.setItem("packages", JSON.stringify(this.pckgs));

    this.tot=0;
     this.tests.forEach(element => {
                this.tot=this.tot+parseInt(element.test_finalpr); 
              });
     if(this.pckgs!==null){
           this.pckgs.forEach(element => {
                      this.tot=this.tot+parseInt(element.package_finalpr); 
                    });
       }
       this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
       localStorage.removeItem('cartValues');
       
     let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
     localStorage.setItem("cartValues",JSON.stringify(a));
     this.cartValues= JSON.parse(localStorage.getItem('cartValues'));
     //console.log('ucv',this.cartValues);
    
    this.bookComponent._appComponent.checkOut(); 
   }

   editFMAddress(uid:number,user_loc_id:number){

    this.locations.forEach(element => {
        //console.log(element.id);
        if(element.user_loc_id === user_loc_id){
           // console.log(element);
            this.location = element;

        }
    });
      this.ms6=true;
      this.hm3();
      this.getAreaByCity1(this.location.city_id);
      console.log(this.location);

   }

   hm5(){
     this.ms6=false;
   }

   updateUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
    address_info.user_id=uid;
    address_info.state_id=1;
    address_info.country_id=1;
   // console.log(address_info);
     /*if(localStorage.getItem('token')!=null){
      }*/
     /* this._api.POST('UpdateUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
        //this.ms5=true;
        console.log("User address updated");
        window.location.reload();
      });*/
   }

   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
    //console.log(this.members);
      this.members.forEach(element => {
        if(element.fmid === fmid){
            this.member = element;
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }
             //this.member.user_dob=this.getHumanDate(this.member.user_dob);
        }
    });
    return this.member;
     // console.log(this.member);
   }

   hm6(){
     this.ms7=false;
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

  updateFamilyMembers(fmInfo:any,fmid:number){
     fmInfo.user_id=fmid;
     //console.log(fmInfo);
     this._api.POST('UpdateFamilyMembers',fmInfo).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
     // console.log("Family member updated successfully");
      //this.tmp = true;
     window.location.reload();
     });

  }

    getTestDetails(id:number){
    this.router.navigate(['./book/test-details', {testId:id}]);
    }

    getSelMem(tid:any){
     if(this.sel_members[tid]){
      return this.members.filter(item => item.uid== this.sel_members[tid].uid);
       
     }else{
      return [];
     }
      
    }
    getNonSelMem(tid:any){
      if(this.sel_members[tid]){
       // this.sel_members[tid]=[];
       return this.members.filter(item => item.uid!== this.sel_members[tid].uid);
      }
      return this.members;
    }


    getSelLoc(tid:any){
      if(this.sel_locations[tid]){
        return this.locations.filter(item => item.area_id== this.sel_locations[tid].area_id);
        }else{
        return [];
      }
      
    }
    getNonSelLoc(tid:any){
     
      if(this.sel_locations[tid]){
        return this.locations.filter(item => item.area_id!== this.sel_locations[tid].area_id);
      }else{
        return this.locations;
      }
      
    }
    getSelLabLoc(tid:any){
      if(this.sel_lablocation[tid]){
        return this.lablocations.filter(item => item.area_id== this.sel_lablocation[tid].area_id);
      }else{
        return [];
      }
      
    }
    getNonSelLabLoc(tid:any){
      if(this.sel_lablocation[tid]){
        return this.lablocations.filter(item => item.area_id!== this.sel_lablocation[tid].area_id);
        
      }else{
        return this.lablocations;
      }
        
    }
    getLabAddress(evnt:any,tid:any){
      let type=evnt.value;
      this.sel_type[tid]=type;
    //  let b=this.elementRef.nativeElement.querySelectorAll('.selloc_'+tid);
    this.setLocStorage();
    }
    getLabLocations(city:any){
      //get nearest location API
      let t='[{"location_id":1,"location_name":"Tenet Central Lab","address":"Plot no 54, Kineta Towers, Journalist Colony,  Road no. 3","area_id":5,"city_id":1,"state_id":25,"country_id":1,"area":"banjara hills","city":"hyderabad","state":"25 Telangana ","country":"INDIA"}]';
      
      this.lablocations= JSON.parse(t);
    }
    locationhcset(tid){
      if(this.sel_type[tid]==1){
        return true;
      }else{
        return false;
      }
    }
    locationwiset(tid){
      if(this.sel_type[tid]==2){
        return true;
      }else{
        return false;
      }
    }
    noModify(){
      let a=confirm("Are You Sure?\nYou Want Discard Modify Bill \nand \nAdd it as a New Bill?");
      if(a){
        this.modify_bill=null;
        this.modi_member=null;
        localStorage.removeItem("modify_bill");
      }
    }

}
