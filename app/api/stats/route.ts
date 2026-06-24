// app/api/stats/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@vercel/kv"

const BASELINE = 123
const KV_KEY = "global_deploy_count"

// Create KV client using YOUR variable name (KV_REDIS_URL)
function getKV() {
  const url = process.env.KV_REDIS_URL
  const token = process.env.KV_REDIS_TOKEN ?? process.env.KV_REST_API_TOKEN ?? ""
  
  if (!url) return null
  
  return createClient({ url, token })
}

// GET — return current global total
export async function GET() {
  try {
    const kv = getKV()
    if (!kv) {
      return NextResponse.json({ total: BASELINE })
    }
    const raw = await kv.get<number>(KV_KEY)
    const realDeploys = typeof raw === "number" ? raw : 0
    return NextResponse.json(
      { total: BASELINE + realDeploys },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("[api/stats] GET error:", err)
    return NextResponse.json({ total: BASELINE })
  }
}

// POST — bump count by 1 after every real deploy
export async function POST() {
  try {
    const kv = getKV()
    if (!kv) {
      return NextResponse.json({ total: BASELINE })
    }
    const newCount = await kv.incr(KV_KEY)
    return NextResponse.json({ total: BASELINE + newCount })
  } catch (err) {
    console.error("[api/stats] POST error:", err)
    return NextResponse.json({ total: BASELINE })
  }
}