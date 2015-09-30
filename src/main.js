
import Pixi from 'pixi.js'
import raf from 'raf-stream'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import APP from 'constants/app'
import { colorToVal } from 'utils/color'

let stars = new Pixi.Container()


function setup() {
    let tex = Pixi.loader.resources[ 'assets/star3x3.png' ].texture
    // let sprite = new Pixi.Sprite( tex )

    for( let i = 0; i < APP.get( 'NUM_STARS' ); i++ ) {
        let star = new Pixi.Sprite( tex )
        star.position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )
        let scale = ( Math.random() * .5 ) + .75
        star.scale.set( scale, scale )
        star.alpha = .5 + ( Math.random() * .5 )
        star.tint = colorToVal( [ 0xff, 0x60, 0x88 ] )

        stars.addChild( star )
    }

    renderer.render( stars )
}

let tick = raf( window )
    .on( 'data', delta => {
        stats.begin()

        stats.end()
    })


Pixi.loader
    .add( 'assets/star3x3.png' )
    .load( setup )


if ( process.env.DEBUG ) {
    window.renderer = renderer
    window.tick = tick
}
