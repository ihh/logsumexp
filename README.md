# logsumexp

JavaScript implementation of logsumexp via (tabulated) softplus.

Abandoned as it is actually slower than just using Math.log and Math.exp. Oh well.

~~~~
const lse = require('logsumexp')

for (let x = 0; x < 10; ++x)
  for (let y = 0; y < 20; ++y)
    console.log (x + " plus " + y + " is roughly " + Math.exp (lse.logsumexp (Math.log(x), Math.log(y))))

function benchmark() {
  let t0 = Date.now()
  for (let x = 0; x < 1000; ++x)
    for (let y = 0; y < 1000; ++y)
      lse.logsumexp (Math.log(x), Math.log(y))
  let t1 = Date.now()
  
  let t2 = Date.now()
  for (let x = 0; x < 1000; ++x)
    for (let y = 0; y < 1000; ++y)
      lse.slowLogsumexp (Math.log(x), Math.log(y))
  let t3 = Date.now()
  
  console.log ("With lookup: " + (t1 - t0) + "ms  Without lookup: " + (t3 - t2) + "ms")
}
benchmark()

~~~~
