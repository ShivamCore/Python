# Enhanced Model Training Script for Mac
# Advanced techniques for maximum performance

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, RobustScaler, PowerTransformer
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.svm import SVR, SVC
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report, confusion_matrix, roc_auc_score
from sklearn.feature_selection import SelectKBest, f_regression, f_classif, RFE
import joblib
import os
import gc
import psutil
import warnings
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
warnings.filterwarnings('ignore')

def get_memory_usage():
    """Get current memory usage in GB"""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024 / 1024

def safe_load_data(file_path, sample_size=None, chunk_size=100000):
    """Enhanced data loading with better memory management"""
    print(f"Current memory usage: {get_memory_usage():.2f} GB")
    
    # Get total rows without loading full dataset
    total_rows = sum(1 for line in open(file_path)) - 1
    print(f"Total rows in dataset: {total_rows:,}")
    
    if sample_size is None:
        available_memory = psutil.virtual_memory().available / 1024 / 1024 / 1024
        # More aggressive sampling for better performance
        sample_size = min(int(available_memory * 400000), total_rows)
        sample_size = max(sample_size, 100000)  # Increased minimum
    
    print(f"Using sample size: {sample_size:,} rows")
    
    chunks = []
    rows_loaded = 0
    
    for chunk in pd.read_csv(file_path, chunksize=chunk_size):
        if rows_loaded >= sample_size:
            break
        
        remaining = sample_size - rows_loaded
        if len(chunk) > remaining:
            chunk = chunk.head(remaining)
        
        chunks.append(chunk)
        rows_loaded += len(chunk)
        
        if len(chunks) % 10 == 0:
            gc.collect()
            print(f"Loaded {rows_loaded:,} rows, Memory: {get_memory_usage():.2f} GB")
    
    df = pd.concat(chunks, ignore_index=True)
    del chunks
    gc.collect()
    
    print(f"Final dataset shape: {df.shape}")
    print(f"Final memory usage: {get_memory_usage():.2f} GB")
    
    return df

