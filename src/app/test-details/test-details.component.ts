import { Component, OnInit,Input,Injectable } from '@angular/core';

import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import { ActivatedRoute,Router} from '@angular/router';


@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.css'],
  providers:[BookComponent]
 
})
@Injectable()
export class TestDetailsComponent implements OnInit {
  ser_string: any;
  testDetails: any = [];
  test_id:any;
  _greetMessage:any;
  public _api:ApiService;
  sw:number;
  _bookComponent:BookComponent;
 
  constructor(_api :ApiService,_bookComponent:BookComponent,private router :ActivatedRoute,private route:Router){
    this._api=_api;
    this._bookComponent=_bookComponent;
    
   }
  ngOnInit() {
    
    // this.router.params.subscribe(params => this.test_id=params.testId);
    this.test_id=this.router.snapshot.paramMap.get('id');
    if(isNaN(this.test_id)){
      this.ser_string=this.test_id;
    }else{
      this.ser_string='';
    }
    //console.log(this.ser_string);
    this.sw=1;
    this._api.POST('GetTestDetails', {token: 'SomeTokenHere',test_id:this.test_id,'test_name':this.ser_string}).subscribe(data =>{
       this.testDetails=JSON.parse(data.json).data[0];
       this.testDetails.report_avb=this.getHumanDate(this.testDetails.report_avb);
  
       //report_avb
      // console.log(this.testDetails);
      });
      
  // this.testDetails={
  //   "tid":1,
  //   "test_spec" : "Endocrinologist",
  //   "test_cdn" : "Disorders of Adrenal Gland",
  //   "test_code" : "R053",
  //   "test_name" : "17-Hydroxyprogesterone(17-OHP)-Serum",
  //   "test_other_names": "17-HP",
  //   "test_price" : 1300,
  //   "test_discpr": 200 ,
  //   "test_finalpr": 1100 ,
  //   "spec_type" : "Serum",
  //   "spec_inst" :  "text",
  //   "test_ptn" : "text",
  //   "test_sch" : "daily",
  //   "report_avb" : "3 Days",
  //   "test_whygt" : "text",
  //   "test_whengt" : "text",
  //   "test_rel" :  "test1, test 2" 
  //   };
  }
  getTestDetails(data:number){
    this._api.POST('GetTestDetails', {token: 'SomeTokenHere',test_id:data}).subscribe(data =>{
      
       this.testDetails=JSON.parse(data.json).data;
       this.testDetails.report_avb=this.getHumanDate(this.testDetails.report_avb);
      });
    
  }
  showHide(num:number){
    this.sw=num;
  }

  getAddTestCart1(tests:any){
    //console.log(tests);
    this._bookComponent.getAddTestCart(tests);
      this.route.navigate(['./book']);
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
    return dateString;
  }

    searchBasedOnString(str:any){
    this.route.navigate(['./book', {searchString:str}]);
   }

}
