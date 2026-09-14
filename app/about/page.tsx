import Image from "next/image";
import "./about.css";

function About() {
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
        </div>
    );

}

export default About;
