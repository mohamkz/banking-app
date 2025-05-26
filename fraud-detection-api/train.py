import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os

print("Starting Fraud Detection Model Training...")

print("Loading dataset...")
df = pd.read_csv("data/fraud_dataset.csv")
print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

print("Preprocessing data...")
df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
df['type_enc'] = LabelEncoder().fit_transform(df['type'])
df['sender_account'] = df['sender_account'].fillna(-1)

X = df[['amount', 'hour', 'type_enc', 'receiver_account', 'sender_account']]
y = df['is_fraud']

fraud_rate = y.mean() * 100
print(f"Dataset stats: {fraud_rate:.2f}% fraud rate ({y.sum()} fraud cases)")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Data split: {len(X_train)} training, {len(X_test)} testing samples")

print("Training Logistic Regression model...")
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

os.makedirs("model", exist_ok=True)

model_path = "model/fraud_model.pkl"
joblib.dump(model, model_path)

print("\n" + "=" * 50)
print("MODEL TRAINING COMPLETED!")
print(f"Model saved to: {model_path}")
print(f"Final accuracy: {accuracy:.4f}")
print("=" * 50)