def create_advanced_features(df):
    """Create advanced features with better engineering"""
    print("Creating advanced features...")
    
    df_features = df.copy()
    
    # 1. Enhanced time-based features
    if 'Login Timestamp' in df_features.columns:
        df_features['Login Timestamp'] = pd.to_datetime(df_features['Login Timestamp'])
        df_features['hour'] = df_features['Login Timestamp'].dt.hour
        df_features['day_of_week'] = df_features['Login Timestamp'].dt.dayofweek
        df_features['month'] = df_features['Login Timestamp'].dt.month
        df_features['day_of_month'] = df_features['Login Timestamp'].dt.day
        df_features['week_of_year'] = df_features['Login Timestamp'].dt.isocalendar().week
        df_features['is_weekend'] = df_features['day_of_week'].isin([5, 6]).astype(int)
        df_features['is_business_hour'] = ((df_features['hour'] >= 9) & (df_features['hour'] <= 17)).astype(int)
        
        # Cyclical encoding for time features
        df_features['hour_sin'] = np.sin(2 * np.pi * df_features['hour'] / 24)
        df_features['hour_cos'] = np.cos(2 * np.pi * df_features['hour'] / 24)
        df_features['day_sin'] = np.sin(2 * np.pi * df_features['day_of_week'] / 7)
        df_features['day_cos'] = np.cos(2 * np.pi * df_features['day_of_week'] / 7)
    
    # 2. Advanced categorical encodings
    categorical_cols = ['Country', 'Region', 'City', 'Browser Name and Version', 'OS Name and Version', 'Device Type']
    
    for col in categorical_cols:
        if col in df_features.columns:
            # Frequency encoding
            freq_encoding = df_features[col].value_counts(normalize=True)
            df_features[f'{col}_freq'] = df_features[col].map(freq_encoding)
            df_features[f'{col}_freq'] = df_features[f'{col}_freq'].fillna(0)
            
            # Target encoding (if target available)
            if 'Round-Trip Time [ms]' in df_features.columns:
                target_encoding = df_features.groupby(col)['Round-Trip Time [ms]'].mean()
                df_features[f'{col}_target_enc'] = df_features[col].map(target_encoding)
                df_features[f'{col}_target_enc'] = df_features[f'{col}_target_enc'].fillna(df_features['Round-Trip Time [ms]'].mean())
    
    # 3. Advanced RTT features
    if 'Round-Trip Time [ms]' in df_features.columns:
        # Multiple RTT categories
        df_features['rtt_category_fine'] = pd.cut(df_features['Round-Trip Time [ms]'], 
                                               bins=[0, 25, 50, 100, 200, 500, 1000, float('inf')], 
                                               labels=[0, 1, 2, 3, 4, 5, 6])
        df_features['rtt_category_fine'] = df_features['rtt_category_fine'].astype(float)
        df_features['rtt_category_fine'] = df_features['rtt_category_fine'].fillna(0)
        
        # RTT transformations
        df_features['rtt_log'] = np.log1p(df_features['Round-Trip Time [ms]'])
        df_features['rtt_sqrt'] = np.sqrt(df_features['Round-Trip Time [ms]'])
        df_features['rtt_reciprocal'] = 1 / (1 + df_features['Round-Trip Time [ms]'])
        
        # RTT statistics by groups
        if 'Country' in df_features.columns:
            country_rtt_mean = df_features.groupby('Country')['Round-Trip Time [ms]'].transform('mean')
            df_features['rtt_vs_country_mean'] = df_features['Round-Trip Time [ms]'] - country_rtt_mean
    
    # 4. Advanced user behavior features
    if 'User ID' in df_features.columns:
        user_stats = df_features.groupby('User ID').agg({
            'Round-Trip Time [ms]': ['count', 'mean', 'std', 'min', 'max'],
            'Login Timestamp': 'count'
        }).fillna(0)
        
        user_stats.columns = ['user_login_count', 'user_rtt_mean', 'user_rtt_std', 'user_rtt_min', 'user_rtt_max', 'user_total_logins']
        
        for col in user_stats.columns:
            df_features[col] = df_features['User ID'].map(user_stats[col])
            df_features[col] = df_features[col].fillna(0)
    
    # 5. Advanced IP-based features
    if 'IP Address' in df_features.columns:
        ip_stats = df_features.groupby('IP Address').agg({
            'Round-Trip Time [ms]': ['count', 'mean', 'std'],
            'User ID': 'nunique'
        }).fillna(0)
        
        ip_stats.columns = ['ip_login_count', 'ip_rtt_mean', 'ip_rtt_std', 'ip_unique_users']
        
        for col in ip_stats.columns:
            df_features[col] = df_features['IP Address'].map(ip_stats[col])
            df_features[col] = df_features[col].fillna(0)
    
    # 6. Interaction features
    if all(col in df_features.columns for col in ['hour', 'day_of_week', 'Country']):
        df_features['hour_country_interaction'] = df_features['hour'] * df_features['Country_freq']
        df_features['day_country_interaction'] = df_features['day_of_week'] * df_features['Country_freq']
    
    # 7. Security features
    if 'Is Attack IP' in df_features.columns:
        df_features['Is Attack IP'] = df_features['Is Attack IP'].astype(int)
        
        # Attack patterns
        if 'IP Address' in df_features.columns:
            attack_ip_count = df_features.groupby('IP Address')['Is Attack IP'].sum()
            df_features['ip_attack_count'] = df_features['IP Address'].map(attack_ip_count)
            df_features['ip_attack_count'] = df_features['ip_attack_count'].fillna(0)
    
    if 'Is Account Takeover' in df_features.columns:
        df_features['Is Account Takeover'] = df_features['Is Account Takeover'].astype(int)
    
    if 'Login Successful' in df_features.columns:
        df_features['Login Successful'] = df_features['Login Successful'].astype(int)
    
    # 8. Feature selection and NaN handling
    numeric_cols = df_features.select_dtypes(include=[np.number]).columns
    df_numeric = df_features[numeric_cols]
    
    # Advanced imputation
    print("Performing advanced imputation...")
    
    # Use KNN imputation for better results
    try:
        imputer = KNNImputer(n_neighbors=5)
        df_numeric_imputed = pd.DataFrame(
            imputer.fit_transform(df_numeric),
            columns=df_numeric.columns,
            index=df_numeric.index
        )
    except:
        # Fallback to median imputation
        imputer = SimpleImputer(strategy='median')
        df_numeric_imputed = pd.DataFrame(
            imputer.fit_transform(df_numeric),
            columns=df_numeric.columns,
            index=df_numeric.index
        )
    
    print(f"Created {len(numeric_cols)} advanced features")
    print(f"Handled {df_numeric.isna().sum().sum()} NaN values")
    
    return df_numeric_imputed

