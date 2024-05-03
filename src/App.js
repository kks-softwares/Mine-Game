import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './App.css';
import { BiSolidBomb } from "react-icons/bi";
import { RiVipDiamondFill } from "react-icons/ri";

function App() {
  const [show, setShow] = useState(false);
  const [showGameWin, setShowGameWin] = useState(false);
  const [gamePlayFradient, setGamePlayFradient] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseGameWin = () => setShowGameWin(false);

  const [mines, setMines] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cashout, setCashout] = useState(false);

  const generateTilesArray = (mines) => {
    const totalTiles = 25;
    const bombPositions = new Set();
    while (bombPositions.size < mines) {
      bombPositions.add(Math.floor(Math.random() * totalTiles));
    }

    return Array.from({ length: totalTiles }, (_, index) => ({
      id: index + 1,
      label: 'Covered',
      isBomb: bombPositions.has(index),
      isRevealed: false,
    }));
  };

  const [tilesArray, setTilesArray] = useState(generateTilesArray(mines));

  const handleChangeMines = (e) => {
    const value = parseInt(e.target.value);
    setMines(value);
    setTilesArray(generateTilesArray(value));
  };

  const handleTileClick = (id) => {
    if (!gameStarted || gameOver || gameWon) return;

    const updatedTilesArray = tilesArray.map(tile => {
      if (tile.id === id) {
        if (tile.isBomb) {
          tile.className = 'explodedBomb';
          setGameOver(true);
          setShow(true);
        } else {
          const revealedTiles = tilesArray.filter(tile => tile.isRevealed);
          const nonBombTiles = tilesArray.filter(tile => !tile.isBomb);
          if (revealedTiles.length === nonBombTiles.length - 1) {
            setGameWon(true);
          }
          setCashout(true);
        }
        return { ...tile, label: tile.isBomb ? <BiSolidBomb style={{ fontSize: 40, color: 'gray' }} /> : <RiVipDiamondFill style={{ fontSize: 40, color: '#89ef89' }} />, isRevealed: true };
      }
      return tile;
    });
    updatedTilesArray[id - 1].isActive = !updatedTilesArray[id - 1].isActive;
    
    setTilesArray(updatedTilesArray);
  };


  const handlePlay = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setCashout(false);
    setGamePlayFradient(true);
    setTilesArray(generateTilesArray(mines));
  };

  const handleCashout = () => {
    setGameWon(true);
    setShowGameWin(true);
  };

  return (
    <div className="container">
      <div className="tower-page m-4 mb-0">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4">
            <div className="tower-body">
              <div className='tower-bet-box' style={{ color: '#fff' }}>
                <p className="mines-label">{mines} Mines</p>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={mines}
                  className="mines-range form-range mt-1 mb-4"
                  onChange={handleChangeMines}
                />
                {cashout ? (
                  <button className={`play-btn ${cashout && 'CASHOUT-css'} mt-2`} onClick={handleCashout}>CASHOUT </button>
                ) : (
                  <button className={`play-btn ${cashout && 'CASHOUT-css'} mt-2`} onClick={handlePlay} disabled={gameStarted && !gameOver}>
                    <span className='play-text'>{gameStarted ? (cashout ? 'CASHOUT' : 'Pick A Tile') : 'PLAY'}</span>
                    <span className='auto-mode-icon' style={{ color: 'gray' }}>
                      <img src='/auto-play.png' alt='auto-play' height="36px" />
                    </span>
                  </button>
                )}

                <button class="custom-button mt-4 p-1">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span class="left">-</span>
                    <span class="left left-min mt-2">MIN</span>
                  </div>
                  <div className='mt-2'><h6>0.25</h6><h6 className='stake-text'>STAKE</h6></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span class="right">+</span>
                    <span class="right right-min mt-2">MAX</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-8">
            <div className='tower-game-section mines-game' style={{ color: '#fff' }}>
              <h5 className='text-center'>Max Payout : x24.50</h5>
              <div className="rowaside">
                {tilesArray.map((item,index) => (
                  <div className="columnaside mt-2" key={item.id}>
                    <div className={`diamond-tiles ${gameStarted && gamePlayFradient ? 'tile-gradient' : ''} ${item.isRevealed && !item.isBomb ? 'greenDiamond' : ''} ${item.isBomb && item.className ? item.className : ''}`}  onClick={() => handleTileClick(item.id)}>
                      {item.isRevealed ? item.label : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <Modal show={show} onHide={handleClose} size="sm" centered aria-labelledby="contained-modal-title-vcenter">
          <div className='mines-winner-loss'>
            <div className='mines-winner-grid'>
              <p style={{ color: '#fff' }}>YOU LOST!</p>
            </div>
          </div>
        </Modal>

        <Modal show={showGameWin} onHide={handleCloseGameWin} size="sm" centered aria-labelledby="contained-modal-title-vcenter">
          <div className='mines-winner-loss'>
            <div className='mines-winner-grid'>
              <p style={{ color: '#fff' }}>YOU WIN</p>
            </div>
          </div>
        </Modal>
      </>
    </div>
  );
}

export default App;