import { Component,AfterViewInit } from '@angular/core';
import {fromEvent} from 'rxjs';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'dieci secondi';
  status: string="off"
  pressed : boolean=false;
  dateStart:Date=new Date();
  isFullScreen=document.fullscreen;
  diffInMs:number = 0;
  fullScreen() {
    let elem = document.documentElement;
    let methodToBeInvoked = elem.requestFullscreen 
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }
  ngAfterViewInit(){

    let count$=fromEvent(document.body, 'keypress');
    let up$=fromEvent(document.body, 'keyup');
    let fullscreen$=fromEvent(document,"fullscreenchange");
    count$.subscribe((e:KeyboardEvent) => {
      console.log(e.which)
      if( e.which === 102){
        this.status='off'
        this.fullScreen();
      }
     if( e.which === 32 && this.pressed===false){
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
     }if(this.pressed===false)
      this.pressed=true;
    });
    up$.subscribe(()=>{ this.pressed=false})
    fullscreen$.subscribe((e)=>{ this.isFullScreen=document.fullscreen})
  }
}
