import { Component,AfterViewInit ,ViewChild,ElementRef} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {filter,merge, map} from 'rxjs/operators'
import { DeviceDetectorService } from 'ngx-device-detector';
import {GameInfo} from './shared/models/gameInfo.model'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor( private deviceService: DeviceDetectorService) {
    this.getIsMobile();
  }
  public getIsMobile() {
    return this.deviceService.isMobile();
  }
 
  @ViewChild('usernameField', {static: true}) usernameField: ElementRef;
  title : string = 'dieci secondi'
  status : string = "off"
  pressed : boolean = false
  dateStart : Date = new Date()
  isFullScreen : boolean = document.fullscreen
  diffInMs : number = 0
  scores:Array<Object>=[]
  isLower=false
  gameInfo:GameInfo={username:null,score:null}
  error:boolean=false
  reset(){
    this.gameInfo.username=null;
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
  ngAfterViewInit(){
    
    if(localStorage.getItem("scores")!=undefined){
      this.scores=JSON.parse(localStorage.getItem("scores"));
    }
    let fullscreen$:Observable<Event>;
    let down$:Observable<Event>;
    let up$:Observable<Event>;
    if(this.getIsMobile()===false)
    {
      fullscreen$=fromEvent(document,"fullscreenchange");
      up$=fromEvent(document.body, 'keyup');
      down$=fromEvent(document.body, 'keypress').pipe(merge(up$),filter((event:KeyboardEvent)=> event.type==="keyup" || event.which === 102 || event.which === 13));
      fullscreen$.subscribe((e)=>{ this.isFullScreen=document.fullscreen})
    }
    else
    { this.isFullScreen=true;
      up$=fromEvent(document.body, 'touchend');
      down$=fromEvent(document.body, 'touchstart').pipe(merge(up$),map(e=>{
        return e
      }));
    }
    
    down$.subscribe((e:Event) => {
    
      let canChangeStatus=false;
      if(!this.getIsMobile())
      { 
        if(e.type==="keyup") return this.pressed=false;
        let event:KeyboardEvent=e as KeyboardEvent;
        event.stopPropagation();
        event.preventDefault();
        if( event.which === 102 && this.isFullScreen===false){
          this.status='off'
          this.fullScreen()
        }
        canChangeStatus=event.which === 13 && this.pressed===false
        if(this.pressed===false)
          this.pressed=true
      }
      else
      {
        let event:TouchEvent=e as TouchEvent;
        event.stopPropagation();
        event.preventDefault();
        if(event.type==="touchend") return this.pressed=false;
        canChangeStatus=this.pressed===false;
        if(this.pressed===false)
        this.pressed=true
      }
      if(canChangeStatus ){ 
        switch (this.status){
          case 'off':
           
            if(this.gameInfo.username===null || this.gameInfo.username==="" ){
              this.error=true;
            }else{
              this.error=false;
              this.status='on';
              this.dateStart=new Date();
            }
            break;
          case 'on':
            let newDate= new Date();
            this.status='completed';
            this.isLower=newDate.getTime() - this.dateStart.getTime()<15000
            console.log(this.isLower)
            this.diffInMs =this.isLower?15000-(newDate.getTime() - this.dateStart.getTime()): (newDate.getTime() - this.dateStart.getTime())-15000;
            break;
          case 'completed':
            this.status='off'
           this.reset()
           
            break;
        }
      }
    });
  }
}
