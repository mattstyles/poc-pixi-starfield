import Stats from 'stats.js'

const stats = new Stats()
stats.setMode( 0 )
Object.assign( stats.domElement.style, {
    position: 'absolute',
    top: '0px',
    right: '0px',
    zIndex: 1000
})

document.body.appendChild( stats.domElement )

export default stats
