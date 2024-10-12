import pandas as pd

# Step 1: Load your dataset
def load_data(file_path):
    return pd.read_csv(file_path)

# Step 2: Check missing values and data types
def check_missing_values_and_dtypes(df):
    print("---- Missing Values ----")
    missing_values = df.isnull().sum()
    missing_percentage = (df.isnull().sum() / len(df)) * 100
    
    # Combine missing counts and percentages
    missing_info = pd.DataFrame({
        'Missing Values': missing_values,
        'Percentage': missing_percentage,
        'Data Type': df.dtypes
    })
    
    print(missing_info[missing_info['Missing Values'] > 0])
    
    print("\n---- Data Types ----")
    print(df.dtypes)

# Function to map the Injury column and convert it to int64
def map_and_convert_injury(df):
    # Apply the mapping:
    # 0 stays 0, 0 < x <= 1 becomes 1, x > 1 becomes 2
    df['Injury'] = df['Injury'].apply(lambda x: 0 if x == 0 else (1 if x <= 1 else 2))
    
    # Convert the column from float to int64
    df['Injury'] = df['Injury'].astype('int64')
    
    return df


# Step 5: Full pipeline to clean data
def clean_data(file_path):
    # Load data
    df = load_data(file_path)
    
    # Check missing values and data types
    check_missing_values_and_dtypes(df)
        
    return df

# Function to convert float to int64
def convert_float_to_int64(df, column_name):
    # Convert the specified column to int64
    df[column_name] = df[column_name].astype('int64', errors='ignore')
    return df

def round_and_convert_columns(df, columns_to_convert):
    # Loop through the specified columns
    for column in columns_to_convert:
        # Check if the column is numeric (only round numeric columns)
        if pd.api.types.is_numeric_dtype(df[column]):
            # Round the values to the nearest integer (ISO 80000-1) and convert to int64
            df[column] = df[column].round().astype('int64')
        else:
            print(f"Column '{column}' is not numeric and cannot be rounded.")
    
    return df

# Function to reduce the number of decimals in specified columns to 2
def reduce_decimals(df, columns_to_reduce):
    # Loop through the specified columns
    for column in columns_to_reduce:
        # Check if the column is numeric
        if pd.api.types.is_numeric_dtype(df[column]):
            # Reduce the number of decimals to 2
            df[column] = df[column].round(2)
        else:
            print(f"Column '{column}' is not numeric and cannot be modified.")
    
    return df

# Example usage:
file_path = './Data/final_dataset_cleaned.csv'
df = clean_data(file_path)

convert_float_to_int64(df, 'Sex')
convert_float_to_int64(df, 'Age')
convert_float_to_int64(df, 'NRS_pain')
convert_float_to_int64(df, 'Mental')
convert_float_to_int64(df, 'KTAS_expert')

# Fix some scales

# Apply the mapping and transformation
df = map_and_convert_injury(df)

columns_to_convert = ['SBP', 'DBP', 'HR', 'RR', 'Saturation']
df = round_and_convert_columns(df, columns_to_convert)

columns_decimals = ['BT']
df = reduce_decimals(df, columns_decimals)

# print results
print(df.dtypes)
print(df.head())

# Save the final dataset to a new CSV file
df.to_csv('./Data/new_training_data.csv', index=False)

