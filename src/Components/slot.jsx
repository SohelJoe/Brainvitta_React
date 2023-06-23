import { memo } from "react";

import "../CSS/Slot.css";

const Slot = ({ data, activateSlots, makeMove, active, moveSlot }) => {
    const { i: index, pos, fill = false } = data
    const [row, col] = [index / 7 | 0, index % 7]

    // console.log("Rendering Slot", pos);

    return (pos < 0 ? <figure className={`slot none`} /> : fill ? <figure
        className={`slot ${active}`}
        onClick={() => activateSlots(index, row, col)}
    >
        <img src="./assets/ball.png" alt="" />
        <span>{pos}</span>
    </figure> : <figure
        className={`slot empty ${moveSlot}`}
        onClick={() => moveSlot && makeMove(index, row, col)}
    > <span>{pos}</span> </figure>)
};

export default memo(Slot);