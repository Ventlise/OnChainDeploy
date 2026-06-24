// app/api/stats/route.ts
// Global deploy counter using Redis directly (works with redis:// URLs)

import { NextResponse } from "next/server"
import Redis from "ioredis"

const BASELINE = 123
const KV_KEY = "global_deploy_count"

// Singleton Redis client (reused across requests)
let client: Redis | null = null

function getRedis(): Redis | null {
  if (client) return client
  
  const url = process.env.KV_REDIS_URL
  if (!url) {
    console.warn("[api/stats] KV_REDIS_URL is not set")
    return null
  }
  
  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: false,
    })
    return client
  } catch (err) {
    console.error("[api/stats] Redis connection failed:", err)
    return null
  }
}

export async function GET() {
  try {
    const redis = getRedis()
    if (!redis) {
      return NextResponse.json({ total: BASELINE })
    }
    
    const raw = await redis.get(KV_KEY)
    const realDeploys = raw ? parseInt(raw, 10) : 0
    
    return NextResponse.json(
      { total: BASELINE + realDeploys },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("[api/stats] GET error:", err)
    return NextResponse.json({ total: BASELINE })
  }
}

export async function POST() {
  try {
    const redis = getRedis()
    if (!redis) {
      return NextResponse.json({ total: BASELINE })
    }
    
    const newCount = await redis.incr(KV_KEY)
    return NextResponse.json({ total: BASELINE + newCount })
  } catch (err) {
    console.error("[api/stats] POST error:", err)
    return NextResponse.json({ total: BASELINE })
  }
}