interface SPACESHIPS {
    SPACESHIP: SPACESHIP;
}

interface SPACESHIP {
    width: number;
    height: number;
    design: number[][];
}

interface VariablesObject  {
    cells: [];
    intervalTimer: number;
    boardHeight: number;
    boardWidth: number;
    gameBoard: number[][];
    interval: number;
    button: HTMLElement;
    x: number;
    y: number;
}

class GameOfLife {
    /*
     * Implement Game of Life
     * Rules: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
     * no jquery
     *
     ******
     * buttons:
     * start: start the game (when game is started button is disabled)
     * stop: stops the game (when game is stopped button is disabled)
     * reset: clear the board
     *
     */

    variablesObject: VariablesObject = {
        cells: [],   // array of all the cell DOM items, used for UI manipulation. TODO: Implement (hint: research how to select elements with javascript)

        intervalTimer: 500, // how often does a game tick happen. TODO: make this customisable from the UI (dropdown, slider, etc.) e.g. SLOW, NORMAL, FAST
        
        boardHeight: 50, // number of cells verticaly
        boardWidth: 50, // number of cells horizontaly 
        gameBoard: [[]], // 2d array that represents the game board, used for logic. TODO: Implement
        interval: null,
        button: null,
        x: null,
        y: null,
    }
        
    SPACESHIPS: {
        GLIDER:  {
            width: 3,
            height: 3,
            design: [
                [0, 1, 0],
                [0, 0, 1],
                [1, 1, 1]
            ]
        };
        
        LWSS: {
            width: 5,
            height: 4,
            design: [
                [0, 1, 0, 0, 1],
                [1, 0, 0, 0, 0],
                [1, 0, 0, 0, 1],
                [1, 1, 1, 1, 0]
            ]
        };
        
        MWSS: {
            width: 6,
            height: 5,
            design: [
                [0, 0, 0, 1, 0, 0],
                [0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 0]
            ]
        };
        
        HWSS: {
            width: 7,
            height: 5,
            design: [
                [0, 0, 0, 1, 1, 0, 0],
                [0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 0]
            ]
        }; 
    }

    constructor(button: HTMLElement) {
        this.variablesObject.button = button;
        this.variablesObject.button.addEventListener("click", this.gameBoardCreation.bind(this));    }


    /*
     * This is the game init function. It adds an integer value to the id attribute of all the given elements.
     * TODO: It should add click handling for every given cell
     */

