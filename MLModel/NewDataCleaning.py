import pandas as pd

# Load dataset
data = pd.read_csv('./Data/new_data.csv')  # Replace with your actual file path

# Overview of the dataset
def data_overview(df):
    print("First 5 rows of the data:")
    print(df.head(), "\n")
    
    print("Dataset shape (rows, columns):", df.shape, "\n")
    
    print("Column data types and non-null counts:")
    print(df.info(), "\n")
    
    print("Missing values per column:")
    print(df.isnull().sum(), "\n")
    
    print("Summary statistics of numerical columns:")
    print(df.describe(), "\n")

# Function to clean data
def clean_data(df):
    # Drop columns with all null values (if any)
    df_cleaned = df.dropna(axis=1, how='all')
    
    # Fill missing values for numerical columns with mean (optional)
    numerical_cols = df_cleaned.select_dtypes(include=['float64', 'int64']).columns
    df_cleaned[numerical_cols] = df_cleaned[numerical_cols].fillna(df_cleaned[numerical_cols].mean())
    
    # Fill missing values for categorical columns with mode (optional)
    categorical_cols = df_cleaned.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].mode()[0])
    
    return df_cleaned

def normalize_columns(df, column_mappings):
    """
    Normalizes specified categorical columns by replacing values based on the given mapping.

    Parameters:
    df (pd.DataFrame): The DataFrame to normalize.
    column_mappings (dict): A dictionary where keys are column names, and values are dictionaries mapping old values to new values.

    Returns:
    pd.DataFrame: The DataFrame with normalized columns.
    """
    for column, mapping in column_mappings.items():
        if column in df.columns:
            df[column] = df[column].map(mapping)
            print(f"Normalized column '{column}' with mapping: {mapping}")
        else:
            print(f"Column '{column}' not found in DataFrame.")
    return df

def drop_columns(data, columns_to_remove):
    """
    Elimina las columnas especificadas del conjunto de datos.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos.
    columns_to_remove : list
        Las columnas a eliminar.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos sin las columnas especificadas.
    """
    return data.drop(columns=columns_to_remove)

drop_columns_list = ['triage_code', 'admission_year', 'admission_month', 'admission_day', 'admission_weekday', 'admission_hour', 'kindref', 'ChiefComplaint', 'explainer_id', 'ref_specialist', 'AVPU', 'Source', 'operational_patient']
  
data = drop_columns(data, drop_columns_list)

gender_mapping = {'Female': 1, 'Male': 2}

column_mappings = {
    'gender': gender_mapping
}

cleaned_data = normalize_columns(data, column_mappings)

# Show the initial overview
data_overview(data)

print("\nData cleaning completed.")

# Save cleaned data to CSV
cleaned_data.to_csv('./Data/cleaned_new_data.csv', index=False)