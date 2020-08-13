import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  resource:any;
  public monthWise=[];
  public filterValue=[];
  
  public total=0;
  public maximum_individual_income:any;
  public minimum_individual_income:any;
  public lowest_income:any=[];
  public maximum_income:any=[];

  constructor(public http:HttpClient,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }
ionViewWillEnter(){
 this.http.get("./../assets/json/resource.json").subscribe((data:any)=>{
  /// console.log(data)
   this.resource=data;
   this.month_wise();// this function call for filter  month wise data
   this.min_max_value();// this function call for find maximum and minimum income of a list
   this.min_max_income();//this function call for find lowest and maximum  income from the list
 },(error:any)=>{})
}

month_wise(){
  let res = this.resource.reduce((earning, obj)=>{
    let Obj = earning.find(item => item.date.substring(3,5) === obj.date.substring(3,5));// here we use sub string because we take the date from date string
    if(Obj){
      Obj.earning_amount = ((Obj.earning_amount) + (obj.earning_amount));
      return earning;
    }
    this.filterValue.push(obj);
    return this.filterValue;
  },[]);

  for(let j=0;j<this.filterValue.length;j++){
    this.monthWise.push({
      name: this.filterValue[j].name, 
      earning_amount: this.filterValue[j].earning_amount, 
      month: this.filterValue[j].date.substring(3,5)
    })
  }
  // we use this for loop to get sum of array value from monthWise[]
  for(let i=0; i<this.monthWise.length;i++){
    this.total = (this.total)+(this.monthWise[i].earning_amount);
  }
  //end
  console.log(this.monthWise);
  
}
min_max_value(){

    // this one for get minimum income from the list
    let  minimum_individual_income = this.resource.reduce(function(value, obj) {
      if(obj.earning_amount < value.earning_amount){
        return obj
      }else{
        return value;
      }
    });
    // this one for get maximum income from the list
    let  maximum_individual_income = this.resource.reduce(function(value, obj) {
      if(obj.earning_amount > value.earning_amount){
        return obj
      }else{
        return value;
      }
    });
    this.minimum_individual_income=minimum_individual_income.earning_amount;
    this.maximum_individual_income=maximum_individual_income.earning_amount;
    console.log(this.minimum_individual_income);
    
}
min_max_income(){
  let  lowest_income = this.monthWise.reduce(function(value, obj) {
    if(obj.earning_amount < value.earning_amount){
      return obj
    }else{
      return value;
    }
  });
  let  maximum_income = this.monthWise.reduce(function(value, obj) {
    if(obj.earning_amount > value.earning_amount){
      return obj
    }else{
      return value;
    }
  });
  this.lowest_income.push(lowest_income);
  this.maximum_income.push(maximum_income);
}
}