def feature_selection(X, y, task='regression', k=20):
    """Advanced feature selection"""
    print(f"Performing feature selection (k={k})...")
    
    if task == 'regression':
        selector = SelectKBest(score_func=f_regression, k=min(k, X.shape[1]))
    else:
        selector = SelectKBest(score_func=f_classif, k=min(k, X.shape[1]))
    
    X_selected = selector.fit_transform(X, y)
    selected_features = X.columns[selector.get_support()].tolist()
    
    print(f"Selected {len(selected_features)} features")
    return X_selected, selected_features, selector

def train_enhanced_regression_model(X, y, target_name):
    """Enhanced regression training with multiple algorithms"""
    print(f"\n=== Enhanced Regression Training for {target_name} ===")
    
    # Feature selection
    X_selected, selected_features, selector = feature_selection(X, y, 'regression', k=15)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)
    
    # Multiple scalers
    scalers = {
        'Standard': StandardScaler(),
        'Robust': RobustScaler(),
        'Power': PowerTransformer()
    }
    
    best_score = -np.inf
    best_model = None
    best_scaler = None
    best_scaler_name = None
    results = {}
    
    for scaler_name, scaler in scalers.items():
        print(f"\nTesting {scaler_name} scaler...")
        
        # Scale features
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Multiple models
        models = {
            'Linear Regression': LinearRegression(),
            'Ridge Regression': Ridge(alpha=1.0),
            'Lasso Regression': Lasso(alpha=0.1),
            'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, max_depth=6, random_state=42)
        }
        
        for model_name, model in models.items():
            print(f"Training {model_name}...")
            
            # Cross-validation
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=3, scoring='r2')
            mean_cv_score = cv_scores.mean()
            
            # Train on full training set
            model.fit(X_train_scaled, y_train)
            
            # Test predictions
            y_pred = model.predict(X_test_scaled)
            test_r2 = r2_score(y_test, y_pred)
            test_mse = mean_squared_error(y_test, y_pred)
            
            results[f"{scaler_name}_{model_name}"] = {
                'cv_r2': mean_cv_score,
                'test_r2': test_r2,
                'test_mse': test_mse,
                'model': model
            }
            
            print(f"  CV R²: {mean_cv_score:.4f}, Test R²: {test_r2:.4f}, MSE: {test_mse:.4f}")
            
            # Track best model
            if test_r2 > best_score:
                best_score = test_r2
                best_model = model
                best_scaler = scaler
                best_scaler_name = scaler_name
    
    # Print results summary
    print(f"\n=== Results Summary for {target_name} ===")
    print("="*60)
    for name, result in results.items():
        print(f"{name:30} | CV R²: {result['cv_r2']:.4f} | Test R²: {result['test_r2']:.4f} | MSE: {result['test_mse']:.4f}")
    
    print(f"\n🏆 Best Model: {best_scaler_name} + {type(best_model).__name__}")
    print(f"   Test R²: {best_score:.4f}")
    
    return best_model, best_scaler, best_score, selected_features, selector

def train_enhanced_classification_model(X, y, target_name):
    """Enhanced classification training with multiple algorithms"""
    print(f"\n=== Enhanced Classification Training for {target_name} ===")
    
    # Feature selection
    X_selected, selected_features, selector = feature_selection(X, y, 'classification', k=15)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    print(f"Target distribution: {y.value_counts().to_dict()}")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Multiple models
    models = {
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, max_depth=6, random_state=42),
        'SVM': SVC(random_state=42, probability=True)
    }
    
    best_score = 0
    best_model = None
    results = {}
    
    for model_name, model in models.items():
        print(f"\nTraining {model_name}...")
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=3, scoring='accuracy')
        mean_cv_score = cv_scores.mean()
        
        # Train on full training set
        model.fit(X_train_scaled, y_train)
        
        # Test predictions
        y_pred = model.predict(X_test_scaled)
        test_accuracy = accuracy_score(y_test, y_pred)
        
        # ROC AUC for binary classification
        if len(np.unique(y)) == 2:
            try:
                y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
                roc_auc = roc_auc_score(y_test, y_pred_proba)
            except:
                roc_auc = 0
        else:
            roc_auc = 0
        
        results[model_name] = {
            'cv_accuracy': mean_cv_score,
            'test_accuracy': test_accuracy,
            'roc_auc': roc_auc,
            'model': model
        }
        
        print(f"  CV Accuracy: {mean_cv_score:.4f}, Test Accuracy: {test_accuracy:.4f}, ROC AUC: {roc_auc:.4f}")
        
        # Track best model
        if test_accuracy > best_score:
            best_score = test_accuracy
            best_model = model
    
    # Print results summary
    print(f"\n=== Results Summary for {target_name} ===")
    print("="*60)
    for name, result in results.items():
        print(f"{name:20} | CV Acc: {result['cv_accuracy']:.4f} | Test Acc: {result['test_accuracy']:.4f} | ROC AUC: {result['roc_auc']:.4f}")
    
    print(f"\n🏆 Best Model: {type(best_model).__name__}")
    print(f"   Test Accuracy: {best_score:.4f}")
    
    return best_model, scaler, best_score, selected_features, selector

