# Laptop Price Predictor

A machine learning-based web application that predicts laptop prices based on specifications using Flask and scikit-learn.

## Features

- 🎯 **Accurate Price Predictions**: Uses a trained machine learning model to estimate laptop prices
- ⚡ **Instant Results**: Get price predictions in real-time
- 📊 **Prediction History**: Track and view all your previous predictions
- 🎨 **Modern UI**: Beautiful, responsive web interface
- 📱 **Mobile Friendly**: Works perfectly on all devices

## Project Structure

```
laptop/
├── laptop app.py          # Main Flask application
├── model.joblib          # Trained machine learning model
├── clean_lptp.csv        # Cleaned dataset
├── requirements.txt      # Python dependencies
├── README.md            # Project documentation
└── Templates/           # HTML templates
    ├── index.html       # Home page
    ├── project.html     # Prediction form
    ├── history.html     # Prediction history
    ├── about.html       # About page
    └── contact.html     # Contact page
```

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python "laptop app.py"
   ```

4. **Open your browser and go to**:
   ```
   http://localhost:5005
   ```

## How to Use

1. **Home Page**: Navigate to the home page to see the main interface
2. **Predict Price**: Click "Predict Price" to enter laptop specifications
3. **Enter Specifications**: Fill in the form with your laptop details:
   - Brand (ASUS, Lenovo, HP, etc.)
   - Processor details (Brand, Name, Generation)
   - RAM specifications (Size and Type)
   - Storage (SSD and HDD sizes)
   - Graphics card
   - Warranty information
   - Touchscreen option
4. **Get Prediction**: Click "Predict Price" to get your estimated price
5. **View History**: Check your prediction history to track previous estimates

## Model Information

The application uses a **Decision Tree Classifier** trained on laptop price data with the following features:

- **Brand**: Laptop manufacturer
- **Processor Brand**: Intel, AMD, or M1
- **Processor Name**: Core i3/i5/i7/i9, Ryzen series, etc.
- **Processor Generation**: 4th to 12th generation
- **RAM**: 4GB to 32GB with different types (DDR3, DDR4, DDR5, etc.)
- **Storage**: SSD and HDD combinations
- **Graphics Card**: Integrated to 8GB dedicated graphics
- **Warranty**: No warranty to 3 years
- **Touchscreen**: Yes/No option

## Technical Details

- **Framework**: Flask (Python web framework)
- **Machine Learning**: scikit-learn
- **Model**: Decision Tree Classifier
- **Data Storage**: JSON file for prediction history
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Modern gradient design with responsive layout

## API Endpoints

- `GET /` - Home page
- `GET /project` - Prediction form
- `POST /predict` - Make price prediction
- `GET /history` - View prediction history
- `GET /about` - About page
- `GET /contact` - Contact page
- `GET /clear_history` - Clear prediction history

## Supported Laptop Brands

- ASUS
- Lenovo
- Acer
- Avita
- HP
- DELL
- MSI
- APPLE

## Supported Processors

- **Intel**: Core i3, Core i5, Core i7, Core i9, Celeron Dual, Pentium Quad
- **AMD**: Ryzen 3, Ryzen 5, Ryzen 7, Ryzen 9
- **Apple**: M1

## File Descriptions

- `laptop app.py`: Main Flask application with all routes and logic
- `model.joblib`: Serialized trained machine learning model
- `clean_lptp.csv`: Cleaned and preprocessed dataset
- `laptopprice1.ipynb`: Jupyter notebook with model training code
- `prediction_history.json`: Stores user prediction history (created automatically)

## Troubleshooting

1. **Port already in use**: Change the port in `laptop app.py` line 108
2. **Model not found**: Ensure `model.joblib` is in the same directory
3. **Dependencies error**: Run `pip install -r requirements.txt`
4. **Template not found**: Ensure all HTML files are in the `Templates/` folder

## Contributing

Feel free to contribute to this project by:
- Improving the UI/UX
- Adding new features
- Optimizing the machine learning model
- Fixing bugs

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please refer to the contact page in the application. 