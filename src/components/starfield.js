
import Pixi from 'pixi.js'

import APP from 'constants/app'
import { colorToVal } from 'utils/color'
import { lerp } from 'mathutil'

export default class Starfield {
    constructor() {
        this.container = new Pixi.Container()
        this.tex = null

        // Container density
        this.density = .0005 * APP.get( 'CANVAS_WIDTH' ) * APP.get( 'CANVAS_HEIGHT' )

        /**
         * Star values
         */
        this.scale = {
            min: .75,
            max: 1.25
        }

        this.alpha = {
            min: .5,
            max: 1
        }

        this.color = {
            from: [ 0xff, 0xa0, 0xb8 ],
            to: [ 0xff, 0xd0, 0xe2 ]
        }
    }

    init() {
        this.tex = Pixi.loader.resources[ 'assets/star3x3.png' ].texture

        for( let i = 0; i < this.density; i++ ) {
            this.container.addChild( this.createStar() )
        }
    }

    createStar() {
        let star = new Pixi.Sprite( this.tex )
        star.position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )
        let scale = lerp( Math.random(), this.scale.min, this.scale.max )
        star.scale.set( scale, scale )
        star.alpha = lerp( Math.random(), this.alpha.min, this.alpha.max )
        star.tint = colorToVal( this.color.from, this.color.to )

        return star
    }

}