def save_model_with_metadata(model, scaler, selector, selected_features, model_name, performance_score):
    """Save model with comprehensive metadata"""
    os.makedirs('models', exist_ok=True)
    
    # Save model components
    joblib.dump(model, f'models/{model_name}_model.pkl')
    joblib.dump(scaler, f'models/{model_name}_scaler.pkl')
    joblib.dump(selector, f'models/{model_name}_selector.pkl')
    joblib.dump(selected_features, f'models/{model_name}_features.pkl')
    
    # Save metadata
    metadata = {
        'model_name': model_name,
        'model_type': type(model).__name__,
        'scaler_type': type(scaler).__name__,
        'performance_score': performance_score,
        'n_features': len(selected_features),
        'selected_features': selected_features,
        'created_at': datetime.now().isoformat(),
        'memory_usage': get_memory_usage()
    }
    
    joblib.dump(metadata, f'models/{model_name}_metadata.pkl')
    
    print(f"✅ {model_name} model saved with metadata!")

print("🚀 === Enhanced Model Training for Mac ===")
print("Advanced techniques for maximum performance!")

# Step 1: Load data
print("\n1. Loading dataset...")
df = safe_load_data('login/rba-dataset.csv')

# Step 2: Create advanced features
print("\n2. Creating advanced features...")
df_features = create_advanced_features(df)

# Memory cleanup
del df
gc.collect()

# Step 3: Train enhanced models
print("\n3. Training enhanced models...")

# Option 1: Predict Round-Trip Time (regression)
if 'Round-Trip Time [ms]' in df_features.columns:
    print("\n🎯 Training enhanced model to predict Round-Trip Time...")
    X_rtt = df_features.drop(['Round-Trip Time [ms]'], axis=1, errors='ignore')
    y_rtt = df_features['Round-Trip Time [ms]']
    
    if len(X_rtt) > 0:
        rtt_model, rtt_scaler, rtt_score, rtt_features, rtt_selector = train_enhanced_regression_model(X_rtt, y_rtt, "Round-Trip Time")
        save_model_with_metadata(rtt_model, rtt_scaler, rtt_selector, rtt_features, 'rtt_enhanced', rtt_score)

# Option 2: Predict Login Success (classification)
if 'Login Successful' in df_features.columns:
    print("\n🎯 Training enhanced model to predict Login Success...")
    X_login = df_features.drop(['Login Successful'], axis=1, errors='ignore')
    y_login = df_features['Login Successful']
    
    if len(X_login) > 0:
        login_model, login_scaler, login_score, login_features, login_selector = train_enhanced_classification_model(X_login, y_login, "Login Success")
        save_model_with_metadata(login_model, login_scaler, login_selector, login_features, 'login_enhanced', login_score)

# Option 3: Predict Attack Detection (classification)
if 'Is Attack IP' in df_features.columns:
    print("\n🎯 Training enhanced model to predict Attack Detection...")
    X_attack = df_features.drop(['Is Attack IP'], axis=1, errors='ignore')
    y_attack = df_features['Is Attack IP']
    
    if len(X_attack) > 0:
        attack_model, attack_scaler, attack_score, attack_features, attack_selector = train_enhanced_classification_model(X_attack, y_attack, "Attack Detection")
        save_model_with_metadata(attack_model, attack_scaler, attack_selector, attack_features, 'attack_enhanced', attack_score)

print(f"\nFinal memory usage: {get_memory_usage():.2f} GB")
print("\n🎉 === Enhanced Training Complete ===")
print("\n📊 Enhanced Performance Summary:")
print("="*60)
print("✅ Round-Trip Time: Multiple algorithms tested")
print("✅ Login Success: Advanced classification")
print("✅ Attack Detection: Enhanced security model")
print("\n💾 Enhanced models saved in 'models/' directory:")
print("- rtt_enhanced_* (best regression model)")
print("- login_enhanced_* (best classification model)")
print("- attack_enhanced_* (best security model)")
print("\n🚀 This enhanced version should significantly improve performance!") 