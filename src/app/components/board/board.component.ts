import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Tile } from '../../../app/models/tile';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {

  constructor(private gameService : GameService) {

  }

  //Members for the board functions
  tiles:Tile[][];

  //Component initialization
  ngOnInit(): void {
    //Get the gameService tiles
    this.tiles=this.gameService.tiles;
    this.gameService.tilesActive.subscribe(value => this.tiles = value);
    this.gameService.initNewGame();
  }

  //Function called when user click on a collumn
  coinDropOn(col:any):boolean{
    let colIndex = this.tiles.indexOf(col);
    if(this.gameService.getAvailableCollumns().includes(colIndex)){
      return this.gameService.coinDrop(colIndex);
    }
  }


}
