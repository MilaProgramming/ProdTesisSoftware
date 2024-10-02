import numpy as np
from .Node import Node # Clase para definir el árbol de decisión, utilizando previamente la clase Node 

class DecisionTree:
    
    """
    Una clase que representa un árbol de decisión binario.

    Atributos
    ---------
    max_depth : int
        La profundidad máxima permitida para el árbol de decisión.
    min_samples_split : int
        El número mínimo de muestras requeridas para dividir un nodo interno.
    root : Node
        La raíz del árbol de decisión, que es un objeto de la clase Node.

    Métodos
    -------
    fit(X, y)
        Ajusta el árbol a los datos proporcionados, construyendo la estructura del árbol.
    predict(X)
        Predice las etiquetas para los datos proporcionados en función del árbol de decisión entrenado.
    _build_tree(X, y, depth)
        Método auxiliar para construir recursivamente el árbol de decisión.
    _best_split(X, y, feat_idxs)
        Encuentra la mejor característica y umbral para dividir los datos, maximizando la pureza.
    _calculate_gini(X_column, y, threshold)
        Calcula la impureza de Gini para una característica y un umbral dados.
    _split(X_column, split_thresh)
        Divide los datos en dos subconjuntos en función de un umbral.
    _most_common_label(y)
        Encuentra la etiqueta más común en un conjunto de datos, utilizada para nodos hoja.
    _traverse_tree(x, node)
        Recorre el árbol desde la raíz hasta un nodo hoja para predecir el valor de una muestra.
    """
    
    def __init__(self, max_depth=10, min_samples_split=2):  
        
        """
        Inicializa el árbol de decisión con los parámetros especificados.

        Parámetros
        ----------
        max_depth : int, opcional
            La profundidad máxima del árbol de decisión (por defecto es 10).
        min_samples_split : int, opcional
            El número mínimo de muestras necesarias para dividir un nodo interno (por defecto es 2).
        """
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None

    def fit(self, X, y):
        """
        Ajusta el árbol a los datos de entrada, construyendo la estructura del árbol.

        Parámetros
        ----------
        X : array de forma (n_samples, n_features)
            Las características de entrenamiento.
        y : array de forma (n_samples)
            Las etiquetas correspondientes a los datos de entrenamiento.
        """
        self.root = self._build_tree(X, y)
    
    def gini_impurity(labels):
        """
        Calcula la impureza de Gini para un conjunto de etiquetas.

        Parámetros
        ----------
        labels : array
            Las etiquetas de las cuales calcular la impureza de Gini.

        Retorna
        -------
        float
            El valor de la impureza de Gini.
        """
        _, counts = np.unique(labels, return_counts=True) # Devuelve los valores únicos y sus recuentos
        probabilities = counts / len(labels)
        return 1 - sum(probabilities ** 2) 

    def _build_tree(self, X, y, depth=0):
        """
        Construye recursivamente el árbol de decisión.

        Parámetros
        ----------
        X : array
            Las características de los datos de entrada.
        y : array
            Las etiquetas correspondientes a los datos de entrada.
        depth : int, opcional
            La profundidad actual del árbol (por defecto es 0).

        Retorna
        -------
        Node
            El nodo raíz del árbol construido.
        """
        num_samples, num_features = X.shape  
        num_labels = len(np.unique(y)) 

        # Condiciones de parada
        if depth >= self.max_depth or num_samples < self.min_samples_split or num_labels == 1:
            leaf_value = self._most_common_label(y)
            return Node(value=leaf_value)

        # Selección aleatoria de característica
        feat_idxs = np.random.choice(num_features, num_features, replace=True)

        # Encontrar la mejor característica y umbral para dividir
        best_feat, best_thresh = self._best_split(X, y, feat_idxs)

        # Crear subárboles
        left_idxs, right_idxs = self._split(X[:, best_feat], best_thresh)
        left = self._build_tree(X[left_idxs, :], y[left_idxs], depth + 1)
        right = self._build_tree(X[right_idxs, :], y[right_idxs], depth + 1)
        return Node(feature=best_feat, threshold=best_thresh, left=left, right=right)

    def _best_split(self, X, y, feat_idxs):
        """
        Encuentra la mejor división para un conjunto de datos dado en función de la impureza de Gini.

        Parámetros
        ----------
        X : array
            Las características de los datos de entrada.
        y : array
            Las etiquetas correspondientes a los datos de entrada.
        feat_idxs : array
            Los índices de las características seleccionadas para considerar las divisiones.

        Retorna
        -------
        tuple
            Una tupla que contiene el índice de la mejor característica y el mejor valor de umbral para dividir.
        """
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
        """
        Calcula la impureza de Gini de un conjunto de datos para una columna dada y un umbral de división.

        Parámetros
        ----------
        X_column : array
            La columna de características que se está utilizando para evaluar la división.
        y : array
            Las etiquetas correspondientes a los datos de entrada.
        threshold : float
            El valor de umbral para dividir los datos en dos subconjuntos.

        Retorna
        -------
        float
            La impureza de Gini ponderada de la división. Si la división no es válida, devuelve infinito.
        """
        left_idxs = np.where(X_column <= threshold)
        right_idxs = np.where(X_column > threshold)

        if len(left_idxs[0]) == 0 or len(right_idxs[0]) == 0:
            return float("inf")

        left_gini = self.gini_impurity(y[left_idxs])
        right_gini = self.gini_impurity(y[right_idxs])
        weighted_gini = (len(left_idxs[0]) * left_gini + len(right_idxs[0]) * right_gini) / len(y)
        return weighted_gini

    def _split(self, X_column, split_thresh):
        """
        Divide una columna de características en dos subconjuntos basados en un umbral de división.

        Parámetros
        ----------
        X_column : array
            La columna de características que se está utilizando para dividir los datos.
        split_thresh : float
            El valor del umbral utilizado para dividir los datos.

        Retorna
        -------
        tuple of arrays
            Índices del subconjunto izquierdo (valores menores o iguales al umbral) y el subconjunto derecho (valores mayores al umbral).
        """
        left_idxs = np.where(X_column <= split_thresh)
        right_idxs = np.where(X_column > split_thresh)
        return left_idxs[0], right_idxs[0]

    def _most_common_label(self, y):
        """
        Encuentra la etiqueta más común en un conjunto de datos.

        Parámetros
        ----------
        y : array
            Un array que contiene las etiquetas de los datos.

        Retorna
        -------
        int
            La etiqueta que aparece con mayor frecuencia en `y`.
        """
        return np.bincount(y).argmax()

    def predict(self, X):
        """
        Predice las etiquetas para las muestras de entrada utilizando el árbol de decisión entrenado.

        Parámetros
        ----------
        X : array
            Un conjunto de características (datos de entrada) donde cada fila representa una muestra.

        Retorna
        -------
        array
            Un array con las etiquetas predichas para cada muestra en X.
        """
        return np.array([self._traverse_tree(x, self.root) for x in X])

    def _traverse_tree(self, x, node):
        """
        Recorre recursivamente el árbol de decisión para una muestra, devolviendo la predicción.

        Parámetros
        ----------
        x : array
            Una muestra de características.
        node : Node
            El nodo actual en el árbol de decisión.

        Retorna
        -------
        valor de la etiqueta
            La etiqueta predicha por el árbol de decisión.
        """
        if node.is_leaf_node():
            return node.value

        if x[node.feature] <= node.threshold:
            return self._traverse_tree(x, node.left)
        return self._traverse_tree(x, node.right)

            