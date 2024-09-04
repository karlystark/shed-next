"use client";

import Image from "next/image";
import React, { useState } from "react";
import Toggle from "../components/toggle/toggle";
import "./about.css";

/** About renders the about page
 *
 * props: none
 * state: none
 *
 */

function About() {
    const [isOn1, setIsOn1] = useState(false);

    function colorChange1() {
        console.log("clicked!");
        setIsOn1(!isOn1);
    }

    return (
        <div className="About">
            <div className="About-hero">
                <div className="About-title">
                    <h1> <u>shed</u> is a resource-sharing app for chosen family networks </h1>
                    <Image
                        src="/grass-green.png"
                        alt=""
                        width="500"
                        height="500"
                    />
                </div>
                <div className="About-description">
                    <Image
                        src="/cart-green.png"
                        alt=""
                        width="400"
                        height="400"
                    />
                    <p> some things are best shared - power tools, camping gear, extra sourdough starter...
                        <br></br>
                        <br></br>
                        and when we connect, we have everything we need.
                    </p>
                </div>
            </div>
            <Toggle isChecked={isOn1} changeScreen={colorChange1} />
        </div>
    );

}

export default About;