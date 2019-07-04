import particlesJS from "particlesJS";

particlesJS("particles-js", {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 500
            }
        },
        opacity: {
            random: true,
            anim: {
                enable: true,
                speed: 1,
            }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: false }
        },
        line_linked: { enable: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: false },
            onclick: { enable: false }
        }
    },
    retina_detect: false
});
