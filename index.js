const LOOKUP_MAX = 10;
const LOOKUP_PRECISION = .0001;
const LOOKUP_ENTRIES = Math.floor (LOOKUP_MAX / LOOKUP_PRECISION) + 1;

const slowSoftplus = (x) => Math.log (1 + Math.exp (x));

const softplusLookup = new Float32Array (LOOKUP_ENTRIES)
      .fill (0)
      .map ((_x, n) => slowSoftplus (-n * LOOKUP_PRECISION));

const softplus = (x) => {
  if (x > 0)
    return slowSoftplus(x);
  if (x <= -LOOKUP_MAX || !isFinite(x))
    return 0;
  const n = Math.floor (-x / LOOKUP_PRECISION);
  const f0 = softplusLookup[n];
  const dx = -x - (n * LOOKUP_PRECISION);
  const f1 = softplusLookup[n+1];
  const df = f1 - f0;
  return f0 + df * (dx / LOOKUP_PRECISION);
}

const logsumexp = (a, b) => {
  /* returns log(exp(a) + exp(b)) */
  let max, diff;
  // Note: Infinity plus or minus a finite quantity is still Infinity,
  // but Infinity - Infinity = NaN.
  // Thus, we are susceptible to NaN errors when trying to add 0+0 in log-space.
  // To work around this, we explicitly test for a==b.
  if (a == b) { max = a; diff = 0; }
  else if (a < b) { max = b; diff = b - a; }
  else { max = a; diff = a - b; }
  return max + softplus (-diff);
}

const slowLogsumexp = (a, b) => {
  let max, diff;
  if (a == b) { max = a; diff = 0; }
  else if (a < b) { max = b; diff = b - a; }
  else { max = a; diff = a - b; }
  return max + slowSoftplus (-diff);
}

function benchmark (N) {
  N = N || 1000;
  let t0 = Date.now()
  for (let x = 0; x < N; ++x)
    for (let y = 0; y < N; ++y)
      lse.logsumexp (Math.log(x), Math.log(y))
  let t1 = Date.now()
  
  let t2 = Date.now()
  for (let x = 0; x < N; ++x)
    for (let y = 0; y < N; ++y)
      lse.slowLogsumexp (Math.log(x), Math.log(y))
  let t3 = Date.now()
  
  console.log ("With lookup: " + (t1 - t0) + "ms  Without lookup: " + (t3 - t2) + "ms")
}

module.exports = { LOOKUP_MAX,
                   LOOKUP_PRECISION,
                   slowSoftplus,
                   slowLogsumexp,
                   softplus,
                   logsumexp,
                   benchmark };