    generateTable (): void {
        let divToAppend = document.getElementById("table");
        let table = document.createElement("table");

        for (let i = 0; i < this.variablesObject.boardHeight; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < this.variablesObject.boardWidth; j++) {
                let cell = document.createElement("td");
                cell.className = "cell";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        divToAppend.appendChild(table);
        table.classList.add("gameboard");
    }

    setupGameBoard (cells: NodeListOf<Element>): void {
        let counter = 0;
        cells.forEach(function(cell) {
            cell.id = (counter++).toString();
            
            cell.addEventListener("click", this.onCellClick.bind(this));
        });
    }

    /*
     * This function initialises the game board. It sets up the 2d array and prefills it with 0.
     */
    initGameBoard (boardHeight: number, boardWidth: number): number[][] {  
        let array = new Array(boardHeight);
        for (let i=0; i<array.length; i++) {
            array[i] = new Array(boardWidth);
        }
        return array;    
    }
    
    setUpGrid (): void {
        this.variablesObject.gameBoard = this.initGameBoard(this.variablesObject.boardHeight, this.variablesObject.boardWidth);
        for(let i=0; i<this.variablesObject.boardHeight; i++) {
            for(let j=0; j<this.variablesObject.boardWidth; j++){
                this.variablesObject.gameBoard[i][j] = 0;
            }
        }
    }
    // Callback that is called when a single cell is clicked.
    onCellClick(event: Event): void {
        // If empty cell is clicked it gets the 'active' class, if a full cell is clicked the 'active' class is removed
        // ...
        console.log(event);
        let cellNumber = parseInt((event.target as HTMLElement).id);
        this.variablesObject.x = cellNumber % this.variablesObject.boardWidth;
        this.variablesObject.y = Math.floor(cellNumber / this.variablesObject.boardWidth);
        if (!(event.target as HTMLElement).classList.contains("active")) {
            (event.target as HTMLElement).classList.add("active");
            this.variablesObject.gameBoard[this.variablesObject.y][this.variablesObject.x] = 1;
        } else {
            (event.target as HTMLElement).classList.remove("active");
            this.variablesObject.gameBoard[this.variablesObject.y][this.variablesObject.x] = 0;
        } 
        
        this.handleSpaceShips();
        
    }

    startGame (): void {
        // start the game
        // set an interval that runs every 'intervalTimer' milliseconds.
        this.variablesObject.interval = setInterval(function() {            
            this.tick();
        }, this.variablesObject.intervalTimer);
    }

    // Callback that is called on every game tick.
    tick (): void {

        // Compute next
        let next = this.initGameBoard(this.variablesObject.boardHeight, this.variablesObject.boardWidth);
        for (let i = 0; i < this.variablesObject.boardHeight; i++) {
            for (let j = 0; j < this.variablesObject.boardWidth; j++) {
                let state = this.variablesObject.gameBoard[i][j];
                // Count live neighbors!
                let neighbors = countNeighbors(this.variablesObject.gameBoard, i, j);

                if (state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        
        this.variablesObject.gameBoard = next;

        function countNeighbors(gameBoard: number[][], x: number, y: number): number {
            let sum = 0;
            for (let i = -1; i < 2; i++) {
              for (let j = -1; j < 2; j++) {
                let col = (x + i + this.boardHeight) % this.boardHeight;
                let row = (y + j + this.boardWidth) % this.boardWidth;
                sum += gameBoard[col][row];
              }
            }
            sum -= this.gameBoard[x][y];
            return sum;
        }

        // Draw
        for (let i = 0; i < this.variablesObject.boardHeight; i++) {
            for (let j = 0; j < this.variablesObject.boardWidth; j++) {
                let cell = document.getElementById(`${j+i* this.variablesObject.boardWidth}`);
                if (this.variablesObject.gameBoard[i][j] == 1) {
                    if (!cell.classList.contains("active")) {
                        cell.classList.add("active");
                  } 
                  } else if (this.variablesObject.gameBoard[i][j] == 0) {
                      cell.classList.remove("active");
                  }
              }
          }
    }

    gameBoardCreation (): void {
    // ...
        document.getElementById("table").innerHTML= "";
        this.variablesObject.boardHeight = parseInt((document.getElementById("boardHeight") as HTMLInputElement).value) 
        this.variablesObject.boardWidth = parseInt((document.getElementById("boardWidth") as HTMLInputElement).value);  
        this.handleIntervalTimer();
        this.generateTable();
        event.preventDefault();
        let cells = document.querySelectorAll(".cell");
        this.setupGameBoard(cells);
        this.setUpGrid();
    }

    onGameStart (): void {
        // ...
        let button = document.getElementById("Start");

        // var self = this;
        
        let startGame = function () {
            console.log(this);

            this.startGame();
            this.setGameIndicator(true);
            //button.disabled = true;
        }.bind(this);

        button.addEventListener("click", startGame);
    }

    onGameStop(): void {
        // ...
        let stop = () => {
            clearInterval(this.variablesObject.interval);
            this.setGameIndicator(false);
        }

        let button = document.getElementById("Stop");
        button.addEventListener("click", stop);
    }

    onGameReset(): void {
        // ...

        let resetGame = function () {
            this.setUpGrid();
            this.tick();
            this.setGameIndicator(false);
        }.bind(this);

        let button = document.getElementById("Reset");
        button.addEventListener("click", resetGame);
    }


    handleIntervalTimer (): void {

        let dropdown = window.document.getElementById("Dropdown");

        let onHandleIntevalTimer = (dropdown) => {
            if (dropdown.options[dropdown.selectedIndex].text === "Slow") {
                this.variablesObject.intervalTimer = 1000;
            } else if (dropdown.options[dropdown.selectedIndex].text === "Normal") {
                this.variablesObject.intervalTimer = 500;
            } else if (dropdown.options[dropdown.selectedIndex].text === "Fast") {
                this.variablesObject.intervalTimer = 250;
            }
        }

        dropdown.addEventListener("change", onHandleIntevalTimer, false);
    }

    handleSpaceShips (): void {
        let dropdown = document.getElementById("dropDown2") as HTMLSelectElement;
            if (dropdown.options[dropdown.selectedIndex].text === "Glider") {
                this.createForm(this.variablesObject.x, this.variablesObject.y, this.SPACESHIPS.GLIDER, true);
                this.removeClickedCell();
            } else if (dropdown.options[dropdown.selectedIndex].text === "LWSS") {
                this.createForm(this.variablesObject.x, this.variablesObject.y, this.SPACESHIPS.LWSS, true);
                this.removeClickedCell();
            } else if (dropdown.options[dropdown.selectedIndex].text === "MWSS") {
                this.createForm(this.variablesObject.x, this.variablesObject.y, this.SPACESHIPS.MWSS, true);
                this.removeClickedCell();
            } else if (dropdown.options[dropdown.selectedIndex].text === "HWSS") {
                this.createForm(this.variablesObject.x, this.variablesObject.y, this.SPACESHIPS.HWSS, true);
                this.removeClickedCell();
            }
    }
   
    createForm(x: number, y:number, shape: SPACESHIP, condition:boolean): void {
        if(condition) {
        for (let i = 0; i < shape.height; i++) {
            for (let j = 0; j < shape.width; j++) {
                let cell = document.getElementById(((j+this.variablesObject.x)+(i+this.variablesObject.y)*this.variablesObject.boardWidth).toString());
                    if (shape.design[i][j] == 1) {
                        if (!cell.classList.contains("active")) {
                            cell.classList.add("active");
                            this.variablesObject.gameBoard[i+y][j+x]=1;
                        }   
                    }
                }
            } 
        }   
    }

    defaultGameBoardCreation(): void {
        // ... 
            this.handleIntervalTimer();
            this.generateTable();
            let cells = document.querySelectorAll(".cell");
            this.setupGameBoard(cells);
            this.setUpGrid();
        }

    setGameIndicator(status: boolean): void {
        if (status) {
            let ledlight = document.getElementById("led");
            ledlight.classList.remove("led-red");
            ledlight.classList.add("led-green");
        } else {
            let ledlight = document.getElementById("led");
            ledlight.classList.remove("led-green");
            ledlight.classList.add("led-red");
        }
    } 

    removeClickedCell (): void {
        if (this.variablesObject.gameBoard[this.variablesObject.y][this.variablesObject.x] == 1) {
            let cell = document.getElementById(((this.variablesObject.x)+(this.variablesObject.y)* this.variablesObject.boardWidth).toString());
            cell.classList.remove("active")
            this.variablesObject.gameBoard[this.variablesObject.y][this.variablesObject.x] = 0;
        }
    }
    
};

/////////////////////////////////////
    
    var button = document.getElementById("resizeGameboard");
    
    const gameOfLife = new GameOfLife(button);
    
    gameOfLife.defaultGameBoardCreation;
    
    gameOfLife.onGameStart;
    
    gameOfLife.onGameReset;
    
    gameOfLife.onGameStop;
