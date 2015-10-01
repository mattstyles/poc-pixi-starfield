
import HeightMap from 'heightmap'
import FastSimplex from 'fast-simplex-noise'

/**
 * @function
 * Creates a new simplex generator and holds it in closure
 */
function simplex( options ) {
    const fastSimplex = new FastSimplex( Object.assign({
        min: 0,
        max: 1,
        octaves: 4,
        frequency: .01,
        persistence: .5,
        amplitude: 1
    }, options ) )

    /**
     * Return a function for the Heightmap to invoke
     */
    return function( x, y ) {
        return fastSimplex.get2DNoise( x, y )
    }
}

const starMap = new HeightMap()
    .generator({
        weight: 1,
        fn: simplex({
            min: .25,
            max: 1,
            octaves: 4,
            persistence: 1 / Math.pow( 2, 4 ),
            frequency: 1 / Math.pow( 2, 9 )
        })
    })

// starMap frequency probably needs to higher i.e. 1 / Math.pow( 2, 11 )
// higher frequency mean larger groupings of colour/temperature/brightness


export default starMap
