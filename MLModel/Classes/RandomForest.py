from .DecisionTree import DecisionTree
import numpy as np
from concurrent.futures import ProcessPoolExecutor

class RandomForest:
    """
    Un bosque aleatorio basado en árboles de decisión.

    Parámetros
    ----------
    num_trees : int, opcional
        El número de árboles en el bosque (por defecto 100).
    max_depth : int, opcional
        La profundidad máxima de cada árbol (por defecto 10).
    min_samples_split : int, opcional
        El número mínimo de muestras requerido para dividir un nodo (por defecto 2).

    Atributos
    ---------
    trees : list
        Una lista que contiene los árboles de decisión entrenados.

    Métodos
    -------
    fit(X, y)
        Entrena el bosque aleatorio utilizando un conjunto de características y etiquetas.
    _bootstrap_sample(X, y)
        Genera una muestra de bootstrap a partir de los datos de entrada.
    predict(X)
        Predice las etiquetas para las muestras de entrada utilizando el bosque aleatorio.
    """
    def __init__(self, num_trees=100, max_depth=10, min_samples_split=2):
        """
        Inicializa el bosque aleatorio con los parámetros dados.

        Parámetros
        ----------
        num_trees : int, opcional
            El número de árboles en el bosque.
        max_depth : int, opcional
            La profundidad máxima permitida para cada árbol.
        min_samples_split : int, opcional
            El número mínimo de muestras requerido para realizar una división en un nodo.
        """
        self.num_trees = num_trees
        
        if max_depth is None:
            self.max_depth = float('inf')
        else:
            self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.trees = []
        
    def get_params(self, deep=True):
        """Get parameters for this estimator."""
        return {
            "num_trees": self.num_trees,
            "max_depth": self.max_depth,
            "min_samples_split": self.min_samples_split,
        }

    def set_params(self, **params):
        """Set the parameters of this estimator."""
        for key, value in params.items():
            setattr(self, key, value)
        return self

    def fit(self, X, y):
        """
        Entrena el bosque aleatorio a los datos de entrada.

        Parámetros
        ----------
        X : array
            Las características del conjunto de datos de entrada.
        y : array
            Las etiquetas correspondientes a los datos de entrada.
        """
        self.trees = []

        # Use ProcessPoolExecutor for parallel tree training
        with ProcessPoolExecutor() as executor:
            # Create a list of future tasks
            futures = [executor.submit(self._train_tree, X, y) for _ in range(self.num_trees)]
            for future in futures:
                tree = future.result()
                self.trees.append(tree)

    def _train_tree(self, X, y):
        """
        Entrena un único árbol de decisión en una muestra de bootstrap.

        Parámetros
        ----------
        X : array
            Las características del conjunto de datos de entrada.
        y : array
            Las etiquetas correspondientes a los datos de entrada.

        Retorna
        -------
        tree : DecisionTree
            El árbol de decisión entrenado.
        """
        tree = DecisionTree(max_depth=self.max_depth, min_samples_split=self.min_samples_split)
        X_sample, y_sample = self._bootstrap_sample(X, y)
        tree.fit(X_sample, y_sample)
        return tree

    def _bootstrap_sample(self, X, y):
        """
        Crea una muestra de bootstrap del conjunto de datos.

        Parámetros
        ----------
        X : array
            Las características del conjunto de datos de entrada.
        y : array
            Las etiquetas correspondientes a los datos de entrada.

        Retorna
        -------
        X_sample, y_sample : array, array
            Una muestra de las características y las etiquetas con reposición.
        """
        n_samples = X.shape[0]
        indices = np.random.choice(n_samples, n_samples, replace=True)
        return X[indices], y[indices]

    def predict(self, X):
        """
        Predice las etiquetas para las muestras de entrada utilizando un voto mayoritario de los árboles en el bosque.

        Parámetros
        ----------
        X : array
            Las características de las muestras de entrada.

        Retorna
        -------
        array
            Un array con las etiquetas predichas para cada muestra en X.
        """
        tree_preds = np.array([tree.predict(X) for tree in self.trees])
        return np.apply_along_axis(lambda x: np.bincount(x).argmax(), axis=0, arr=tree_preds)
    
    def score(self, X, y):
        """Calculate the accuracy of the model on the given data."""
        predictions = self.predict(X)  # Get predictions
        accuracy = np.mean(predictions == y)  # Calculate accuracy
        return accuracy
