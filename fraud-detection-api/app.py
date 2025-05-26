from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()
model = joblib.load("model/fraud_model.pkl")

class Transaction(BaseModel):
    amount: float
    timestamp: str
    type: str
    receiver_account: int
    sender_account: int = -1

@app.post("/predict-fraud")
def predict(transaction: Transaction):
    hour = pd.to_datetime(transaction.timestamp).hour
    type_map = {'DEPOSIT': 0, 'TRANSFER': 1}
    type_enc = type_map.get(transaction.type, 0)
    
    X = [[
        transaction.amount,
        hour,
        type_enc,
        transaction.receiver_account,
        transaction.sender_account
    ]]
    
    prediction = model.predict(X)[0]
    probability = round(model.predict_proba(X)[0][1], 2)

    return {
        "is_fraud": bool(prediction),
        "risk_score": float(probability)
    }
