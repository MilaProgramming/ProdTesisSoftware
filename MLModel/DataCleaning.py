import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def load_data(file_path):
    """Load the dataset."""
    return pd.read_csv(file_path, delimiter=';', encoding='latin1')

def replace_invalid_data(data, invalid_value='??'):
    """Replace invalid entries with NaN."""
    data.replace(invalid_value, np.nan, inplace=True)

def clean_nrs_pain(data):
    """Clean the NRS_pain column and impute missing values."""
    # Convert to numeric, coercing errors to NaN
    data['NRS_pain'] = pd.to_numeric(data['NRS_pain'], errors='coerce')
    
    # Count missing values
    missing_count = data['NRS_pain'].isnull().sum()
    
    # Impute missing values with mean
    mean_value = data['NRS_pain'].mean()
    # Instead of inplace=True, directly assign back to the column
    data['NRS_pain'] = data['NRS_pain'].fillna(mean_value)
    
    return missing_count

def remove_missing_values(data, columns):
    """Remove rows with missing values in specified columns."""
    return data.dropna(subset=columns)

def ensure_numeric(data, column_name):
    """Ensure the specified column is numeric."""
    data[column_name] = pd.to_numeric(data[column_name], errors='coerce')

def prepare_data_for_regression(data, features):
    """Prepare the data for regression by dropping missing values."""
    data = data.dropna(subset=features)
    return data[data['Saturation'].notnull()]

def train_linear_regression(X_train, y_train):
    """Train a Linear Regression model."""
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

def predict_missing_saturation(model, missing_data, features):
    """Predict and fill missing Saturation values."""
    X_missing = missing_data[features]
    predicted_saturation = model.predict(X_missing)
    return predicted_saturation

def save_to_csv(data, output_file_path):
    """Save the DataFrame to a CSV file."""
    data.to_csv(output_file_path, index=False)
    print(f"Cleaned data saved to {output_file_path}")

def remove_columns(data, columns_to_remove):
    """Remove specified columns from the DataFrame."""
    return data.drop(columns=columns_to_remove)

def convert_object_to_numeric(data):
    """Convert columns of type object to int64 or float64 depending on their content, handling commas and points."""
    for column in data.select_dtypes(include=['object']).columns:
        # First, check and remove commas from the column if present
        if data[column].str.contains(r'\,').any():
            data[column] = data[column].str.replace(',', '.')
            print(f"Removed commas in {column}")
        
        # Then, check if there are points (decimals) in the column
        if data[column].str.contains(r'\.').any():
            # If points are found, convert to float directly
            try:
                data[column] = pd.to_numeric(data[column], errors='raise').astype('float64')
                print(f"Converted {column} to float64 due to presence of points (decimals)")
            except ValueError:
                print(f"Could not convert {column} to float64")
        else:
            # Try converting to integer if there are no points
            try:
                data[column] = pd.to_numeric(data[column], errors='raise').astype('int64')
                print(f"Converted {column} to int64")
            except ValueError:
                # If integer conversion fails, try converting to float as fallback
                try:
                    data[column] = pd.to_numeric(data[column], errors='raise').astype('float64')
                    print(f"Converted {column} to float64")
                except ValueError:
                    print(f"Could not convert {column} to numeric types")
    
    return data


def main(file_path):
    # Load your dataset
    data = load_data(file_path)

    # Step 1: Replace invalid data
    replace_invalid_data(data)

    # Step 2: Clean the NRS_pain column
    missing_nrs_pain_count = clean_nrs_pain(data)
    print(f'Missing values in NRS_pain after cleaning: {missing_nrs_pain_count}')

    # Step 3: Check for missing values in all columns
    print("Missing values before cleaning:")
    print(data.isnull().sum()[data.isnull().sum() > 0])

    # Step 4: Remove rows with missing values in specified columns
    columns_to_check = ['Chief_complain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Diagnosis in ED']
    data = remove_missing_values(data, columns_to_check)

    print(f'Number of rows after cleaning: {len(data)}')

    # Step 5: Ensure Saturation is numeric
    ensure_numeric(data, 'Saturation')

    # Step 6: Select features to predict Saturation
    features = ['Age', 'RR']  # Add more features as needed
    train_data = prepare_data_for_regression(data, features)

    # Step 7: Split the data into training (75%) and testing (25%)
    X_train, X_test, y_train, y_test = train_test_split(
        train_data[features], 
        train_data['Saturation'], 
        test_size=0.25, 
        random_state=42
    )

    # Step 8: Fit the regression model on the training data
    model = train_linear_regression(X_train, y_train)

    # Step 9: Predict Saturation for the test data (25%)
    y_pred = model.predict(X_test)

    # Step 10: Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    print(f"Root Mean Squared Error (RMSE): {rmse}")

    # Step 11: Predict missing Saturation values
    missing_saturation = data[data['Saturation'].isnull()]
    predicted_saturation = predict_missing_saturation(model, missing_saturation, features)
    
    # Fill predicted values into the original data
    data.loc[data['Saturation'].isnull(), 'Saturation'] = predicted_saturation

    # Step 12: Check how many missing values remain
    print(f'Missing Saturation values after prediction: {data["Saturation"].isnull().sum()}')

    # Optional: Print the Saturation values
    print(data['Saturation'])

    # Final missing values check
    print("Final missing values:")
    print(data.isnull().sum()[data.isnull().sum() > 0])
    
    #Remove some text non relevant columns
    columns_to_remove = ['Chief_complain', 'Diagnosis in ED']  # Replace with actual column names
    data = remove_columns(data, columns_to_remove)
    print(f"Removed columns: {columns_to_remove}")
    
    data = convert_object_to_numeric(data)
    print(data.dtypes)
    
    # Save cleaned data to a new CSV file
    output_file_path = './Data/training_data.csv'  # Specify the desired output path
    save_to_csv(data, output_file_path)


if __name__ == "__main__":
    file_path = './Data/data.csv'
    main(file_path)
