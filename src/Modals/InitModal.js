import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function InitModal(props) {
    return (
        <div className="modal">
            <Modal
                show={props.openModal}
                onHide={props.closeModal}
                centered
            >
                <Modal.Header className="justify-content-center">
                    <Modal.Title>
                        <h3>
                            Welcome To Sudoku Game!
                        </h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Sudoku is a classic numbers puzzle that tests your logic and problem-solving skills. The goal is simple: fill a 9x9 grid so that every row, column, and 3x3 box contains the numbers 1 through 9, with no repeats. Starting with a partially filled grid, use logic to deduce where each number belongs. Perfect for beginners and seasoned solvers. Dive in, learn the rules, and enjoy the satisfaction of solving Sudoku!
                    </p>
                    <div className="modal-button-div">
                        <Button variant="primary" onClick={() => props.closeModal()}>Start Game</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default InitModal;