import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from matplotlib.ticker import MaxNLocator

file_path = './Data/data.csv'
data = pd.read_csv(file_path, delimiter=';', encoding='latin1')  # Special encoding for the file


#Remove rows with missing values in the target column
data.replace('??', np.nan, inplace=True)

# Ensure Saturation is numeric and handle errors
data['Saturation'] = pd.to_numeric(data['Saturation'], errors='coerce')

# Select features to predict Saturation
features = ['Age', 'RR']  # Add more features as needed

data = data.dropna(subset=features)  # Drop rows with missing feature values

# Use only rows where Saturation is not missing for splitting
train_data = data[data['Saturation'].notnull()]

# Split the data into training (75%) and testing (25%)
X_train, X_test, y_train, y_test = train_test_split(train_data[features], 
                                                    train_data['Saturation'], 
                                                    test_size=0.25, 
                                                    random_state=42)

# Fit the regression model on the training data
model = LinearRegression() 
model.fit(X_train, y_train)

# Predict Saturation for the test data (25%)
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)

print(f"Root Mean Squared Error (RMSE): {rmse}")

# If satisfied with the model's performance, predict missing Saturation values
missing_saturation = data[data['Saturation'].isnull()]
X_missing = missing_saturation[features]

# Predict and fill missing Saturation values
predicted_saturation = model.predict(X_missing)
data.loc[data['Saturation'].isnull(), 'Saturation'] = predicted_saturation

# Check how many missing values remain
print(data['Saturation'].isnull().sum())

#Print the saturation values
print(data['Saturation'])