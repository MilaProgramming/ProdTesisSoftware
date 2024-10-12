from Classes.RandomForest import RandomForest
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, learning_curve
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
from imblearn.over_sampling import SMOTE

def reduce_dataset(X, y, sample_size):
    """
    Reduces the size of the dataset by randomly selecting a subset of samples.
    
    Parameters:
    ----------
    X : array
        The feature dataset.
    y : array
        The labels corresponding to the dataset.
    sample_size : int
        The number of samples you want to keep in the reduced dataset.
    
    Returns:
    -------
    X_subset, y_subset : arrays
        The reduced feature dataset and corresponding labels.
    """
    assert sample_size <= X.shape[0], "Sample size cannot exceed the size of the dataset"
    
    # Get a random sample of indices
    indices = np.random.choice(X.shape[0], sample_size, replace=False)
    
    # Select the samples
    X_subset = X[indices]
    y_subset = y[indices]
    
    return X_subset, y_subset

def main():
    # Step 1: Load the cleaned CSV Data
    print("Loading cleaned CSV data...")
    data = pd.read_csv('./Data/new_training_data.csv')

    # Display shape and first few rows
    print(f"Data shape: {data.shape}")
    print("First 5 rows of the data:\n", data.head())

    # Step 2: Split data into features (X) and target (y)
    target_column = 'KTAS_expert'
    features = ['Sex', 'Age', 'Injury', 'Mental', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']
    X = data[features].values
    y = data[target_column].values

    print(f"\nFeatures (X) shape: {X.shape}")
    print(f"Target (y) shape: {y.shape}")
    
    # Step 3: Reduce dataset size (optional step)
    sample_size = 10000  # Set the desired sample size
    X, y = reduce_dataset(X, y, sample_size)
    
    print(f"\nReduced Features (X) shape: {X.shape}")
    print(f"Reduced Target (y) shape: {y.shape}")

    # Step 3: Split data into training and testing sets (80% training, 20% testing)
    print("\nSplitting data into training and testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training set size: {X_train.shape[0]}")
    print(f"Testing set size: {X_test.shape[0]}")

    smote = SMOTE(random_state=42, k_neighbors=2)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

    # Step 4: Initialize the RandomForest model
    rf = RandomForest(num_trees=100, max_depth=15, min_samples_split=20)

    # Step 6: Fit the model on the full training set
    print("\nTraining the model on the full training set...")
    rf.fit(X_train_smote, y_train_smote)

    # Step 7: Make predictions on the test set
    print("\nMaking predictions on the test set...")
    y_pred = rf.predict(X_test)

    # Step 8: Evaluate the model
    print("\nEvaluating the model...")

    # Print accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Set Accuracy: {accuracy * 100:.2f}%")

    # Print classification report
    print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=0))

    # 8.1: Identify misclassified samples
    misclassified_idx = np.where(y_test != y_pred)[0]  # Get the indices where predictions are wrong
    print(f"Number of misclassified samples: {len(misclassified_idx)}")
    print(f"Misclassified indices: {misclassified_idx}")

    # Print out the misclassified samples (features and true/predicted labels)
    print("\nInspecting misclassified samples...")
    for idx in misclassified_idx:
        print(f"Index: {idx}")
        print(f"True label: {y_test[idx]}, Predicted label: {y_pred[idx]}")
        print(f"Features: {X_test[idx]}\n")

    # Optional: Test a single prediction
    print("\nTesting a single prediction...")
    sample_patient = X_test[0]
    predicted_label = rf.predict(np.array([sample_patient]))
    print(f"Predicted severity for this test case: {predicted_label[0]}")
    print(f"Actual severity for this test case: {y_test[0]}")

    train_sizes, train_scores, test_scores = learning_curve(
        rf, X_train_smote, y_train_smote, cv=5, scoring='accuracy', n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 5)
    )

    # Calculate mean and standard deviation for training and test sets
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    train_accuracy = rf.score(X_train_smote, y_train_smote)
    test_accuracy = rf.score(X_test, y_test)
    print(f"Training Set Accuracy: {train_accuracy * 100:.2f}%")
    print(f"Test Set Accuracy: {test_accuracy * 100:.2f}%")
    
    # Plot the learning curve
    plt.figure()
    plt.plot(train_sizes, train_mean, 'o-', color="r", label="Training score")
    plt.plot(train_sizes, test_mean, 'o-', color="g", label="Cross-validation score")
    # Fill between standard deviations
    plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color="r")
    plt.fill_between(train_sizes, test_mean - test_std, test_mean + test_std, alpha=0.1, color="g")
    plt.title('Learning Curve')
    plt.xlabel('Training Size')
    plt.ylabel('Accuracy')
    plt.legend(loc="best")
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    main()
