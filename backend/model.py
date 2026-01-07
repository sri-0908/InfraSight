# model.py
import pandas as pd
from sklearn.ensemble import IsolationForest

def analyze_health_data(csv_file):
    """
    Takes a CSV file and returns a risk level and trend message
    """

    df = pd.read_csv(csv_file)

    # Assume numeric columns represent health signals
    numeric_df = df.select_dtypes(include=["number"])

    if numeric_df.empty:
        return {
            "risk": "Low",
            "trend": "Insufficient numeric data"
        }

    # Train a simple anomaly detection model
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(numeric_df)

    predictions = model.predict(numeric_df)

    anomaly_count = list(predictions).count(-1)

    if anomaly_count > len(df) * 0.3:
        risk = "High"
        trend = "Abnormal spike detected"
    elif anomaly_count > 0:
        risk = "Medium"
        trend = "Unusual pattern detected"
    else:
        risk = "Low"
        trend = "Normal pattern observed"

    return {
        "risk": risk,
        "trend": trend
    }
