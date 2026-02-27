from contextlib import asynccontextmanager
from typing import AsyncIterator

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db import close_pool, create_pool
from redis_client import close_redis, create_redis
from routers import chat, courts, ping
from sockets.events import sio


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Startup and shutdown lifecycle: initialise DB pool and Redis client."""
    await create_pool()
    await create_redis()
    yield
    await close_pool()
    await close_redis()


app = FastAPI(
    title="HeatCheck API",
    description="Real-time crowdsourced basketball court finder",
    version="0.1.0",
    lifespan=lifespan,
)

# 
# CORS middleware
# 
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 
# REST routers
# 
app.include_router(courts.router)
app.include_router(ping.router)
app.include_router(chat.router)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


# 
# Socket.io ASGI mount
# 
# The combined ASGI app that serves both HTTP (FastAPI) and WebSocket (Socket.io)
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
