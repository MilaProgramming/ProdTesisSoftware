import numpy as np
# Class for defining the binary tree, having already defined the node
from .Node import Node 

class DecisionTree:
    def __init__(self, max_depth=10, min_samples_split=2):  # max_depth: maximum depth of the tree, min_samples_split: minimum number of samples required to split an internal node
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None

    def fit(self, X, y):
        # Build the tree
        self.root = self._build_tree(X, y)
    
    # Helper function to calculate the gini impurity
    def gini_impurity(labels):
        _, counts = np.unique(labels, return_counts=True)
        probabilities = counts / len(labels)
        return 1 - sum(probabilities ** 2)

    def _build_tree(self, X, y, depth=0):
        num_samples, num_features = X.shape
        num_labels = len(np.unique(y))

        # Stopping criteria
        if depth >= self.max_depth or num_samples < self.min_samples_split or num_labels == 1:
            leaf_value = self._most_common_label(y)
            return Node(value=leaf_value)

        # Random feature selection
        feat_idxs = np.random.choice(num_features, num_features, replace=True)

        # Find the best split
        best_feat, best_thresh = self._best_split(X, y, feat_idxs)

        # Create child nodes
        left_idxs, right_idxs = self._split(X[:, best_feat], best_thresh)
        left = self._build_tree(X[left_idxs, :], y[left_idxs], depth + 1)
        right = self._build_tree(X[right_idxs, :], y[right_idxs], depth + 1)
        return Node(feature=best_feat, threshold=best_thresh, left=left, right=right)

    def _best_split(self, X, y, feat_idxs):
        best_gini = float("inf")
        split_idx, split_thresh = None, None
        for feat_idx in feat_idxs:
            X_column = X[:, feat_idx]
            thresholds = np.unique(X_column)
            for threshold in thresholds:
                gini = self._calculate_gini(X_column, y, threshold)
                if gini < best_gini:
                    best_gini = gini
                    split_idx = feat_idx
                    split_thresh = threshold
        return split_idx, split_thresh

    def _calculate_gini(self, X_column, y, threshold):
        left_idxs = np.where(X_column <= threshold)
        right_idxs = np.where(X_column > threshold)

        if len(left_idxs[0]) == 0 or len(right_idxs[0]) == 0:
            return float("inf")

        left_gini = self.gini_impurity(y[left_idxs])
        right_gini = self.gini_impurity(y[right_idxs])
        weighted_gini = (len(left_idxs[0]) * left_gini + len(right_idxs[0]) * right_gini) / len(y)
        return weighted_gini

    def _split(self, X_column, split_thresh):
        left_idxs = np.where(X_column <= split_thresh)
        right_idxs = np.where(X_column > split_thresh)
        return left_idxs[0], right_idxs[0]

    def _most_common_label(self, y):
        return np.bincount(y).argmax()

    def predict(self, X):
        return np.array([self._traverse_tree(x, self.root) for x in X])

    def _traverse_tree(self, x, node):
        if node.is_leaf_node():
            return node.value

        if x[node.feature] <= node.threshold:
            return self._traverse_tree(x, node.left)
        return self._traverse_tree(x, node.right)

            