import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface SyncEvent {
  type: 'play' | 'pause' | 'seek' | 'track_change' | 'ping' | 'goodbye';
  sessionId: string;
  senderId: string;
  timestamp: number;
  data?: any;
}

interface PeerInfo {
  senderId: string;
  role: 'host' | 'guest';
  lastSeen: number;
}

interface SessionData {
  sessionId: string;
  createdAt: number;
  lastActivity: number;
  peers: Map<string, PeerInfo>;
  events: SyncEvent[];
  currentSnapshot?: {
    trackId?: string;
    trackTitle?: string;
    trackArtist?: string;
    trackThumbnail?: string;
    streamUrl?: string;
    positionMs?: number;
    isPlaying?: boolean;
    updatedAt: number;
  };
}

// Preserve session state in dev hot reloads via globalThis
const globalForSync = globalThis as unknown as {
  syncSessions?: Map<string, SessionData>;
};

if (!globalForSync.syncSessions) {
  globalForSync.syncSessions = new Map<string, SessionData>();
}

const sessions = globalForSync.syncSessions;

// Clean up stale sessions periodically (older than 30 minutes of inactivity)
function cleanupStaleSessions() {
  const now = Date.now();
  sessions.forEach((session, id) => {
    if (now - session.lastActivity > 30 * 60 * 1000) {
      sessions.delete(id);
      return;
    }
    // Remove peers that haven't polled in 10 seconds
    session.peers.forEach((peer, peerId) => {
      if (now - peer.lastSeen > 10 * 1000) {
        session.peers.delete(peerId);
      }
    });
  });
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  cleanupStaleSessions();

  const { searchParams } = new URL(request.url);
  const sessionId = (searchParams.get("sessionId") || "").toUpperCase().trim();
  const senderId = searchParams.get("senderId") || "anonymous";
  const role = (searchParams.get("role") || "guest") as 'host' | 'guest';
  const since = parseInt(searchParams.get("since") || "0", 10);

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: "Missing sessionId" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  let session = sessions.get(sessionId);
  if (!session) {
    // If it's a host, create the session automatically
    if (role === 'host') {
      session = {
        sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        peers: new Map(),
        events: [],
      };
      sessions.set(sessionId, session);
    } else {
      return NextResponse.json(
        { success: false, error: "Room not found", peers: 0, events: [] },
        { status: 404, headers: CORS_HEADERS }
      );
    }
  }

  // Update peer activity
  const now = Date.now();
  session.lastActivity = now;
  session.peers.set(senderId, {
    senderId,
    role,
    lastSeen: now,
  });

  // Filter events newer than 'since'
  let pendingEvents = session.events.filter(
    (e) => e.timestamp > since && e.senderId !== senderId
  );

  // If newly joined guest (since === 0), supply instant current snapshot so song starts playing with zero delay!
  if (since === 0 && session.currentSnapshot && session.currentSnapshot.trackId) {
    const elapsed = session.currentSnapshot.isPlaying
      ? Math.max(0, now - session.currentSnapshot.updatedAt)
      : 0;
    const initialEvent: SyncEvent = {
      type: 'track_change',
      sessionId,
      senderId: 'server_initial',
      timestamp: now,
      data: {
        ...session.currentSnapshot,
        positionMs: (session.currentSnapshot.positionMs || 0) + elapsed,
      },
    };
    pendingEvents = [initialEvent, ...pendingEvents];
  }

  return NextResponse.json(
    {
      success: true,
      sessionId,
      peers: session.peers.size,
      serverTime: now,
      events: pendingEvents,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: NextRequest) {
  cleanupStaleSessions();

  try {
    const body: SyncEvent = await request.json();
    const sessionId = (body.sessionId || "").toUpperCase().trim();

    if (!sessionId || !body.type) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId or type" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let session = sessions.get(sessionId);
    const now = Date.now();

    if (!session) {
      session = {
        sessionId,
        createdAt: now,
        lastActivity: now,
        peers: new Map(),
        events: [],
      };
      sessions.set(sessionId, session);
    }

    session.lastActivity = now;

    // Track peer
    if (body.senderId) {
      const existing = session.peers.get(body.senderId);
      session.peers.set(body.senderId, {
        senderId: body.senderId,
        role: existing?.role || 'host',
        lastSeen: now,
      });
    }

    if (body.type === 'goodbye') {
      if (body.senderId) {
        session.peers.delete(body.senderId);
      }
    } else {
      const event: SyncEvent = {
        ...body,
        sessionId,
        timestamp: body.timestamp || now,
      };

      // Keep latest snapshot for instant guest synchronization
      if (body.type === 'track_change' && body.data) {
        session.currentSnapshot = {
          ...body.data,
          updatedAt: now,
        };
      } else if (session.currentSnapshot) {
        if (body.type === 'play') {
          session.currentSnapshot.isPlaying = true;
          if (body.data?.positionMs !== undefined) session.currentSnapshot.positionMs = body.data.positionMs;
          session.currentSnapshot.updatedAt = now;
        } else if (body.type === 'pause') {
          session.currentSnapshot.isPlaying = false;
          if (body.data?.positionMs !== undefined) session.currentSnapshot.positionMs = body.data.positionMs;
          session.currentSnapshot.updatedAt = now;
        } else if (body.type === 'seek') {
          if (body.data?.positionMs !== undefined) session.currentSnapshot.positionMs = body.data.positionMs;
          if (body.data?.isPlaying !== undefined) session.currentSnapshot.isPlaying = body.data.isPlaying;
          session.currentSnapshot.updatedAt = now;
        }
      }

      // Keep only the latest 40 events
      session.events.push(event);
      if (session.events.length > 40) {
        session.events.shift();
      }
    }

    return NextResponse.json(
      { success: true, peers: session.peers.size },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process event" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
