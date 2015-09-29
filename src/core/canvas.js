
import APP from 'constants/app'

export const canvas = document.createElement( 'canvas' )
canvas.classList.add( 'js-main' )
canvas.width = APP.get( 'CANVAS_WIDTH' ) * APP.get( 'CANVAS_DP' )
canvas.height = APP.get( 'CANVAS_HEIGHT' ) * APP.get( 'CANVAS_DP' )
canvas.style.width = APP.get( 'CANVAS_WIDTH' ) + 'px'
canvas.style.height = APP.get( 'CANVAS_HEIGHT' ) - 4 + 'px'

document.body.appendChild( canvas )

export const ctx = canvas.getContext( '2d' )
ctx.scale( APP.get( 'CANVAS_DP' ), APP.get( 'CANVAS_DP' ) )
