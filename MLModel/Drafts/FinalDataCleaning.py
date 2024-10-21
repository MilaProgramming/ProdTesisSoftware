import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('./Data/final_dataset.csv')

# Step 1: Analyze missing values
missing_info = df.isnull().sum()    
missing_percent = (missing_info / len(df)) * 100
missing_analysis = pd.DataFrame({
    'Missing Values': missing_info,
    'Percentage': missing_percent,
    'Data Type': df.dtypes
})

print("Missing Values Analysis:")
print(missing_analysis[missing_analysis['Missing Values'] > 0])


# List of labels
labels = ['Sex', 'Age', 'Injury', 'NRS_pain', 'Mental', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation', 'KTAS_expert']

# Step 3: Visualize distributions for numerical columns in a single chart
numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# Create subplots: 4 rows, 3 columns
fig, axes = plt.subplots(nrows=4, ncols=3, figsize=(15, 12))
axes = axes.flatten()

# Plot each column in a subplot
for i, col in enumerate(labels):
    if col in numerical_cols:  # Check if the label is in the numerical columns
        sns.histplot(df[col], kde=True, ax=axes[i])
        axes[i].set_title(f'Distribución de {col}')
        axes[i].set_xlabel(col)
        axes[i].set_ylabel('Frecuencia')
        axes[i].axvline(df[col].mean(), color='red', linestyle='--', label='Mean')
        axes[i].axvline(df[col].median(), color='blue', linestyle='--', label='Median')
        axes[i].legend()

# Remove any empty subplots
for j in range(i+1, len(axes)):
    fig.delaxes(axes[j])

# Adjust layout
plt.tight_layout()
plt.show()

# Step 4: Suggest imputation strategies
for col in missing_analysis.index:
    if missing_analysis.loc[col, 'Missing Values'] == 0:
        continue
    
    dtype = missing_analysis.loc[col, 'Data Type']
    missing_count = missing_analysis.loc[col, 'Missing Values']
    print(f"\nSuggestions for '{col}':")
            
    if dtype in ['int64', 'float64']:  # Numerical column
        # It recommends imputation strategies based on the percentage of missing values
        if missing_count / len(df) < 0.1:
            print(" - Consider using mean or median imputation.")
        elif 0.1 <= missing_count / len(df) < 0.5:
            print(" - KNN imputation or regression-based imputation is recommended.")
        else:
            print(" - Consider using advanced techniques like multiple imputation or dropping the column if necessary.")
    else:
        print(" - No specific strategy suggested; please investigate further.")

print("\nAnalysis completed.")