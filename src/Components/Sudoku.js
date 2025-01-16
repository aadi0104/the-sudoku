import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sudoku({ change, changeFalse, reset, handleReset }) {
    const [board, setBoard] = useState(
        Array(9).fill(null).map(() => Array(9).fill(''))
    );
    const [initialBoard, setInitialBoard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const puzzle = data?.newboard?.grids?.[0]?.value || Array(9).fill(null).map(() => Array(9).fill(0));

                setBoard(puzzle);
                setInitialBoard(JSON.parse(JSON.stringify(puzzle)));

            } catch (error) {
                console.error('Error fetching puzzle:', error);
                const fallbackPuzzle = Array(9).fill(null).map(() => Array(9).fill(0));
                setBoard(fallbackPuzzle);
                setInitialBoard(JSON.parse(JSON.stringify(fallbackPuzzle)));
            }
        };
        fetchPuzzle();
        changeFalse();
    }, [change]);

    useEffect(() => {
        if (reset) {
            setBoard(JSON.parse(JSON.stringify(initialBoard)));
            handleReset(false);
            setCurrValue(0);
        }
    }, [reset, initialBoard, handleReset]);

    const isSafe = (board, row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (board[r][c] === num) {
                    return false;
                }
            }
        }

        return true;
    };

    const handleCellClick = (row, col) => {
        if (initialBoard?.[row]?.[col] !== 0) return;

        const currentCellValue = board[row][col];
        if (currentCellValue !== 0 && currentCellValue !== '') {
            const updatedBoard = [...board];
            updatedBoard[row][col] = '';
            setBoard(updatedBoard);
        } else {
            if (currValue !== 0) {
                if (!isSafe(board, row, col, currValue)) {
                    toast.error('This value conflicts with another in the row, column, or 3x3 grid!');
                    return;
                }
                const updatedBoard = [...board];
                updatedBoard[row][col] = currValue;
                setBoard(updatedBoard);
            }
        }
    };

    const rows = [];
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const cells = [];
        for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
            cells.push(
                <span
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => { handleCellClick(rowIndex, colIndex) }}
                    className={`sudoku-cell ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'bottom-border' : ''} ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'right-border' : ''}`}
                    style={{
                        backgroundColor: initialBoard?.[rowIndex]?.[colIndex] === 0 ? '#fff' : 'rgb(137, 194, 231)',
                        cursor: initialBoard?.[rowIndex]?.[colIndex] === 0 ? 'pointer' : 'not-allowed',
                    }}
                    maxLength={1}
                >
                    {board[rowIndex][colIndex] === 0 ? '' : board[rowIndex][colIndex]}
                </span>
            );
        }
        rows.push(
            <div key={rowIndex} className="sudoku-row">
                {cells}
            </div>
        );
    }

    const [currValue, setCurrValue] = useState(null);

    const number_buttons = [];
    for (let i = 0; i < 9; i++) {
        number_buttons.push(
            <p key={i} className={`sudoku-cell ${currValue === i + 1 ? 'selected-number' : ''}`} onClick={() => setCurrValue(i + 1)}>
                {i + 1}
            </p>
        );
    }

    const handleGetSolution = () => {
        navigate("/the-sudoku/getsolution", { state: { initialBoard } });
    }

    return (
        <>
            <div>{rows}</div>
            <div className="number-buttons">
                <div className="sudoku-row">{number_buttons}</div>
            </div>
            <div>
                <button className="get-the-solution" onClick={() => handleGetSolution()}>
                    Get the Solution?
                </button>
            </div>
            <ToastContainer />
        </>
    );
}

export default Sudoku;