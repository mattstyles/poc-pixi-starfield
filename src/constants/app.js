import toMap from 'utils/toMap'

const APP = toMap({
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,
    CANVAS_DP: window.devicePixelRatio,

    // .05% of screen density
    // NUM_STARS: .0005 * window.innerWidth * window.innerHeight,
    NUM_STARS: 6000,
    STAR_TEX: 'assets/circle32.png',

    // Movement
    VEL_Y: .5,
    VEL_X: .5,
    FRICTION: .88,
    SHIELD: .25
})

export default APP
