
const a = properties
  .filter( prop => !prop.computed)

const b = properties
  .map(prop => prop.key.name )

const c = properties
  .filter( prop => !prop.computed )
  .map( prop => prop.key.name )

const app = { use: () => {} }

app.use( ( req, res ) => {})

[ 1 ].filter( x => x )
