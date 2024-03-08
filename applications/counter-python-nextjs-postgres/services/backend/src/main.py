import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import codefly.codefly as codefly
from storage import Storage
from visit import *

codefly.init()

print("running application")

app = FastAPI()

if codefly.is_local():
    origins = [
        "*",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

connection = codefly.get_service_provider_info("counter-python-nextjs-postgres/store", "postgres", "connection")
if connection:
    store = Storage(connection)


@app.get("/version")
async def version():
    return {"version": codefly.service().version}


@app.post("/visit", response_model=CreateVisitResponse)
async def visit():
    if not store:
        raise HTTPException(status_code=500, detail="No store available")
    resp = store.create_visit()
    if not resp:
        raise HTTPException(status_code=500, detail="Can't create visit")
    return resp


@app.get("/visit/statistics", response_model=GetVisitStatisticsResponse)
async def visit():
    if not store:
        raise HTTPException(status_code=500, detail="No store available")
    resp = store.get_visit_statistics()
    if not resp:
        raise HTTPException(status_code=500, detail="Can't create visit")
    return resp

