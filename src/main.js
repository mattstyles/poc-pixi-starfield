
import Pixi from 'pixi.js'
import Tick from '@mattstyles/tick'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import APP from 'constants/app'
import Starfield from 'components/starfield'

var stage = new Pixi.Container()
var stars = new Starfield()

function render() {
    renderer.render( stage )
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()

        render( dt )

        stats.end()
    })

let aiTick = new Tick({
    frameRate: 10
})
    .on( 'data', dt => {
        stars.update( dt )
    })

function gamePause() {
    renderTick.pause()
    aiTick.pause()
}
function gameResume() {
    renderTick.resume()
    aiTick.resume()
}



gamePause()

function init() {
    stars.init()

    stage.addChild( stars.container )

    gameResume()
    render()
}

Pixi.loader
    .add( APP.get( 'STAR_TEX' ) )
    .load( init )


if ( process.env.DEBUG ) {
    window.renderer = renderer
    window.pause = gamePause
    window.resume = gameResume
}
