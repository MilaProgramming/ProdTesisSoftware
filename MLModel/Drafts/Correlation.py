import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load your dataset
file_path = './Data/data.csv'
data = pd.read_csv(file_path, delimiter=';', encoding='latin1')  # Special encoding for the file

# Clean the data (replace '??' with NaN and ensure Saturation is numeric)
data.replace('??', np.nan, inplace=True)
data['Saturation'] = pd.to_numeric(data['Saturation'], errors='coerce')

# Select specific features of interest
features_of_interest = ['Saturation', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Age']
data_filtered = data[features_of_interest].dropna()  # Drop rows with NaN values in these columns

# Calculate the correlation matrix for the selected features
correlation_matrix = data_filtered.corr()

# Extract the correlation values for 'Saturation' and drop self-correlation
saturation_correlation = correlation_matrix['Saturation'].drop(labels=['Saturation'])

# Sort values for better visualization
saturation_correlation = saturation_correlation.sort_values(ascending=False)

# Print the correlation coefficients
print("Correlation Coefficients with Saturation:")
print(saturation_correlation)

# Plotting the correlation with Saturation
plt.figure(figsize=(10, 6))
saturation_correlation.plo(kind='bar', color='skyblue')
plt.title('Correlación de las características con Saturation', fontsize=16)
plt.xlabel('Características', fontsize=14)
plt.ylabel('Coeficiente de Correlación', fontsize=14)
plt.axhline(0, color='gray', linewidth=0.8, linestyle='--')  # Add a line at y=0 for reference
plt.xticks(rotation=45, fontsize=12)
plt.tight_layout()  # Adjust layout to prevent clipping
plt.show()
