
import Pixi from 'pixi.js'
import Tick from '@mattstyles/tick'
import Quay from 'quay'

import 'core/canvas'
import stats from 'core/stats'
import renderer from 'core/renderer'

import APP from 'constants/app'
import Starfield from 'components/starfield'

var stage = new Pixi.Container()
var stars = new Starfield()
var quay = new Quay()
var pos = new Pixi.Point( 0, 0 )
var vel = new Pixi.Point( 0, 0 )

var elX = document.querySelector( '.x' )
var elY = document.querySelector( '.y' )

quay.on( '<up>', event => {
    vel.y -= APP.get( 'VEL_Y' )
})
quay.on( '<down>', event => {
    vel.y += APP.get( 'VEL_Y' )
})
quay.on( '<left>', event => {
    vel.x -= APP.get( 'VEL_X' )
})
quay.on( '<right>', event => {
    vel.x += APP.get( 'VEL_X' )
})

function render() {
    renderer.render( stage )
}

let renderTick = new Tick()
    .on( 'data', dt => {
        stats.begin()

        elX.innerHTML = pos.x
        elY.innerHTML = pos.y

        render( dt )

        stats.end()
    })

let aiTick = new Tick({
    frameRate: 10
})
    .on( 'data', dt => {
        vel.x *= APP.get( 'FRICTION' )
        vel.y *= APP.get( 'FRICTION' )

        if ( ( vel.x < APP.get( 'SHIELD' ) && vel.x > 0 ) ||
             ( vel.x > -APP.get( 'SHIELD' ) && vel.x < 0 ) ) {
            vel.x = 0
        }
        if ( ( vel.y < APP.get( 'SHIELD' ) && vel.y > 0 ) ||
             ( vel.y > -APP.get( 'SHIELD' ) && vel.y < 0 ) ) {
            vel.y = 0
        }

        pos.x += vel.x
        pos.y += vel.y

        stars.update( pos, dt )
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
    window.pos = pos
    window.vel = vel
}
