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


# # Step 3: Visualize distributions for numerical columns
# numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# for col in numerical_cols:
#     plt.figure(figsize=(10, 5))
#     sns.histplot(df[col], kde=True)
#     plt.title(f'Distribution of {col}')
#     plt.xlabel(col)
#     plt.ylabel('Frequency')
#     plt.axvline(df[col].mean(), color='red', linestyle='--', label='Mean')
#     plt.axvline(df[col].median(), color='blue', linestyle='--', label='Median')
#     plt.legend()
#     plt.show()

# # Step 4: Suggest imputation strategies
# for col in missing_analysis.index:
#     if missing_analysis.loc[col, 'Missing Values'] == 0:
#         continue
    
#     dtype = missing_analysis.loc[col, 'Data Type']
#     missing_count = missing_analysis.loc[col, 'Missing Values']
#     print(f"\nSuggestions for '{col}':")
            
#     if dtype in ['int64', 'float64']:  # Numerical column
#         # It recommends imputation strategies based on the percentage of missing values
#         if missing_count / len(df) < 0.1:
#             print(" - Consider using mean or median imputation.")
#         elif 0.1 <= missing_count / len(df) < 0.5:
#             print(" - KNN imputation or regression-based imputation is recommended.")
#         else:
#             print(" - Consider using advanced techniques like multiple imputation or dropping the column if necessary.")
#     else:
#         print(" - No specific strategy suggested; please investigate further.")

# print("\nAnalysis completed.")