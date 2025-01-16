import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Sudoku from "./Sudoku";

function InnerHome(props) {

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [reset, setReset] = useState(false);

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
    };

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (!props.open) {
            startTimer();
        } else {
            setReset(true);
            pauseTimer();
        }

        if (reset) {
            resetTimer();
            setReset(false);
        }
    }, [props.open, reset]);

    const formatTime = (timeInSeconds) => {
        const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(timeInSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const [change, setChange] = useState(false);

    const changeTrue = () => {
        setChange(true);
    }

    const changeFalse = () => {
        setChange(false);
    }

    const handleReset = (val) => {
        setReset(val);
    }

    return (
        <div className="inner-home">
            <div>
                <div className="button-holder">
                    <Button variant="primary" onClick={() => { props.openModal(); changeTrue(); }}>New Game</Button>
                    <Button variant="primary" onClick={() => handleReset(true)}>Reset</Button>
                </div>
                <div>
                    <h2>
                        Time: {formatTime(time)}
                    </h2>
                </div>
                <Sudoku change={change} reset={reset} handleReset={handleReset} changeFalse={changeFalse} />
            </div>
        </div>
    );
}

export default InnerHome;