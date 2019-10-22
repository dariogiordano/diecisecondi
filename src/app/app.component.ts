import { Component,AfterViewInit } from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
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
  isMobile : boolean=false;
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
    let count$:Observable<Event>;
    let up$:Observable<Event>;
    if(this.getIsMobile()===false)
    {
     
      fullscreen$=fromEvent(document,"fullscreenchange");
      count$=fromEvent(document.body, 'keypress');
      up$=fromEvent(document.body, 'keyup');
      up$.subscribe(()=>{ this.pressed=false})
      fullscreen$.subscribe((e)=>{ this.isFullScreen=document.fullscreen})
    }
    else
    { this.isFullScreen=true;
      count$=fromEvent(document.body, 'mouseclick');
    }
    
    count$.subscribe((e:Event) => {
      let canChangeStatus=false;
      if(!this.getIsMobile())
      {
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
        canChangeStatus=true;
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
