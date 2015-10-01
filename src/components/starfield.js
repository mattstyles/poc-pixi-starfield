
import Pixi from 'pixi.js'
import Bezier from 'bezier-easing'
import random from 'lodash.random'

import starMap from 'core/starmap'
import APP from 'constants/app'
import { colorToVal } from 'utils/color'
import { lerp } from 'mathutil'

/**
 * Starfield class
 * Generates a starfield
 * @class
 * ---
 * @TODO
 * - still looks fairly uniform although stars are grouped together nicely, effectively
 *   disappearing in dark patches. Probably needs to be some variety i.e. bright stars
 *   are close and bright, dark ones are near invisible and larger, needs to be some random
 *   perturbation
 * - might be worth adding a few random larger brighter stars periodically (or defined by some
 *   pattern across a whole system) to break up the uniformity
 * - _cloud-stars_ need to be created to give some overall colour variance to the background
 *   without simply increasing star density, these should be larger, coloured and largely
 *   transparent so that they overlap. Blacks being blacks is good so only _light_ patches should
 *   have these clouds to give an overall colour to the brighter spots.
 * - randomise textures used, or maybe use different textures depending on position (light/dark)
 */
export default class Starfield {
    constructor() {
        this.container = new Pixi.Container()
        this.container.position.set(
            APP.get( 'CANVAS_WIDTH' ) / 2,
            APP.get( 'CANVAS_HEIGHT' ) / 2
        )
        this.stars = []
        this.tex = null

        // Container star density
        this.density = APP.get( 'NUM_STARS' )

        /**
         * Star values
         */
        this.scale = {
            min: .05,
            max: .25
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
        this.tex = Pixi.loader.resources[ APP.get( 'STAR_TEX' ) ].texture

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
        // Add some variance with a linear random to make a little larger or smaller
        // let scale = lerp( 1 - brightness, this.scale.min, this.scale.max )
        let scale = lerp( random( .4, 1.6 ) * ( 1 - brightness ), this.scale.min, this.scale.max )
        star.scale.set( scale, scale )

        // Tint should be controlled by brightness, controlled by temp (research)
        star.tint = colorToVal( temp, this.color.from, this.color.to )


        return star
    }

    createStarPosition( star, rect ) {
        let x = random( rect.x - rect.width, rect.x + rect.width )
        let y = random( rect.y - rect.height, rect.y + rect.height )
        star.position.set( x, y )
        return star
    }

    createStar() {
        let star = new Pixi.Sprite( this.tex )
        this.stars.push( star )
        //star.position.set( ~~( Math.random() * APP.get( 'CANVAS_WIDTH' ) ), ~~( Math.random() * APP.get( 'CANVAS_HEIGHT' ) ) )

        // This isnt really width and height, but half of it as x,y refer to center of rect
        star = this.createStarPosition( star, {
            x: 0,
            y: 0,
            width: APP.get( 'CANVAS_WIDTH' ),
            height: APP.get( 'CANVAS_HEIGHT' )
        })


        // Calc size, alpha and tint based on distance/brightness/temperature/etc
        star = this.getStarDistance( star )

        return star
    }

    // @TODO no need for pos to be passed in here, need to be smarter about
    // which functions need which variables
    // Pos here refers to game pos, which shouldnt be passed to update but
    // currently is
    updateRight( star, pos ) {
        let dist = star.position.x - ( pos.x - APP.get( 'CANVAS_WIDTH' ) )

        if ( dist > 0 ) {
            return
        }

        // Dont remove or fart around with stars, just set their position from
        // the left edge to the right edge and reset their alpha/scale/tint to
        // reflect their new position
        // @TODO density should not be constant, if num of stars in container is
        // greater than the current density then these stars should not be reborn
        // on the other side. If num_stars is less than density then new ones should
        // be created somewhere inside update()
        star.position.x = pos.x + APP.get( 'CANVAS_WIDTH' ) + dist
        // randomise x position to counter odd diagonal issues -- UPDATE dont need to
        //star.position.y = random( pos.y - APP.get( 'CANVAS_HEIGHT' ), pos.y + APP.get( 'CANVAS_HEIGHT' ) )
        this.getStarDistance( star )
    }

    updateLeft( star, pos ) {
        let dist = star.position.x - ( pos.x + APP.get( 'CANVAS_WIDTH' ) )
        if ( dist < 0 ) { return }

        star.position.x = pos.x - APP.get( 'CANVAS_WIDTH' ) - dist
        //star.position.y = random( pos.y - APP.get( 'CANVAS_HEIGHT' ), pos.y + APP.get( 'CANVAS_HEIGHT' ) )
        this.getStarDistance( star )
    }

    updateDown( star, pos ) {
        let dist = star.position.y - ( pos.y - APP.get( 'CANVAS_HEIGHT' ) )
        if ( dist > 0 ) { return }

        star.position.y = pos.y + APP.get( 'CANVAS_HEIGHT' ) + dist
        //star.position.x = random( pos.x - APP.get( 'CANVAS_WIDTH' ), pos.x + APP.get( 'CANVAS_WIDTH' ) )
        this.getStarDistance( star )
    }

    updateUp( star, pos ) {
        let dist = star.position.y - ( pos.y + APP.get( 'CANVAS_HEIGHT' ) )
        if ( dist < 0 ) { return }

        star.position.y = pos.y - APP.get( 'CANVAS_HEIGHT' ) - dist
        //star.position.x = random( pos.x - APP.get( 'CANVAS_WIDTH' ), pos.x + APP.get( 'CANVAS_WIDTH' ) )
        this.getStarDistance( star )
    }

    update( vel = { x: 0, y: 0 }, pos = { x: 0, y: 0 } ) {
        // Iterate through starfield and kill any out of bounds stars
        this.container.children.forEach( star => {
            // Right
            if ( vel.x > 0 ) {
                this.updateRight( star, pos )
            }

            // left
            if ( vel.x < 0 ) {
                this.updateLeft( star, pos )
            }

            // down
            if ( vel.y > 0 ) {
                this.updateDown( star, pos )
            }

            // up
            if ( vel.y < 0 ) {
                this.updateUp( star, pos )
            }
        })

        this.container.position.x -= vel.x
        this.container.position.y -= vel.y
    }

}
