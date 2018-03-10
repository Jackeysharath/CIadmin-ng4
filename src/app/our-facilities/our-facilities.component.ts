import { Component, OnInit, Injectable} from '@angular/core';
import {BookComponent} from '../book/book.component';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-our-facilities',
  templateUrl: './our-facilities.component.html',
  styleUrls: ['./our-facilities.component.css'],
  providers:[BookComponent]
})

@Injectable()
export class OurFacilitiesComponent implements OnInit {
   public _bookComponent:any;
   public _appComponent:any;
   public _api:ApiService;

  constructor(_bookComponent :BookComponent,_api :ApiService,private router :Router) {
  		this._bookComponent=_bookComponent;
  		this._api=_api;
  		this.router = router;
  		
   }

	  ngOnInit() {

	  }

   	search(srt_by:any,searchString:any){
	 //this._bookComponent.serClick(srt_by,strng);
	  this.router.navigate(['./book', {searchString:searchString}]);
	}

	

}
