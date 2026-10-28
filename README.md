# Python & Machine Learning Portfolio

A learning repository covering Python fundamentals, the data/ML stack, deep-learning notebooks, and a set of small but complete ML web apps — each one a trained model served through a Flask UI. Built while learning (July–August 2025).

This is a study and mini-project collection, not a library or a single product. The most substantial, evidence-backed work is in [`PROJECTS/`](PROJECTS/).

## Applied ML projects (`PROJECTS/`)

Each project follows the same end-to-end shape: explore and clean a dataset in a Jupyter notebook, train a scikit-learn model, save it (`model.joblib`), and serve predictions from a Flask app with HTML templates. Datasets and trained models are committed, so predictions run without retraining.

| Project | Task | Dataset (rows) | Model (verified) |
|---|---|---|---|
| [`crop/`](PROJECTS/crop/) | Recommend a crop from soil/climate features | `crop.csv` (2,200) | `DecisionTreeClassifier` — loads and predicts |
| [`insurance/`](PROJECTS/insurance/) | Predict insurance charges | `insurance.csv` (1,338) | `DecisionTreeRegressor` — loads and predicts |
| [`laptop/`](PROJECTS/laptop/) | Predict laptop price from specs | `clean_lptp.csv` (802) | `DecisionTreeClassifier` — loads and predicts; has its own [README](PROJECTS/laptop/README.md) |
| [`bikes/`](PROJECTS/bikes/) | Used-bike price/category model | `Used_Bikes.csv` (32,648) | `DecisionTreeClassifier` — loads and predicts |
| [`loan approval/`](PROJECTS/loan%20approval/) | Loan-approval classifier | `Credit (1).csv` (4,521) | Trained in the notebook; the app loads `model.joblib` if present (not committed) |
| [`Login Detector/`](PROJECTS/Login%20Detector/) | **Risk-Based Authentication:** classify login attempts as legitimate vs. attacker using re-authentication, round-trip-time and related signals; reproduces published RBA results ([RESULTS.md](PROJECTS/Login%20Detector/login/RESULTS.md)). Flask app + separate `login`/`attack`/`rtt` models (scaler, feature selector, estimator each). | — | scikit-learn, `.pkl` artifacts committed under `models/` |
| [`BTC/`](PROJECTS/BTC/) | Bitcoin data pull + an auto-update notebook, with logged data | `BTCDB.csv`, `trades_log.csv` | Notebook-based |
| [`ATM/`](PROJECTS/ATM/), `BMI calculator/` | Small console programs | — | — |

> I verified the committed `model.joblib` files for `crop`, `insurance`, `laptop` and `bikes` by loading each in a clean environment: all four are fitted scikit-learn estimators with a working `predict`. The `loan approval` app is written to load a model if one is present; no model file is committed, so it must be trained from the notebook first.

## Deep learning (`DL/`)

Notebook introductions to the main architectures, using TensorFlow/Keras:

- `DL/ANN/` — `basic.ipynb`, `credit.ipynb` (tabular classification with a dense network)
- `DL/CNN/cat_dog.ipynb` — a cat-vs-dog image classifier. The training images (~697 JPGs) are committed under `DL/CNN/Data/`, and a trained `cat_dog_model.h5` is included.
- `DL/RNN/basic.ipynb`, `DL/NLP/nlp.ipynb` — sequence and text basics.

## Fundamentals

- `PYTHON/` — language practice: loops, functions, OOP, a calculator, a to-do list, an ATM.
- `NUMPY/`, `PANDAS/`, `MATPLOTLIB & SEABON/` — notebook intros to the numeric and plotting stack.
- `Model training/` — a reusable training script (`enhanced_model_training.py`) and a serving app.

## Running a project

Example (crop recommendation):

```bash
cd "PROJECTS/crop"
pip install flask scikit-learn joblib pandas
python app.py            # Flask dev server; open the printed localhost URL
```

Other projects follow the same pattern; `laptop/` ships a `requirements.txt` and a `run_app.py` helper. The deep-learning notebooks need `tensorflow`, `numpy`, `pandas` and `scikit-learn` and are run in Jupyter.

## Notes

- **Models are small decision trees**, chosen for transparency and fast inference, not maximised accuracy. No benchmark or accuracy figures are claimed here beyond what each project's own notebook shows.
- **Repository size**: most of the ~720 images are the committed cat/dog CNN training set under `DL/CNN/Data/`.
- These are learning artifacts; they are preserved as a record of progress rather than maintained as production services.
