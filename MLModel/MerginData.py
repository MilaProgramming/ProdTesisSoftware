import pandas as pd


# Load datasets
dataset1 = pd.read_csv('./Data/cleaned_new_data.csv')
dataset2 = pd.read_csv('./Data/training_data.csv')

# Dropping 'ArrivalMode' from dataset2 and 'NeedFastExecute' from dataset1
dataset1.drop(columns=['NeedFastExecute'], inplace=True)
dataset1.drop(columns=['MaterialDistress'], inplace=True)
dataset1.drop(columns=['StuporStatus'], inplace=True)

print("Columns in dataset1 before renaming:", dataset1.columns)

# Rename columns in Dataset 1 to match Dataset 2
dataset1.rename(columns={
    'gender': 'Sex',
    'age': 'Age',
    'CriticalStatus': 'Injury', # To fix the numeric rating scale, Critic alStatus is from 0 to 2, and Injury is 1 or 2
    'MentalDistress': 'Mental',
    'PainGrade': 'NRS_pain',
    'BlooddpressurSystol': 'SBP',
    'BlooddpressurDiastol': 'DBP',
    'PulseRate': 'HR',
    'RespiratoryRate': 'RR',
    'Temperature': 'BT',
    'O2Saturation': 'Saturation',
    'TriageGrade': 'KTAS_expert'
}, inplace=True)

print("Columns in dataset1 after renaming:", dataset1.columns)

# Map Dataset 1 MentalDistress to Dataset 2 Mental scale
mental_mapping = {
    0: 1,  # Alert
    1: 3,  # Pain response
    2: 4   # Unresponsive
}

dataset1['Mental'] = dataset1['Mental'].map(mental_mapping)

# Define the correct data types for all columns
dtype_dict = {
    'Sex': 'int64',
    'Age': 'int64',
    'Injury': 'int64',
    'Mental': 'int64',
    'NRS_pain': 'float64',
    'SBP': 'int64',
    'DBP': 'float64',
    'HR': 'int64',
    'RR': 'int64',
    'BT': 'float64',
    'Saturation': 'float64',
    'KTAS_expert': 'int64'
}

#Fix the blanks and issues in the datasets
print(dataset1.columns)

# Check for missing values in dataset 
print("Missing values in dataset1:")
print(dataset1.isnull().sum(), "\n")

dataset1.fillna({'Injury': -1}, inplace=True) 
dataset1.fillna({'NRS_pain': -1}, inplace=True)
dataset1.fillna({'Mental': -1}, inplace=True)
dataset1.fillna({'SBP': -1}, inplace=True)
dataset1.fillna({'DBP': -1}, inplace=True)
dataset1.fillna({'HR': -1}, inplace=True)
dataset1.fillna({'RR': -1}, inplace=True)
dataset1.fillna({'BT': -1}, inplace=True)
dataset1.fillna({'Saturation': -1}, inplace=True)

# Check for missing values in dataset 
print("Missing values in dataset1:")
print(dataset1.isnull().sum(), "\n")


# Apply the data types to Dataset 1
dataset1 = dataset1.astype(dtype_dict)

# Apply the data types to Dataset 2
dataset2 = dataset2.astype(dtype_dict)

# Append Dataset 2 to Dataset 1
final_dataset = pd.concat([dataset1, dataset2], ignore_index=True)

print('Final dataset shape:', final_dataset.shape)

# Save the final dataset to a new CSV file
final_dataset.to_csv('final_dataset.csv', index=False)


