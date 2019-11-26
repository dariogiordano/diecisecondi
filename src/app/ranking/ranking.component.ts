import { Component, OnInit, Input } from '@angular/core';
import { user } from '../interfaces';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
@Input() scores:user[]
@Input() showHl:boolean
@Input() canDelete:boolean
@Input() onClick

  constructor() { }

  Click(i:number){


  }
  ngOnInit() {
  }

}
