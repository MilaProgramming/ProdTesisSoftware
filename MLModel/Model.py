
from Classes.RandomForest import RandomForest

import pandas as pd
from sklearn.model_selection import train_test_split

class RandomForestModel:
    def __init__(self, num_trees=100, max_depth=10, min_samples_split=2):
        self.rf = RandomForest(num_trees=num_trees, max_depth=max_depth, min_samples_split=min_samples_split)

    def load_and_prepare_data(self, csv_file):
        data = pd.read_csv(csv_file)
        # Data cleaning steps
        # ...
        # Assume the label is in the last column
        X = data.iloc[:, :-1].values
        y = data.iloc[:, -1].values
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def train(self, X_train, y_train):
        self.rf.fit(X_train, y_train)

    def predict(self, X_test):
        return self.rf.predict(X_test)
