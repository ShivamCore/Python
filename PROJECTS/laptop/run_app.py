#!/usr/bin/env python3
"""
Laptop Price Predictor - Application Runner
===========================================

This script provides an easy way to run the Laptop Price Predictor application.
It includes dependency checking and helpful startup messages.

Usage:
    python run_app.py
"""

import sys
import os
import subprocess
import importlib.util

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'flask',
        'pandas', 
        'scikit-learn',
        'joblib',
        'numpy'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        if importlib.util.find_spec(package) is None:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\n📦 Installing missing packages...")
        
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install'] + missing_packages)
            print("✅ All packages installed successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to install packages. Please run:")
            print(f"   pip install {' '.join(missing_packages)}")
            return False
    
    return True

def check_files():
    """Check if required files exist"""
    required_files = [
        'model.joblib',
        'clean_lptp.csv',
        'laptop app.py'
    ]
    
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        print("\nPlease ensure all required files are in the current directory.")
        return False
    
    return True

def main():
    """Main function to run the application"""
    print("🚀 Laptop Price Predictor - Application Runner")
    print("=" * 50)
    
    # Check dependencies
    print("\n🔍 Checking dependencies...")
    if not check_dependencies():
        return
    
    # Check required files
    print("\n📁 Checking required files...")
    if not check_files():
        return
    
    print("\n✅ All checks passed!")
    print("\n🌐 Starting the application...")
    print("📱 The application will be available at: http://localhost:5005")
    print("🛑 Press Ctrl+C to stop the application")
    print("\n" + "=" * 50)
    
    # Import and run the Flask app
    try:
        from laptop_app import app
        app.run(debug=True, host='0.0.0.0', port=5005)
    except ImportError as e:
        print(f"❌ Error importing application: {e}")
        print("Make sure 'laptop app.py' is in the current directory.")
    except KeyboardInterrupt:
        print("\n\n👋 Application stopped by user.")
    except Exception as e:
        print(f"\n❌ Error running application: {e}")

if __name__ == '__main__':
    main() 