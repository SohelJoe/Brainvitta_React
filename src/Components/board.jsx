import { useContext, useMemo } from "react";

import { BoardContext } from "../Context/BoardContext";

import Slot from "./slot";

import '../CSS/Board.css'

const Board = () => {
    const { board, setBoard, setSelected, empty, setEmpty, moves, setMoves } = useContext(BoardContext);

    const undoLastMove = () => {
        const { to, from, take } = moves[moves.length - 1]
        const cloneBoard = [...board]

        const [mRow, mCol] = [take / 7 | 0, take % 7]
        cloneBoard[mRow][mCol].fill = true

        if (to > -1 && from > -1) {
            const [fRow, fCol] = [from / 7 | 0, from % 7]
            const [lRow, lCol] = [to / 7 | 0, to % 7]

            cloneBoard[fRow][fCol].fill = true
            cloneBoard[lRow][lCol].fill = false
        }

        setMoves(e => (e.slice(0, -1)))
        setSelected({ ball: -1, choise: [] })
        setEmpty(e => e - 1)
        setBoard(cloneBoard)
    }

    const isGameOver = useMemo(() => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (board[i][j].pos > 0) {
                    const mvIndex = [
                        [[i, j + 1], [i, j + 2]],
                        [[i + 1, j], [i + 2, j]],
                    ]

                    for (let idx = 0; idx < mvIndex.length; idx++) {
                        const [one, two] = mvIndex[idx];

                        if (board[i][j].fill) {
                            if (board[one[0]][one[1]].fill && !board[two[0]][two[1]].fill) {
                                return false
                            }
                        } else {
                            if (board[one[0]][one[1]].fill && board[two[0]][two[1]].fill) {
                                return false
                            }
                        }
                    }
                }
            }
        }

        return true
    }, [board])

    return <div className="container">
        <div className="board">
            {board && board.map((row, i) => {
                return <div key={i} className="row">
                    {row.map((item, j) => {
                        return <Slot key={j} index={item.i} pos={item.pos} fill={item.fill} />
                    })}
                </div>
            })}
        </div>
        <div className='bottomPanel'>
            <h4>Ball: {33 - empty} | Blank: {empty} {isGameOver && "| Game Over"}</h4>
            <div className="btnGrp">
                <button onClick={() => console.log(JSON.stringify(moves, null, 4))}>Moves</button>
                <button onClick={undoLastMove} disabled={empty < 1}>Undo</button>
            </div>
        </div>
    </div>;
};

export default Board;