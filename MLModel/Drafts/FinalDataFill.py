import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer
from sklearn.experimental import enable_iterative_imputer  # noqa
from sklearn.impute import IterativeImputer

# Step 1: Load your dataset
def load_data(file_path):
    return pd.read_csv(file_path)

# Step 2: Plot histograms and boxplots
def plot_distribution(df, column):
    plt.figure(figsize=(10, 5))
    
    # Histogram
    plt.subplot(1, 2, 1)
    sns.histplot(df[column].dropna(), kde=True)
    plt.title(f'Histogram of {column}')
    
    # Boxplot to check for outliers
    plt.subplot(1, 2, 2)
    sns.boxplot(x=df[column].dropna())
    plt.title(f'Boxplot of {column}')
    
    plt.tight_layout()
    plt.show()

# Step 3: Check skewness to decide imputation strategy
def check_skewness(df, column):
    skewness = df[column].skew()
    print(f"Skewness of {column}: {skewness:.2f}")
    
    # Decide imputation strategy based on skewness
    if abs(skewness) < 0.5:
        strategy = 'mean'
    else:
        strategy = 'median'
    
    print(f"Chosen imputation strategy for {column}: {strategy}")
    return strategy

# Step 4: Mean/Median imputation for Injury, NRS_pain, and Mental
def simple_imputation(df):
    columns_simple = ['Injury', 'NRS_pain', 'Mental']
    
    for column in columns_simple:
        # Plot distribution and check skewness
        plot_distribution(df, column)
        strategy = check_skewness(df, column)
        
        # Apply chosen imputation strategy
        imputer = SimpleImputer(strategy=strategy)
        df[[column]] = imputer.fit_transform(df[[column]])
    
    return df

# Step 5: Apply Multiple Imputation (MICE) for columns with more than 80% missing data
def multiple_imputation(df):
    columns_mice = ['SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']
    mice_features = ['Sex', 'Age', 'Injury', 'NRS_pain', 'Mental', 'KTAS_expert'] + columns_mice
    
    mice_imputer = IterativeImputer(max_iter=10, random_state=0)
    df[mice_features] = mice_imputer.fit_transform(df[mice_features])
    
    return df

# Step 6: Full pipeline to clean data
def clean_data(file_path):
    df = load_data(file_path)
    
    # Simple imputation for Injury, NRS_pain, and Mental with dynamic strategy
    df = simple_imputation(df)
    
    # Multiple imputation using MICE for columns with high missing values
    df = multiple_imputation(df)
    
    return df

# Step 7: Save or analyze the cleaned dataset
def save_cleaned_data(df, output_path):
    df.to_csv(output_path, index=False)

# Example usage
file_path = './Data/final_dataset.csv'
output_path = './Data/final_dataset_cleaned.csv'

# Clean the data and save it
df = clean_data(file_path)
save_cleaned_data(df, output_path)

