PLANS = [
    {
        "id": "plan_a",
        "name": "Plan A",
        "version": "1.0",
        "status": "active",
        "url": "/api/plan-a/run",
        "description": "Basic plan for testing"
    },
    {
        "id": "plan_b",
        "name": "Plan B",
        "version": "2.1",
        "status": "inactive",
        "url": "/api/plan-b/run",
        "description": "Advanced plan with extra features"
    }
]


In api:
from fastapi import FastAPI
from plans_config import PLANS

app = FastAPI()

@app.get("/plans")
def get_plans():
    return PLANS