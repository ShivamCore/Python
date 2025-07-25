from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import numpy as np
import os
import joblib
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key_here' # Added for session

# Try to load the trained model if available
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/apply')
def apply():
    return render_template('loan_form.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/history')
def history():
    return render_template('history.html', history=session.get('history', []))

@app.route('/loan_predict', methods=['POST'])
def loan_predict():
    try:
        data = request.form
        # Preprocess input for model
        features = [
            int(data.get('age', 0)),
            1 if data.get('gender') == 'Male' else 0,
            1 if data.get('marital_status') == 'Married' else 0,
            int(data.get('dependents', 0)),
            1 if data.get('education') == 'Graduate' else 0,
            1 if data.get('employment_status') == 'Employed' or data.get('employment_status') == 'Self-Employed' else 0,
            float(data.get('applicant_income', 0)),
            float(data.get('coapplicant_income', 0)),
            float(data.get('loan_amount', 0)),
            float(data.get('loan_amount_term', 0)),
            int(data.get('credit_history', 1)),
            {'Urban':2, 'Semiurban':1, 'Rural':0}.get(data.get('property_area'), 0)
        ]
        # Predict
        if model:
            prediction = model.predict([features])[0]
            result = 'Loan Approved!' if prediction == 1 or str(prediction).lower() == 'approved' else 'Loan Rejected!'
        else:
            # Rule-based scoring system
            score = 0
            age = features[0]
            gender = features[1]
            marital = features[2]
            dependents = features[3]
            education = features[4]
            employment = features[5]
            applicant_income = features[6]
            coapplicant_income = features[7]
            loan_amount = features[8]
            loan_amount_term = features[9]
            credit_history = features[10]
            property_area = features[11]

            # Credit History
            if credit_history == 1:
                score += 3
            else:
                score -= 2
            # Applicant Income
            if applicant_income > 50000:
                score += 3
            elif applicant_income > 30000:
                score += 2
            elif applicant_income > 15000:
                score += 1
            # Coapplicant Income
            if coapplicant_income > 20000:
                score += 1
            # Loan Amount
            if loan_amount < 200000:
                score += 2
            elif loan_amount < 400000:
                score += 1
            else:
                score -= 2
            # Loan Amount Term
            if loan_amount_term < 180:
                score += 1
            elif loan_amount_term > 360:
                score -= 1
            # Employment Status
            if employment == 1:
                score += 1
            # Education
            if education == 1:
                score += 1
            # Dependents
            if dependents <= 2:
                score += 1
            # Property Area
            if property_area == 2 or property_area == 1:
                score += 1
            # Age
            if 21 <= age <= 60:
                score += 1
            # Final decision
            result = 'Loan Approved!' if score >= 6 else 'Loan Rejected!'
        # Store in session history
        history = session.get('history', [])
        history.insert(0, {
            'name': data.get('applicant_name', 'N/A'),
            'result': result,
            'time': datetime.now().strftime('%d %b %Y, %I:%M %p')
        })
        session['history'] = history[:20]
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5006) 