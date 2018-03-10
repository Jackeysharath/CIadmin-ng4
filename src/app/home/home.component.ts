import {Component, OnInit} from '@angular/core';
// import {StateService} from '../common/state.service';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
 // providers:[ApiService]
})
export class HomeComponent implements OnInit {
    addW: any;
    title: string = 'Center for Excellence Medical Sciences';
  body:  string = 'This is the about home body';
  message: string;
  image_path: string="/assets/images/imagehbg.png";
  geolocationPosition :object;
  testList: any;
  public _appComponent:any;
  //_api: any;
  latitude:any;
  longitude:any;
  queryString:any;
  images:string[]=["imagehbg.png","sliders/slider_image.png","imagehbg.png","sliders/slider_image.png","imagehbg.png","sliders/slider_image.png"]
  images1:string[]=["iconimages/homepage_presn_slider/1.png","iconimages/homepage_presn_slider/1.png"];
   constructor(private _api :ApiService,private router :Router,_appComponent :AppComponent) { 
      // console.log("Get Banners here!");
       this._api=_api;
       this._appComponent=_appComponent;

        this.queryString;
      
     }
 getlocation(){
  if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position;
         // this.latitude= position.coords.latitude;
         // this.longitude= position.coords.longitude;

        //console.log(this.latitude);
        //localStorage.setItem('lat', this.latitude);
        //localStorage.setItem('long', this.longitude);
          //console.log("gp",this.geolocationPosition);      
        },
        error => {
            switch (error.code) {
                case 1:
                    console.log('Permission Denied');
                    break;
                case 2:
                    console.log('Position Unavailable');
                    break;
                case 3:
                    console.log('Timeout');
                    break;
            }
        }
    );
};
 }
  ngOnInit() {
    // this.message = this._stateService.getMessage();
    this.getlocation();
    // console.log(this.geolocationPosition);
    localStorage.setItem('showCart',"false");
    
  }

  getCordinates(){
      return this.geolocationPosition;
  }
  getBookAnAppointment(){
   
     this.router.navigate(['./book']);
  }
  searchBasedOnString(str:any){
    this.router.navigate(['./book', {searchString:str}]);
  }
  movescaro(obj:any,dir:any){
     if(dir=="left"){
        obj.previous();
     }else if(dir=="right"){
        obj.next();
     }
    
  }
  showHover(val){
      this.addW=val;
  }

  eventHandler(event) {
  
 //console.log(event, event.keyCode, event.keyIdentifier);
   console.log(event.key);
   } 

  
}
