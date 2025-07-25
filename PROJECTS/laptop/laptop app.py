from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import joblib
import pandas as pd
import json
import os
from datetime import datetime
import numpy as np
import re

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Load the trained model
try:
    model = joblib.load('model.joblib')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load the dataset to get feature names and possible values
try:
    df = pd.read_csv('clean_lptp.csv')
    print("Dataset loaded successfully!")
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = None

# Initialize prediction history file
HISTORY_FILE = 'prediction_history.json'

def load_history():
    """Load prediction history from JSON file"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_history(history):
    """Save prediction history to JSON file"""
    try:
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")

def preprocess_input(data):
    """Preprocess input data for prediction"""
    # Create a DataFrame with the input data
    input_df = pd.DataFrame([data])
    # Ensure all required columns are present (all lowercase, matching model)
    required_columns = [
        'brand', 'processor_brand', 'processor_name', 'processor_gnrtn',
        'ram_gb', 'ram_type', 'ssd', 'hdd', 'graphic_card_gb', 'warranty', 'Touchscreen'
    ]
    for col in required_columns:
        if col not in input_df.columns:
            input_df[col] = 0
    # Do NOT change column names or case
    # Convert categorical variables to numeric if needed (optional, only if model expects it)
    # categorical_columns = ['brand', 'processor_brand', 'processor_name', 'ram_type']
    # for col in categorical_columns:
    #     if col in input_df.columns:
    #         input_df[col] = input_df[col].astype('category').cat.codes
    return input_df[required_columns]

# Hardcoded mappings from training
brand_dict = {'ASUS':1, 'Lenovo':2, 'acer':3, 'Avita':4, 'HP':5, 'DELL':6, 'MSI':7, 'APPLE':8}
proc_brand_dict = {'Intel':1, 'AMD':2, 'M1':3}
proc_name_dict = {'Core i3':1, 'Core i5':2, 'Celeron Dual':3, 'Ryzen 5':4, 'Core i7':5, 'Core i9':6, 'M1':7, 'Pentium Quad':8, 'Ryzen 3':9, 'Ryzen 7':10, 'Ryzen 9':11}
proc_gen_dict = {'10th':1, 'Not Available':2, '11th':3, '7th':4, '8th':5, '9th':6, '4th':7, '12th':8}
ram_type_dict = {'DDR4':1, 'LPDDR4':2, 'LPDDR4X':3, 'DDR5':4, 'DDR3':5, 'LPDDR3':6}
graphic_card_dict = {'0':0, '2':2, '4':4, '6':6, '8':8}
warranty_dict = {'No warranty':1, '1 year':2, '2 years':3, '3 years':4}
touchscreen_dict = {'No':1, 'Yes':2}

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/project')
def project():
    """Prediction form page"""
    return render_template('project.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle price prediction"""
    if model is None:
        flash('Model not available. Please check the model file.', 'error')
        return redirect(url_for('project'))
    
    try:
        # Get form data with correct feature names
        warranty_str = request.form.get('warranty', 'No warranty')
        data = {
            'brand': brand_dict.get(request.form.get('brand'), 0),
            'processor_brand': proc_brand_dict.get(request.form.get('processor_brand'), 0),
            'processor_name': proc_name_dict.get(request.form.get('processor_name'), 0),
            'processor_gnrtn': proc_gen_dict.get(request.form.get('processor_gnrtn'), 0),
            'ram_gb': int(request.form.get('ram_gb', 0)),
            'ram_type': ram_type_dict.get(request.form.get('ram_type'), 0),
            'ssd': int(request.form.get('ssd', 0)),
            'hdd': int(request.form.get('hdd', 0)),
            'graphic_card_gb': graphic_card_dict.get(request.form.get('graphics_card'), 0),
            'warranty': warranty_dict.get(warranty_str, 1),
            'Touchscreen': touchscreen_dict.get(request.form.get('Touchscreen'), 1)
        }
        # Validate required fields
        required_fields = ['brand', 'processor_brand', 'processor_name', 'ram_type', 'graphic_card_gb']
        for field in required_fields:
            if data[field] in [None, '', ' ']:
                flash(f'{field.replace("_", " ").title()} is required.', 'error')
                return redirect(url_for('project'))
        # Preprocess input data
        input_df = preprocess_input(data)
        # Make prediction
        prediction = model.predict(input_df)[0]
        # Format prediction (assuming it's a price in some currency)
        formatted_prediction = f"₹{prediction:,.2f}" if isinstance(prediction, (int, float)) else str(prediction)
        # Save to history
        history = load_history()
        history_entry = {
            'id': len(history) + 1,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'specifications': data,
            'predicted_price': formatted_prediction
        }
        history.append(history_entry)
        save_history(history)
        flash(f'Predicted Price: {formatted_prediction}', 'success')
        return redirect(url_for('project'))
    except Exception as e:
        flash(f'Error making prediction: {str(e)}', 'error')
        return redirect(url_for('project'))

@app.route('/history')
def history():
    """View prediction history"""
    history = load_history()
    return render_template('history.html', history=history)

@app.route('/clear_history')
def clear_history():
    """Clear prediction history"""
    save_history([])
    flash('Prediction history cleared successfully!', 'success')
    return redirect(url_for('history'))

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API endpoint for predictions"""
    if model is None:
        return jsonify({'error': 'Model not available'}), 500
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Preprocess input data
        input_df = preprocess_input(data)
        
        # Make prediction
        prediction = model.predict(input_df)[0]
        
        return jsonify({
            'predicted_price': prediction,
            'formatted_price': f"₹{prediction:,.2f}" if isinstance(prediction, (int, float)) else str(prediction)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Laptop Price Predictor...")
    print("Available routes:")
    print("- / : Home page")
    print("- /project : Prediction form")
    print("- /history : Prediction history")
    print("- /about : About page")
    print("- /contact : Contact page")
    print("- /api/predict : API endpoint for predictions")
    
    app.run(debug=True, host='0.0.0.0', port=5005)
