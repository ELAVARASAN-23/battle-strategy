const express = require('express');
const app = express();
const sls = require("serverless-http");
const { conversionArmies, getPermutations, getBattleResult } = require('./app/utlities/reuseableFun');

const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 6,
});
const rateLimiterMiddleware = async (req, res, next) => {
  const key = req.ip;

  try {
    await rateLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({ message: 'Too Many Requests' });
  }
};
app.use(rateLimiterMiddleware)
// Middleware to decode base64-encoded body
app.use((req, res, next) => {
  console.log({req})
  if (Buffer.isBuffer(req.body)) {
    req.body = JSON.parse(Buffer.from(req.body).toString('utf-8'));
  }
  next();
});
app.use(express.json({limit: "10mb" }));
app.use(
  express.urlencoded({
    parameterLimit: 100,
    limit: "10mb",
    extended: false,
  })
);
app.post('/battle-strategy', (req, res) => {
    try {
        const {own,enemy} = req.body;
        if(!own || !enemy){
            return res.status(400).json({
                status: false,
                message: "Invalid input",
                body: req.body
            })
        }
        const ownPlatoons = conversionArmies(own);  // conversion own army input
        const enemyPlatoons = conversionArmies(enemy); // conversion enemy army input

        if(ownPlatoons.length !== 5 || enemyPlatoons.length !== 5){
            return res.status(400).json({
                status: false,
                message: "own and enemy platoons should be equal to 5",
                body: req.body
            })
        }
        const allPermutations = getPermutations(ownPlatoons); // get all possible arrangements of army
        // loop with all permutations
        let result = ""
        for (const arrangement of allPermutations) {
            let wins = 0;
            for (let i = 0; i < 5; i++) {
                if (getBattleResult(arrangement[i], enemyPlatoons[i]) === 'win') {
                    wins++;
                }
            }
            if (wins >= 3) {
                result = arrangement.map(p => `${p.unit}#${p.count}`).join(';');
                break;
            }
        }

        res.status(200).json({
            status: true,
            data: result? result: 'There is no chance of winning'
        })

    } catch (error) {
        console.log({error})
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
})

const mode = process.env.NODE_ENV || "development";
if (mode === "development") {
  const port = process.env.PORT || 8770;
  app.listen(port, async () => {
   console.log("Running", `server is running at port ${port}`);
  });
} else module.exports.server = sls(app);