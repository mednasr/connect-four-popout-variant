import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ColorService } from './color.service';
import {Tile} from '../models/tile';
import { Store } from '@ngxs/store';

@Injectable()
export class GameService{
  //Inject services and store
  constructor(private colorService: ColorService,private store: Store) { }

  //Maximum nummber of collumns
  maxCols = 7;
  //Maximum nummber of lines
  maxLines = 6;

  //The game tiles
  tiles:Tile[][];
  public tilesSubject: Subject<Tile[][]> = new BehaviorSubject<Tile[][]>([]);
  public tilesActive = this.tilesSubject.asObservable();


  //Player's scores
  player1Score:number;
  public player1ScoreSubject: Subject<number> = new BehaviorSubject<number>(0);
  player2Score:number;
  public player2ScoreSubject: Subject<number> = new BehaviorSubject<number>(0);

  //The current player playing
  playerPlaying = 1;
  //The current round
  currentRoundWin=false;
  public currentRoundWinSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public currentRoundWinActive = this.currentRoundWinSubject.asObservable();

  //Initialize white tiles
  clearTiles(){
    this.tiles = [];
    //Init game tiles
    for (let colIndex = 0; colIndex < this.maxCols; colIndex++) {
      this.tiles[colIndex] = [];
      for (let lineIndex = 0; lineIndex < this.maxLines; lineIndex++) {
        this.tiles[colIndex][lineIndex]= new Tile(this.colorService.DEFAULT_COLOR);
      }
    }
    this.tilesSubject.next(this.tiles);
  }
  //Game initialization
  initNewGame(){
    //Clear tiles
    this.clearTiles();
    //Init players
    let idFirstPlayer = 1;
    this.playerPlaying=idFirstPlayer;

    //Notify listeners
    this.tilesSubject.next(this.tiles);
    this.player1Score=0;
    this.player2Score=0;
    this.player1ScoreSubject.next(this.player1Score);
    this.player2ScoreSubject.next(this.player1Score);
  }
  //New round initialization
  initNewRound(){
    //Clear tiles
    this.clearTiles();
    this.playerPlaying=1;
  }
  //Analyse if the game is win or not by the last player
  isGameWin():boolean{
    //Fetch all win conditions and return true if game is win
    if(this.fetchXY()){
      //Update players's score
      if(this.playerPlaying==1){
        this.player1Score=this.player1Score+1;
        this.player1ScoreSubject.next(this.player1Score);
      }
      else{
        this.player2Score=this.player2Score+1;
        this.player2ScoreSubject.next(this.player2Score);
      }
      //Update current round
      return true;
    }
    //No winner this trun and match not null
    if(this.getAvailableCollumns().length!=0){
      if(this.playerPlaying == 1){
        this.playerPlaying=2;
      }
      else{
        this.playerPlaying=1;
      }
      return false;
    }
    //Match null
    else{
      this.currentRoundWinSubject.next(true);
    }
    return false;
  }
  //The function to drop a coin in the board
  coinDrop(col:number):boolean{
    if(!this.currentRoundWin){
      if(col<this.maxCols && col>=0){
        //Get the player  color
        let playerColorClass = this.colorService.getPlayerColor(this.playerPlaying)
        //Search for the line to set the color
        let line = 0;
        let popout = <HTMLInputElement> document.getElementById("isCheckBox");

        for (let tile of this.tiles[col]) {
          if( (tile.color==this.colorService.DEFAULT_COLOR) && (popout.checked == false)){
            tile.color=playerColorClass;
            break;
          } else if(tile.color !== this.colorService.DEFAULT_COLOR){
if(line == 0)
{
  if ( (popout.checked) && (tile.color == this.colorService.getPlayerColor(this.playerPlaying)))
  {
    tile.color=this.colorService.DEFAULT_COLOR;
      this.tiles[col][0] = this.tiles[col][1];
      this.tiles[col][1] = this.tiles[col][2];
      this.tiles[col][2] = this.tiles[col][3];
      this.tiles[col][3] = this.tiles[col][4];
    this.tiles[col][4] = this.tiles[col][5];
  }
}}
          if(line+1==6){
            break;
          }
          line--;
        }
        this.tilesSubject.next(this.tiles);
        //Return if the game is win this turn
        return this.isGameWin();
      }
      else{
        return false;
      }
    }
    return true;
  }
  //Return an array of all available columns
  getAvailableCollumns(){
    //Return variable
    let columnsAvailable=[];

    //Iterate on columns
    for (let colIndex = 0; colIndex < this.maxCols; colIndex++) {
      let columnAvailable = false;
      //Iterate on lines
      for (let lineIndex = 0; lineIndex < this.maxLines; lineIndex++) {
        if(!columnAvailable && this.tiles[colIndex][lineIndex].color==this.colorService.DEFAULT_COLOR){
          columnAvailable = true;
          columnsAvailable.push(colIndex);
        }
      }
    }
    return columnsAvailable;
  }
  //Iterate and check the win conditions in the actual board for the given player
  fetchXY():boolean{
    //TODO rework this for only check the played s and not the whole board each time
    let playerColor = this.colorService.getPlayerColor(this.playerPlaying);
    //All directions to fetch for
    let directions = [[1,0], [1,-1], [1,1], [0,1]];
    //is win check
    let isWin = false;

    for (let dir of directions) {
      //Getting current directions
      let dCol = dir[0];
      let dLine = dir[1];
      //Iterate on the collumns
      for (let colIndex = 0; colIndex < this.maxCols; colIndex++) {
        //Iterate on the lines
        for (let lineIndex = 0; lineIndex < this.maxLines; lineIndex++) {
          //Getting the last col and line indexes
          let lastCol = colIndex + 3*dCol;
          let lastLine = lineIndex + 3*dLine;
          //Checking if we are not out of limits
          if (0 <= lastCol && lastCol < this.maxCols && 0 <= lastLine && lastLine < this.maxLines) {
            //Check if we are not on an empty  and if so, check the near s for win condition
            if (playerColor != this.colorService.DEFAULT_COLOR
              && playerColor == this.tiles[colIndex][lineIndex].color
              && playerColor == this.tiles[colIndex+dCol][lineIndex+dLine].color
              && playerColor == this.tiles[colIndex+2*dCol][lineIndex+2*dLine].color
              && playerColor == this.tiles[lastCol][lastLine].color) {
                this.tiles[colIndex][lineIndex].color+=this.colorService.COLOR_WIN;
                this.tiles[colIndex+dCol][lineIndex+dLine].color+=this.colorService.COLOR_WIN;
                this.tiles[colIndex+2*dCol][lineIndex+2*dLine].color+=this.colorService.COLOR_WIN;
                this.tiles[lastCol][lastLine].color+=this.colorService.COLOR_WIN;
                //Game is win by the player
                isWin = true;
            }
          }
        }
      }
    }
    //Return win
    return isWin
  }
}
