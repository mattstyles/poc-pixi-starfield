
import Pixi from 'pixi.js'
import raf from 'raf-stream'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import APP from 'constants/app'
import { colorToVal } from 'utils/color'
import Starfield from 'components/starfield'

var stage = new Pixi.Container()
var stars = new Starfield()

function init() {
    stars.init()

    stage.addChild( stars.container )

    renderer.render( stage )
}

let tick = raf( window )
    .on( 'data', delta => {
        stats.begin()

        stats.end()
    })


Pixi.loader
    .add( 'assets/star3x3.png' )
    .load( init )


if ( process.env.DEBUG ) {
    window.renderer = renderer
    window.tick = tick
}
