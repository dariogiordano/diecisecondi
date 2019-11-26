import { Component,ViewChild,ElementRef, OnInit} from '@angular/core';
import {fromEvent, Observable, BehaviorSubject} from 'rxjs';
import {filter,merge} from 'rxjs/operators'
import { user } from './interfaces';


const SECONDS_TO_COUNT:number=10000

class User implements user{
  constructor(){}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {}
 
@ViewChild('usernameField', {static: true}) usernameField: ElementRef;
  title : string = 'dieci secondi'
  public status : string = "off"
  private _pressed : boolean = false
  private _dateStart : Date = new Date()
  public isFullScreen : boolean = document.fullscreen
  public scores$:BehaviorSubject<user[]>=new BehaviorSubject<user[]>([])
  public currentUser:user
  public error:boolean=false
  private _fullscreen$:Observable<Event>;
  private _down$:Observable<Event>;
  private _up$:Observable<Event>;
  reset(){
    this.currentUser=new User()
    this.error=false;
    setTimeout(() => {
      this.usernameField.nativeElement.focus();
    },100)
  }

  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen 
    if (methodToBeInvoked)
    {
      methodToBeInvoked.call(elem);
      this.reset();
    }
  }
  ngOnInit(){
    this.currentUser= new User()
    if(localStorage.getItem("scores")!==undefined){
   
    this.scores$.next(JSON.parse(localStorage.getItem("scores")))
  }
    
 
    this._fullscreen$=fromEvent(document,"fullscreenchange");
    this._up$=fromEvent(document.body, 'keyup');
    this._down$=fromEvent(document.body, 'keypress').pipe(merge(this._up$),filter((event:KeyboardEvent)=> event.type==="keyup" || event.which === 102 || event.which === 13));
    this._fullscreen$.subscribe((e)=>{ this.isFullScreen=document.fullscreen})

    this._down$.subscribe((e:Event) => {  
      let canChangeStatus=false;
      if(e.type==="keyup") return this._pressed=false;
      let event:KeyboardEvent=e as KeyboardEvent;
      event.stopPropagation();
      event.preventDefault();
      if( event.which === 102 && this.isFullScreen===false){
        this.status='off'
        this.fullScreen()
      }
      canChangeStatus=event.which === 13 && this._pressed===false
      this._pressed=true
      if(canChangeStatus ){ 
        switch (this.status){
          case 'off':
          
            if(!this.currentUser.username|| /^\s*$/.test(this.currentUser.username) ){
              this.error=true;
            }else{
              this.error=false;
              this.status='preon';
             
            }
            break;
            case 'preon':
              this._dateStart=new Date();
              this.status='on';
            break;
          
          case 'on':
            let newDate= new Date();
            this.status='completed';
            this.currentUser.isLower=newDate.getTime() - this._dateStart.getTime()<SECONDS_TO_COUNT
            this.currentUser.time=newDate.getTime() - this._dateStart.getTime()
            this.currentUser.diffTime =Math.abs(SECONDS_TO_COUNT-this.currentUser.time)
            let scores:user[]=this.scores$.getValue()
            if(scores!==null) scores.map(user=>{user.hl=false; return user})
            else scores=[]
            this.currentUser.hl=true
            scores.push(this.currentUser)
            if(scores.length>1)
              scores.sort((a,b)=>{
                let aa= a as user
                let bb=b as user
                return aa.diffTime-bb.diffTime
              })
            this.scores$.next(scores)
            break;
          case 'completed':
            localStorage.setItem("scores",JSON.stringify(this.scores$.getValue()));
            this.status='off'
            this.reset()
            break;
        }
      }
    });
  }
}
