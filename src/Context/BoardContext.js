import { useState, createContext } from "react";

export const BoardContext = createContext();

export default function BoardState(props) {
    const [selected, setSelected] = useState({ ball: -1, choise: [] })
    const [moves, setMoves] = useState([]);
    const [empty, setEmpty] = useState(0);
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


    return (
        <BoardContext.Provider value={{ board, setBoard, empty, setEmpty, selected, setSelected, moves, setMoves }}>
            {props.children}
        </BoardContext.Provider>
    )
}
