import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function GetSolution() {
    const location = useLocation();
    const { initialBoard } = location.state;

    const [board, setBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        if (initialBoard?.length > 0 && !isSolved) {
            setBoard(JSON.parse(JSON.stringify(initialBoard)));
            solveSudoku(JSON.parse(JSON.stringify(initialBoard)));
        }
    }, [initialBoard]);

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

    const solveSudoku = (board) => {
        const solve = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isSafe(board, row, col, num)) {
                                board[row][col] = num;

                                if (solve()) {
                                    return true;
                                } else {
                                    board[row][col] = 0;
                                }
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        if (solve()) {
            setBoard(board);
            setIsLoading(false);
            setIsSolved(true);
        }
    };

    const rows = [];
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const cells = [];
        for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
            const isReadOnly = initialBoard[rowIndex][colIndex] !== 0;

            cells.push(
                <span
                    key={`${rowIndex}-${colIndex}`}
                    className={`sudoku-cell ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'bottom-border' : ''} ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'right-border' : ''}`}
                    style={{
                        backgroundColor: isReadOnly ? 'rgb(137, 194, 231)' : '#fff',
                        cursor: 'default',
                    }}
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

    return (
        <div className="solution">
            <div>
                <h2>Sudoku Solution</h2>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div>{rows}</div>
                )}
            </div>
        </div>
    );
}

export default GetSolution;