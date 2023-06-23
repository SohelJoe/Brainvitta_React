import { useState } from "react";

import Slot from "./slot";

import '../CSS/Board.css'

const Board = () => {
    const [selected, setSelected] = useState({ ball: -1, choise: [] })
    const [moves, setMoves] = useState({ count: 0, steps: [] });
    const [gameOver, setGameOver] = useState(false)
    const [board, setBoard] = useState(() => {
        const boardSize = 7
        const boardStructure = []
        var emptyCount = 0

        for (var i = 0; i < boardSize; i++) {
            const rowStructure = []

            for (var j = 0; j < boardSize; j++) {
                const index = (boardSize * i) + j
                if ([0, 1, 5, 6].includes(i) && [0, 1, 5, 6].includes(j)) {
                    rowStructure.push({ i: index, pos: -1, fill: false })
                    emptyCount += 1
                } else {
                    rowStructure.push({ i: index, pos: index - emptyCount, fill: true })
                }
            }

            boardStructure.push(rowStructure)
        }

        return boardStructure
    });

    const activateSlots = (index, row, col) => {
        if (moves.count === 0) {
            const cloneBoard = [...board]
            cloneBoard[row][col].fill = false
            setBoard(cloneBoard)
            setGameOver(isGameOver())
            setMoves({
                count: 1,
                steps: [{ from: -1, to: -1, take: index }]
            })
        } else {
            const choise = []
            const mvIndex = [
                [[row, col - 1], [row, col - 2]],
                [[row, col + 1], [row, col + 2]],
                [[row - 1, col], [row - 2, col]],
                [[row + 1, col], [row + 2, col]],
            ]

            mvIndex.forEach(move => {
                const [one, two] = move
                if (typeof board[two[0]] !== 'undefined' && typeof board[two[0]][two[1]] !== 'undefined') {
                    if (board[two[0]][two[1]].pos > 0 && !board[two[0]][two[1]].fill && board[one[0]][one[1]].fill) {
                        choise.push(board[two[0]][two[1]].pos)
                    }
                }
            });

            setSelected({ ball: index, choise: choise })
        }
    }

    const makeMove = (index, row, col) => {
        const cloneBoard = [...board]
        const [fRow, fCol] = [selected.ball / 7 | 0, selected.ball % 7]
        var [mRow, mCol] = [(row + fRow) / 2, (col + fCol) / 2]

        cloneBoard[row][col].fill = true
        cloneBoard[mRow][mCol].fill = false
        cloneBoard[fRow][fCol].fill = false

        setMoves(e => ({
            count: e.count + 1,
            steps: [...e.steps, {
                from: selected.ball,
                to: index,
                take: cloneBoard[mRow][mCol].i
            }]
        }))
        setSelected({ ball: -1, choise: [] })
        setBoard(cloneBoard)
        setGameOver(isGameOver())
    }

    const undoLastMove = () => {
        const { to, from, take } = moves.steps[moves.count - 1]
        const cloneBoard = [...board]

        const [mRow, mCol] = [take / 7 | 0, take % 7]
        cloneBoard[mRow][mCol].fill = true

        if (to > -1 && from > -1) {
            const [fRow, fCol] = [from / 7 | 0, from % 7]
            const [lRow, lCol] = [to / 7 | 0, to % 7]

            cloneBoard[fRow][fCol].fill = true
            cloneBoard[lRow][lCol].fill = false
        }

        setMoves(e => ({
            count: e.count - 1,
            steps: [...e.steps.slice(0, -1)]
        }))
        setSelected({ ball: -1, choise: [] })
        setBoard(cloneBoard)
    }

    const isGameOver = () => {
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
    }

    return <div className="container">
        <div className="board">
            {board && board.map((row, i) => {
                return <div key={i} className="row">
                    {row.map((item, j) => <Slot
                        key={j}
                        data={item}
                        makeMove={makeMove}
                        activateSlots={activateSlots}
                        active={selected.ball === item.i}
                        moveSlot={selected.choise.includes(item.pos)}
                    />)}
                </div>
            })}
        </div>

        <div className='bottomPanel'>
            <h4>Ball: {33 - moves.count} | Blank: {moves.count} {gameOver && "| Game Over"}</h4>
            <div className="btnGrp">
                <button onClick={() => console.log(JSON.stringify(moves, null, 4))}>Moves</button>
                <button onClick={undoLastMove} disabled={moves.count < 1}>Undo</button>
            </div>
        </div>
    </div>;
};

export default Board;