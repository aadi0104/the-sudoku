import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Sudoku from "./Sudoku";
import Loader from "../Assets/LoaderGIF.gif"

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


    const [isFetched, setIsFetched] = useState(false);
    const [display, setDisplay] = useState("flex");

    function fetched(val) {
        setIsFetched(val);
        setDisplay("flex");
    }

    useEffect(() => {
        if (isFetched) {
            setDisplay("none");
        } else {
            setDisplay("flex");
        }
    }, [isFetched]);

    return (
        <>
            <div className="inner-home">
                <div>
                    <div className="button-holder">
                        <Button variant="primary" onClick={() => { props.openModal(); changeTrue(); fetched(false); }}>New Game</Button>
                        <Button variant="primary" onClick={() => handleReset(true)}>Reset</Button>
                    </div>
                    <div>
                        <h2>
                            Time: {formatTime(time)}
                        </h2>
                    </div>
                    <Sudoku change={change} reset={reset} pauseTimer={pauseTimer} fetched={fetched} handleReset={handleReset} changeFalse={changeFalse} />
                </div>
            </div>
            {!isFetched && <div className="loader" style={{ display }}><div><img src={Loader} alt="loader" /></div></div>}
        </>
    );
}

export default InnerHome;