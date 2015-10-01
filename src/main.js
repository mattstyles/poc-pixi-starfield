
import Pixi from 'pixi.js'
import Tick from '@mattstyles/tick'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import APP from 'constants/app'
import { colorToVal } from 'utils/color'
import Starfield from 'components/starfield'

var stage = new Pixi.Container()
var stars = new Starfield()

function render() {
    renderer.render( stage )
}

function gamePause() {
    renderTick.pause()
    aiTick.pause()
}
function gameResume() {
    renderTick.resume()
    aiTick.resume()
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()

        // render()

        stats.end()
    })

let aiTick = new Tick({
    frameRate: 10
})
    .on( 'data', dt => {
        stars.update( dt )
    })

gamePause()

function init() {
    stars.init()

    stage.addChild( stars.container )

    gameResume()
    render()
}

Pixi.loader
    .add( 'assets/star3x3.png' )
    .load( init )


if ( process.env.DEBUG ) {
    window.renderer = renderer
    window.pause = gamePause
    window.resume = gameResume
}
