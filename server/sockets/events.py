import socketio

# The shared AsyncServer instance — imported by main.py for ASGI mounting
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")


@sio.event
async def connect(sid: str, environ: dict, auth: dict | None = None) -> None:
    """
    Called when a client connects via Socket.io.

    Todo (engineer): Implement connection authentication/validation.

    This handler should:
    - Validate auth token or session_id from the auth dict
    - Associate the sid with a session_id in Redis (key: "sid:{sid}" → session_id)
      so that disconnect cleanup can find the user's active pings
    - Reject connection if auth is invalid by raising socketio.exceptions.ConnectionRefusedError
    """
    print(f"[socket] client connected: {sid}")


@sio.event
async def disconnect(sid: str) -> None:
    """
    Called when a client disconnects.

    TODO (engineer): Implement room lifecycle cleanup on disconnect.

    This handler should:
    - Look up which court room(s) the sid was joined to
      (suggest tracking in Redis: "rooms:{sid}" → set of court_ids)
    - Remove the session's ping from each court's Redis sorted set
    - Recalculate and broadcast updated heat levels to affected court rooms
    - Delete the "sid:{sid}" and "rooms:{sid}" Redis keys
    """
    print(f"[socket] client disconnected: {sid}")


@sio.event
async def join_court(sid: str, data: dict) -> None:
    """
    Join the Socket.io room for a specific court to receive live heat updates
    and chat messages.

    TODO (engineer): Implement room join lifecycle.

    Expected data shape: { "court_id": "<uuid>" }

    This handler should:
    - Validate that court_id exists in the DB
    - Call sio.enter_room(sid, f"court:{court_id}")
    - Track joined room in Redis ("rooms:{sid}" sorted set or set)
    - Emit a "room_joined" ack back to the client with current heat_level
    """
    court_id = data.get("court_id")
    if not court_id:
        return
    # TODO (engineer): validate court, enter room, track in Redis
    await sio.enter_room(sid, f"court:{court_id}")
    print(f"[socket] {sid} joined court room: {court_id}")


@sio.event
async def leave_court(sid: str, data: dict) -> None:
    """
    Leave a court's Socket.io room.

    TODO (engineer): Implement room leave lifecycle.

    Expected data shape: { "court_id": "<uuid>" }

    This handler should:
    - Call sio.leave_room(sid, f"court:{court_id}")
    - Remove the court from the sid's tracked rooms in Redis
    - If the user had an active ping for this court, remove it and
      recalculate heat level for the room
    """
    court_id = data.get("court_id")
    if not court_id:
        return
    # TODO (engineer): remove ping, recalculate heat, leave room
    await sio.leave_room(sid, f"court:{court_id}")
    print(f"[socket] {sid} left court room: {court_id}")


@sio.event
async def send_chat(sid: str, data: dict) -> None:
    """
    Receive a chat message from a client and broadcast it to the court room.

    Expected data shape:
    {
        "court_id": "<uuid>",
        "session_id": "<string>",
        "display_name": "<string>",
        "content": "<string>"
    }

    TODO (engineer): Implement full send_chat handler.

    This handler should:
    - Validate required fields
    - Call chat_service.publish_message() to persist to Redis
    - Broadcast the ChatMessage to the court room via:
        await sio.emit("new_message", message.model_dump(mode="json"),
                       room=f"court:{court_id}", skip_sid=sid)
    - Emit "new_message" back to sender for optimistic UI confirmation
    """
    court_id = data.get("court_id")
    if not court_id:
        return
    # TODO (engineer): persist message, broadcast to room
    print(f"[socket] chat from {sid} in court {court_id}: {data.get('content', '')[:50]}")
