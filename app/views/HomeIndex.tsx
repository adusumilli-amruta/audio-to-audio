
import GenerateSoundView from "./GenerateSoundView";

export default function Home() {
    return(
        <div className="homeone">
            <div className="homeone-main">
                <div className="nav common-bet col-100">
                    <div className="nav-logo col-30 common align">
                        <a href="">audio.ai</a>
                    </div>
                    <div className="nav-links col-50 common-even align">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#demo">Demo</a></li>
                    </div>
                </div>
                <div className="home-main col-100 common-even align flex-col" id="home">
                    <h1>AUDIO-TO-AUDIO <br/>TRANSLATION APP</h1>
                    {/* <p>When transcription accuracy matters, you can approach tetra.ai</p> */}
                    <p>Empower your team with audio.ai that breaks the lanhuage barriers.</p>
                    <a href="#demo">Get Started</a>
                </div>
                <div className="about-main col-100 common align flex-col" id="about">
                    <h2>ABOUT</h2><br/>
                    <h3>"Breaking Language Barriers, One Conversation at a Time."</h3>
                    <p>In the realm of digital communication, the ability to convert written text into spoken words has become a transformative force. tetra.ai application have revolutionized accessibility, communication, and entertainment, offering a bridge between written content and auditory comprehension.</p>
                    <p>tetra.ai emerged as a powerful tool for transforming written content into auditory experiences, with profound implications for accessibility, education, and communication.</p>
                </div>
                <div className="demo-main" id="demo">
                    <h2>DEMO</h2>
                    <GenerateSoundView />
                </div>
            </div>
        </div>
    );
}