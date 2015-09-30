
import Pixi from 'pixi.js'

import APP from 'constants/app'
import { colorToVal } from 'utils/color'

export default class Starfield {
    constructor() {
        this.container = new Pixi.Container()
        this.tex = null
    }

    init() {
        this.tex = Pixi.loader.resources[ 'assets/star3x3.png' ].texture

        for( let i = 0; i < APP.get( 'NUM_STARS' ); i++ ) {
            this.container.addChild( this.createStar() )
        }
    }

    createStar() {
        let star = new Pixi.Sprite( this.tex )
        star.position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )
        let scale = ( Math.random() * .5 ) + .75
        star.scale.set( scale, scale )
        star.alpha = .5 + ( Math.random() * .5 )
        star.tint = colorToVal( [ 0xff, 0xa0, 0xb8 ], [ 0xff, 0xd0, 0xe2 ] )

        return star
    }

}
