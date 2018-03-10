import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
 import {ApiService} from '../common/api.service';

@Component({
  selector: 'app-our-network',
  templateUrl: './our-network.component.html',
  styleUrls: ['./our-network.component.css']
})
export class OurNetworkComponent implements OnInit {

  constructor(private _api :ApiService, private router :Router) {
     this._api=_api;
   }

  ngOnInit() {
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


}
