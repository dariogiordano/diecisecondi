import { Component,AfterViewInit } from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {filter,merge, map} from 'rxjs/operators'
import { DeviceDetectorService } from 'ngx-device-detector';
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
  title : string = 'dieci secondi'
  status : string = "off"
  pressed : boolean = false
  dateStart : Date = new Date()
  isFullScreen : boolean = document.fullscreen
  diffInMs : number = 0
  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen 
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }
  ngAfterViewInit(){
    let fullscreen$:Observable<Event>;
    let down$:Observable<Event>;
    let up$:Observable<Event>;
    if(this.getIsMobile()===false)
    {
      fullscreen$=fromEvent(document,"fullscreenchange");
      up$=fromEvent(document.body, 'keyup');
      down$=fromEvent(document.body, 'keypress').pipe(merge(up$),filter((event:KeyboardEvent)=> event.type==="keyup" || event.which === 102 || event.which === 32));
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
        if( event.which === 102){
          this.status='off'
          this.fullScreen()
        }
        canChangeStatus=event.which === 32 && this.pressed===false
        if(this.pressed===false)
          this.pressed=true
      }
      else
      {
        let event:TouchEvent=e as TouchEvent;
        if(event.type==="touchend") return this.pressed=false;
        canChangeStatus=this.pressed===false;
        if(this.pressed===false)
        this.pressed=true
      }
      if(canChangeStatus ){ 
        switch (this.status){
          case 'off':
            this.status='on';
            this.dateStart=new Date();
            break;
          case 'on':
            this.status='completed';
            this.diffInMs =  new Date().getTime() - this.dateStart.getTime();
            break;
          case 'completed':
            this.status='off'
            break;
        }
      }
    });
  }
}
