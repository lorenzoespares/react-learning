import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// original class component
// class Square extends React.Component { 
//   render() {
//       return (
//         <button 
//           className="square" 
//           onClick={() => this.props.onClick()}
//         >
//           {this.props.value}
//         </button>
//       );
//   }
// }

// new function component, since square does not keep track of its own state
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        />
    );
  }

  render() {
    const boardRows = [];
    let squareKey = 0;
    for (var i = 0; i < 3; i++) {
      var squareRows = [];
      for (var j = 0; j < 3; j++) {
        squareRows.push(this.renderSquare(squareKey));
        squareKey += 1;
      }
      boardRows.push(<div key={i} className="board-row">{squareRows}</div>)
    }
    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastColRowSelected: (0,0),
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedSquare: 0,
    };
  }

  handleClick(i) {
    console.log(i);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    this.setState({
      selectedSquare: i,
    })
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastColRowSelected: calculateColumnRow(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const selectedSquare = calculateColumnRow(this.state.selectedSquare);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ", " + step.lastColRowSelected :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}
                    style={selectedSquare === step.lastColRowSelected ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}
            >
              {desc}
            </button>
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateColumnRow(square){
  const columnRow = [
    "(1,1)",
    "(2,1)",
    "(3,1)",
    "(1,2)",
    "(2,2)",
    "(3,2)",
    "(1,3)",
    "(2,3)",
    "(3,3)"
  ]
  return columnRow[square];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i =0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  