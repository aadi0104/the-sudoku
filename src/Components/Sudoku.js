import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Sudoku({ change, fetched, changeFalse, reset, handleReset, pauseTimer }) {
    const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
    const [initialBoard, setInitialBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(0)));
    const [currValue, setCurrValue] = useState(null);
    const [isGameWon, setIsGameWon] = useState(false);
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
                fetched(true);
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
            setCurrValue(null);
            setIsGameWon(false);
        }
    }, [reset, initialBoard, handleReset]);

    const isSafe = (board, row, col, num) => {
        if (!board || board.length !== 9 || board[row].length !== 9) return false;

        num = Number(num);

        for (let i = 0; i < 9; i++) {
            if (Number(board[row][i]) === num) {
                return false;
            }
        }

        for (let i = 0; i < 9; i++) {
            if (Number(board[i][col]) === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (Number(board[r][c]) === num) {
                    return false;
                }
            }
        }

        return true;
    };

    const checkWinCondition = (currentBoard) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentBoard[row][col] === 0 || currentBoard[row][col] === '') {
                    return false;
                }
            }
        }
        return true;
    };

    const handleCellClick = (row, col) => {
        if (initialBoard[row][col] !== 0) return;

        const updatedBoard = board.map(row => [...row]);

        if (updatedBoard[row][col] !== 0 && updatedBoard[row][col] !== '') {
            updatedBoard[row][col] = '';
        } else {
            if (currValue !== null) {
                if (!isSafe(updatedBoard, row, col, currValue)) {
                    toast.error('This value conflicts with another in the row, column, or 3x3 grid!');
                    return;
                }
                updatedBoard[row][col] = currValue;
            }
        }

        setBoard(updatedBoard);

        if (checkWinCondition(updatedBoard)) {
            setIsGameWon(true);
            pauseTimer();
            toast.success('Congratulations! You solved the puzzle!');
        }
    };

    if (!board || board.length === 0) return <p>Loading...</p>;

    return (
        <>
            <div>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => (
                            <span
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                className={`sudoku-cell ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'bottom-border' : ''} ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'right-border' : ''}`}
                                style={{
                                    backgroundColor: initialBoard?.[rowIndex]?.[colIndex] === 0 ? '#fff' : 'rgb(137, 194, 231)',
                                    cursor: initialBoard?.[rowIndex]?.[colIndex] === 0 ? 'pointer' : 'not-allowed',
                                }}
                            >
                                {cell === 0 ? '' : cell}
                            </span>
                        ))}
                    </div>
                ))}
            </div>

            <div className="number-buttons">
                <div className="sudoku-row">
                    {Array.from({ length: 9 }, (_, i) => (
                        <p key={i} className={`sudoku-cell ${currValue === i + 1 ? 'selected-number' : ''}`} onClick={() => setCurrValue(i + 1)}>
                            {i + 1}
                        </p>
                    ))}
                </div>
            </div>

            <div>
                <button className="get-the-solution" onClick={() => navigate("/the-sudoku/getsolution", { state: { initialBoard } })}>
                    Get the Solution?
                </button>
            </div>

            {isGameWon && <h2 className="win-message">🎉 You won! 🎉</h2>}
            {isGameWon && <div className="celebration"></div>}
            <ToastContainer />
        </>
    );
}

export default Sudoku;