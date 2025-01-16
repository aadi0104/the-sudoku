import React, { useState } from "react";
import InitModal from "../Modals/InitModal";
import InnerHome from "./InnerHome";

const Home = () => {
    const [open, setOpen] = useState(true);

    const openModal = () => {
        setOpen(true);
    }

    const closeModal = () => {
        setOpen(false);
    }
    return (
        <section className="home">
            <InnerHome open={open} openModal={openModal} />
            {open && <InitModal openModal={openModal} closeModal={closeModal} />}
        </section>
    );
}

export default Home;