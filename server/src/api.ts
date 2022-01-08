import serverless from "serverless-http";
import express from "express";
import AWS from 'aws-sdk';
import { v4 as  uuid } from 'uuid';
import CookieParser from 'cookie-parser';
import { TedisPool } from "tedis";

const app = express();

app.use(CookieParser());
app.use(express.json());

const tedisPool = new TedisPool({
  host: process.env["REDIS_HOST"],
  port: +process.env["REDIS_PORT"],
})

const dynamo_client = new AWS.DynamoDB();
const DB_PLAYERS_TABLE = process.env["DB_PLAYERS_TABLE"]

app.get("/", (req, res) => {
  console.log(req.body);
  
  return res.status(200).json({
    message: "Hello from TEST!",
  });
});


function nextDiceRollTimeMS(): number {
  return (Math.floor(+(new Date()) / 20_000) + 1) * 20_000;
}

function isBetAvailable(): [boolean, number] {
  const nextTime = nextDiceRollTimeMS()
  const now = +(new Date())
  return [now + 2_000 < nextTime, now]
}

app.get("/dice/next-roll-time", async (req, res) => {
  const nextTime = nextDiceRollTimeMS()
  const [available, now] = isBetAvailable()

  return res.status(200).json({
    nextTime: nextTime,
    now: now,
    betAvailable: available
  })
})

app.post("/player/place-bet", async (req, res) => {
  const betPayload = {
    amount: +req.body.amount,
    userId: req.body.userId
  }
  const client = await tedisPool.getTedis()
  try {
    client.lpush("bet", JSON.stringify(betPayload));
  } finally {
    tedisPool.putTedis(client);
  }
});

app.post("/auth/guest", async (req, res) => {
  if (req.body.nickname.length > 30) {
    return res.status(401).json({ error: "Invalid username. Must be less than 30 letters." });
  }

  const playerId = uuid()
  const playerSecret = uuid()
  const ttl = (+(new Date()) / 1000) + (28 * 24 * 60)
  const put_response = await dynamo_client.putItem({
    TableName: DB_PLAYERS_TABLE,
    Item: {
      "playerId": { S: playerId  },
      "playerSecret": { S: playerSecret  },
      "nickname": { S: req.body.nickname},
      "money": { N: "1000" },
      "bets": { S: JSON.stringify([]) },
      // 4 weeks TTL
      "ttl": { N: `${ttl}` }
    }
  }).promise()
  
  const oneMonthSeconds = 24 * 60 * 60 * 30;
  return res.status(200)
    .cookie('player-key', playerId, {
      maxAge: oneMonthSeconds,
      httpOnly: true,
      secure: true
    })
    .cookie('player-secret', playerSecret, {
      maxAge: oneMonthSeconds,
      httpOnly: true,
      secure: true
    })
    .json({
      playerId,
      playerSecret
    })
});

async function getPlayerForKey(player_key: string): { money: number, nickname: string, playerId: string } {
  const dynamo_response = await dynamo_client.getItem({
    TableName: DB_PLAYERS_TABLE,
    Key: {
      "playerId": { S: player_key }
    }
  }).promise() 
  return {
    money: +dynamo_response.Item["money"]["N"],
    nickname: dynamo_response.Item["nickname"]["S"],
    playerId: player_key
  }
}

app.get("/player", async (req, res) => {
  const playerId = req.cookies["player-key"]
  if (!playerId || !req.cookies['player-secret']) {
    res.send(401)
  } else {
    res.status(200).json(await getPlayerForKey(playerId))
  }
})

app.get("/players/:playerId", async (req, res) => {
  console.log(req.params);
  const playerId = req.params["playerId"]
  
  return res.status(200).json(await getPlayerForKey(playerId));
});


export const main = serverless(app)
