from .DecisionTree import DecisionTree
import numpy as np
import os
from joblib import Parallel, delayed 
from scipy.stats import mode

os.environ['LOKY_MAX_CPU_COUNT'] = '4'

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
        self.is_trained = False 
        
    def get_params(self):
        """
        Obtiene los parámetros de este estimador.

        Retorna
        -------
        dict
            Un diccionario con los parámetros del estimador, incluyendo 'num_trees', 'max_depth' y 'min_samples_split'.
        """
        return {
            "num_trees": self.num_trees,
            "max_depth": self.max_depth,
            "min_samples_split": self.min_samples_split,
        }


    def set_params(self, **params):
        """
        Establece los parámetros de este estimador.

        Parámetros
        ----------
        **params : dict
            Un diccionario de parámetros donde las claves son los nombres de los atributos y los valores son los valores a establecer.

        Retorna
        -------
        self
            Retorna el propio objeto para permitir el encadenamiento de métodos.
        """
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
        if not self.is_trained:  # Only train if not already trained
            print("Starting training...")
            self.trees = Parallel(n_jobs=-1)(
                delayed(self._train_tree)(X, y) for _ in range(self.num_trees)
            )
            self.is_trained = True  # Set flag to prevent retraining
            print(f"Los {self.num_trees} árboles han sido entrenados.")
        else:
            print("El modelo ya fue entrenado.")


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
        return mode(tree_preds, axis=0)[0].flatten()
    
    def score(self, X, y):
        """
        Calcula la precisión del modelo utilizando las muestras de entrada y las etiquetas verdaderas.

        Parámetros
        ----------
        X : array
            Las características de las muestras de entrada.
        y : array
            Las etiquetas verdaderas correspondientes a las muestras de entrada.

        Retorna
        -------
        float
            La precisión del modelo, es decir, la proporción de predicciones correctas sobre el total de muestras.
        """
        predictions = self.predict(X)
        accuracy = np.mean(predictions == y)
        return accuracy

