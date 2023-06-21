import { useContext, memo } from "react";

import { BoardContext } from "../Context/BoardContext";

import "../CSS/Slot.css";

const Slot = ({ index, pos, fill = false, fillType = 'img' }) => {
    const {
        empty, setEmpty,
        board, setBoard,
        selected, setSelected,
        setMoves
    } = useContext(BoardContext);
    const [row, col] = [index / 7 | 0, index % 7]

    const activateSlots = () => {
        if (empty === 0) {
            const cloneBoard = [...board]
            cloneBoard[row][col].fill = false
            setBoard(cloneBoard)
            setEmpty(e => e === 0 ? 1 : e)
            setMoves(e => ([...e, { from: -1, to: -1, take: index }]))
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

    const makeMove = () => {
        const cloneBoard = [...board]
        const [fRow, fCol] = [selected.ball / 7 | 0, selected.ball % 7]
        var [mRow, mCol] = [(row + fRow) / 2, (col + fCol) / 2]

        cloneBoard[row][col].fill = true
        cloneBoard[mRow][mCol].fill = false
        cloneBoard[fRow][fCol].fill = false

        setMoves(e => ([...e, {
            from: selected.ball,
            to: index,
            take: cloneBoard[mRow][mCol].i
        }]))
        setSelected({ ball: -1, choise: [] })
        setEmpty(e => e + 1)
        setBoard(cloneBoard)
    }

    // console.log("Rendering Slot", pos);

    return (pos < 0 ? <figure className={`slot none`} /> : fill ? <figure
        onClick={activateSlots}
        className={`slot ${fillType} ${selected.ball === index}`}
    >
        {fillType === 'img' ? <img src="./assets/ball.png" alt="" /> : ""}
        <span>{pos}</span>
    </figure> : selected.choise.includes(pos) ? <figure
        className={`slot empty true`}
        onClick={makeMove}
    >
        <span>{pos}</span>
    </figure> : <figure className={`slot empty false`}>
        <span>{pos}</span>
    </figure>
    )
};

export default memo(Slot);