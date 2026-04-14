import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const size = Math.min(512, Math.max(16, parseInt(req.nextUrl.searchParams.get('size') ?? '192')))

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: '#15803d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size * 0.2,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: size * 0.55,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          K
        </span>
      </div>
    ),
    { width: size, height: size }
  )
}
