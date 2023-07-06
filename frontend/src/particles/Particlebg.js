import particlesConfig from "./particles-config";
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const Particlebg = () => {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);
    return (
        <Particles 
            id="tsparticles" 
            init={particlesInit}
            loaded={particlesLoaded} options={{
                background: {
                    color: {
                        value: "#000",
                    },
                },
                fpsLimit: 150,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 5,
                        },
                        grab: {
                            distance: 5,
                            links: {
                                color: "#ffffff",
                                opacity: 1,
                            }
                        },
                        repulse: {
                            distance: 80,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 1,
                        width: 0.9,
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        direction: "random",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 100,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "hexagon",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }} />
    );
}

export default Particlebg;