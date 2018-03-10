import { Component, OnInit, Inject } from '@angular/core';
import {ApiService} from '../common/api.service';
import { HttpModule } from '@angular/http';
import {AppComponent} from '../app.component';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
declare var swal: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  login_id: any;
  user: any = [];
  userInfo:any=[];
  obj:any=[];
  public _api:ApiService;
  tmp:number;
  sw:boolean=false;
  msg:string;
  basicInfo:boolean=true;
  editFlag:boolean=false;
  newArray:any =[];

  members:any=[];
  ms2:boolean=false;
  ms1:boolean=true;
  ms7:boolean=false;
  member:any=[];

  ms3:boolean=true;
  ms4:boolean=false;
  ms6:boolean=false;
  address:any=[];
  ms5:boolean=false;
  locations:any=[];
  public optionVal:number;
  areas:any=[];
  cities:any=[];
  cityId:number;
  location:any=[];
  user_loc_id:number;
  pwc:any=0;
  upm:boolean=false;
  fam:boolean=false;
  uam:boolean=false;
  fmem:boolean=false;
  public fms:any=[];
  public _appComponent:any;
  editBtn:boolean=true;

  constructor(private router :Router,_api :ApiService,_appComponent :AppComponent) {
    this._api=_api;
    this._appComponent=_appComponent;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.login_id=this.user.uid;
    this.getUserLocation(this.user.uid,0);
    this.getCities();
    this.getUserDetails();
    this._appComponent.setFlag();
    //console.log('uu',this.user);

    let mobile= JSON.parse(localStorage.getItem("user_mobile"));
    console.log('mob',mobile);
   }

  ngOnInit() {
    this.tmp=1;
     
  // console.log('user=',this.user);
   this.getFamilyMembers(this.user.uid);
 
  }

  getUserDetails(){
    this.user = JSON.parse(localStorage.getItem("user"));
     // this.obj = JSON.parse(this.user);
    this._api.POST('GetUserDetails',{token: 'SomeTokenHere','user_id':this.user.uid}).subscribe(data =>{
      this.userInfo=JSON.parse(data.json).data;
      //console.log(this.userInfo[0]);
      if(this.userInfo){
        this.user = this.userInfo[0];
        if(this.user.user_dob!==null){
          this.user.user_dob=this.getHumanDate(this.user.user_dob);
        }
      }
      localStorage.setItem('user',JSON.stringify(this.userInfo[0]));
      localStorage.setItem('user_mobile',JSON.stringify(this.user.user_phone));
      this._appComponent.setFlag();
      
        //console.log(this.getHumanDate(this.user.user_dob));
      
     });
  }

  updateProfile(profileInfo: NgForm, isValid: boolean){


    if(profileInfo.valid){

     profileInfo.value.TokenNo = 'SomeTokenHere';
      //mem.user_id=uid;
    //console.log('pI',profileInfo);
    this._api.POST('UpdateFamilyMembers',profileInfo.value).subscribe(data =>{
      this.user=JSON.parse(data.json).data;
      //this.upm=true;
      this.user[0].uid = this.user[0].id;
      this.user=this.user[0];
      
      localStorage.setItem('user',JSON.stringify(this.user));
      this._appComponent.setFlag();
      this.editBtn=true;
      this.editFlag=false;
      this.basicInfo=true;
      swal("Profile updated");
      this.getUserDetails();
    
      //window.location.reload();
      
     });

     }else{

     }  
  } 

  showHide(num:number){
    this.tmp=num;
  }

  changePassword(form: NgForm, isValid: boolean){

    if(form.valid){
    form.value.TokenNo = 'SomeTokenHere';
     //console.log('form',form.value);
     console.log(form.value);
     this._api.POST('ChangePassword',form.value).subscribe(data =>{
      let res=JSON.parse(data.json).data;
      console.log("res",res);

            if(res == undefined){
                console.log("data undefined");
                 form.resetForm();
                //this.pwc=2;

                swal("Invalid current password");
            }else{
              //console.log(this.user);
              if(form.value.oldpassword !== form.value.newpassword){

                      if(JSON.parse(data.json).status==1){
                        this.pwc=1;
                      }else{
                        this.pwc=2;
                      }

                      console.log("Password changed Successfully");
                     //window.location.reload();
                     this._appComponent.toLogout();
                     this.router.navigate(['./home']);
                   }else{
                    this.pwc=3;
                    console.log("Old password and new pwd should not be same");
                   }

            }
            //form.resetForm();
      
     }); 
   }else{

   }

  }

    
  
 
  revert(form:any){
     form.reset();
  }

  editInfo(){
    this.editFlag=true;
    this.basicInfo=false;
    this.editBtn =false;
   
    /*this.basicInfo=!this.basicInfo;
    this.editFlag=!this.editFlag;*/
  }

  getFamilyMembers(uid:number){
  let fm_dob:any;
  this.fms=[];
    this._api.POST('GetFamilyMembers', {'token': 'SomeTokenHere','user_id':uid}).subscribe(data =>{
      this.members=JSON.parse(data.json).data;
      if(this.members){
        this.members.forEach(element => {
          console.log('user_dob',element.user_dob);
             fm_dob = this.getHumanDate(element.user_dob);
            element.age=this.getAge(fm_dob);
        });
      }else{
        this.members=[];
      }
         
     //this.members.push(this.newArray);
   //console.log('members',this.members);
     });
  }

  getAge(dob:any)
     {
        if(dob){
              let birthday = new Date(dob).getTime();
              let today = new Date().getTime();
              let ag = ((today - birthday) / (31557600000));
              let ag1 = Math.floor( ag );
              return ag1;
            }
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
    return date1;
    //console.log(date1);
  }

  addFM(){
    this.ms2=true;
    this.ms1=false;
  }

  saveFamilyMembers(mem:any,uid:number){
    mem.user_id = uid;
    mem.TokenNo='SomeTokenHere';
    console.log(mem);
    this._api.POST('AddFamilyMembers', mem).subscribe(data =>{
        let mems=JSON.parse(data.json).data;
        //console.log(mems);
         this.fam = true;
         //window.location.reload();
        console.log("family member added");
        this.getFamilyMembers(this.user.uid);
       });

   }

    hm1(){
    this.ms1=false;
    }

    hm2(){
    this.ms2=false;
    this.ms1=true;
    }

   

   addLoc(){
   this.ms3=false;
   this.ms4=true;
   }
   hm3(){
     this.ms3=false;
   }

   hm4(){
     this.ms3=true;
     this.ms4=false;
   }
   hm5(){
     this.ms6=false;
     this.ms3=true;
   }
    hm6(){
     this.ms7=false;
     this.ms1=true;
    }

   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
    //console.log(this.members);
      this.members.forEach(element => {
        if(element.uid === fmid){
            this.member = element;
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }
             this.member.user_dob=this.getHumanDate(this.member.user_dob);

            // window.location.reload();
        }
    });
    
   }

   updateFamilyMembers(fmInfo:any,fmid:number){
     fmInfo.user_id=fmid;
     this._api.POST('UpdateFamilyMembers',fmInfo).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      console.log("Family member updated successfully");
      this.fmem = true;
      this.getFamilyMembers(this.user.uid);
      //window.location.reload();
     });

  }

   addUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
    address_info.user_id=uid;
    address_info.state_id=1;
    address_info.country_id=1;
   
     /*if(localStorage.getItem('token')!=null){
      }*/
      this._api.POST('AddUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
      if(this.address==undefined){

            }else{
                  
            this.ms5=true;
            this.getUserLocation(this.user.uid,0);
            //window.location.reload();
            }
      
      });
   }

   getUserLocation(uid:number,tid:number){
    //this.tid=tid;
       this._api.POST('GetUserAddress', {'token': 'SomeTokenHere','uid':uid}).subscribe(data =>{
      let res =JSON.parse(data.json).data;
         if(res==undefined){
             
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

     /*if(uid){
       this.ms3=true;
     }*/
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
      //console.log('areas',this.areas);
     });
    
   }

   getAreaByCity1(cityId:number){
      this.cityId = cityId;
      this._api.POST('GetAreasByCity',{'token': 'SomeTokenHere','City_id':cityId}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
     //console.log(this.areas);
     });
    
   }

    editFMAddress(uid:number,user_loc_id:number){
    this.locations.forEach(element => {
        //console.log(element.id);
        if(element.area_id === user_loc_id){
           // console.log(element);
            this.location = element;
          
        }
    });
    this.user_loc_id=user_loc_id;
      this.ms6=true;
     this.ms3=false;
      //this.hm3();
      this.getAreaByCity1(this.location.city_id);
   }

  updateUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
    address_info.user_id=uid; 
    address_info.state_id=1;
    address_info.country_id=1;
      this._api.POST('UpdateUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
        this.uam=true;
        this.getUserLocation(this.user.uid,0);
        //console.log("User address updated");
      //window.location.reload();
      });
   }

  
}
