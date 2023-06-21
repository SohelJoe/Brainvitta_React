import BoardState from './Context/BoardContext';

import Board from './Components/board';

import './CSS/App.css';

function App() {
  return (
    <div className="App">
      <BoardState>
        <main>
          <Board />
        </main>
      </BoardState>
    </div>
  );
}

export default App;
