
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'

import starMap from 'core/starmap'
import APP from 'constants/app'
import { colorToVal } from 'utils/color'
import { lerp } from 'mathutil'

export default class Starfield {
    constructor() {
        this.container = new Pixi.Container()
        this.stars = []
        this.tex = null

        // Container density
        this.density = .0025 * APP.get( 'CANVAS_WIDTH' ) * APP.get( 'CANVAS_HEIGHT' )

        /**
         * Star values
         */
        this.scale = {
            min: .75,
            max: 1.25
        }

        this.alpha = {
            min: .1,
            max: 1
        }

        this.color = {
            from: [ 0xff, 0xa0, 0xb8 ],
            to: [ 0xd0, 0xd0, 0xff ]
        }

        this.tempCurve = new Bezier( .75, .1, .9, .5 )
    }

    init() {
        this.tex = Pixi.loader.resources[ 'assets/star3x3.png' ].texture

        for( let i = 0; i < this.density; i++ ) {
            this.container.addChild( this.createStar() )
        }
    }

    getStarDistance( star ) {
        // Map simplex noise onto a bezier to smooth out dips
        // Simplex fairly smoothly goes from min..max, we need curves yeah (creates better star groupings)
        let brightness = starMap.getValue( star.position.x, star.position.y )
        let temp = this.tempCurve.get( brightness )

        // Clamp alpha to the min...max calues
        star.alpha = lerp( temp, this.alpha.min, this.alpha.max )

        // Further stars are going to be larger, spread more, to provide background
        // so interpolate between min and max
        let scale = lerp( 1 - brightness, this.scale.min, this.scale.max )
        star.scale.set( scale, scale )

        // Tint should be controlled by brightness, controlled by temp (research)
        star.tint = colorToVal( temp, this.color.from, this.color.to )


        return star
    }

    createStar() {
        let star = new Pixi.Sprite( this.tex )
        this.stars.push( star )
        star.position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )
        // let scale = lerp( Math.random(), this.scale.min, this.scale.max )
        // star.scale.set( scale, scale )
        //star.alpha = lerp( Math.random(), this.alpha.min, this.alpha.max )
        // star.tint = colorToVal( Math.random(), this.color.from, this.color.to )

        star = this.getStarDistance( star )

        return star
    }

    update() {
        // for ( let i = 0; i < this.density; i++ ) {
        //     if ( Math.random() > .98 ) {
        //         try {
        //             this.stars[ i ].alpha = lerp( Math.random(), this.alpha.min, this.alpha.max )
        //             //this.stars[ i ].position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )
        //         } catch ( err ) {
        //             console.error( 'star', i, 'does not exist' )
        //         }
        //
        //     }
        // }
    }

}
