import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../app/services/game.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  //For NextRound button
  isRoundWIn = false;

  //Constructor, dependency injection
  constructor(
    private gameService : GameService,
    ) { }

  //initialize the component
  ngOnInit(): void {
    this.gameService.currentRoundWinActive.subscribe(value => this.isRoundWIn = value);
  }


  //Reset game values
  onResetGame(){
    this.gameService.initNewGame();
    window.location.reload();
  }

}
