# Node class for decision tree nodes
class Node:
    """
    Una clase que representa un nodo en un árbol de decisión.

    Atributos
    ---------
    feature : int, opcional
        El índice de la característica utilizada para dividir los datos en este nodo.
    threshold : float, opcional
        El valor de umbral utilizado para dividir los datos en función de la característica.
    left : Node, opcional
        El nodo hijo izquierdo (para los puntos de datos <= umbral).
    right : Node, opcional
        El nodo hijo derecho (para los puntos de datos > umbral).
    value : int o float, opcional
        El valor final predicho para los nodos hoja (None para los nodos que no son hojas).
    """

    def __init__(self, feature=None, threshold=None, left=None, right=None, *, value=None):
        """
        Inicializa un nodo de árbol de decisión.

        Parámetros
        ----------
        feature : int, opcional
            El índice de la característica utilizada para dividir los datos (por defecto es None).
        threshold : float, opcional
            El valor del umbral utilizado para dividir los datos (por defecto es None).
        left : Node, opcional
            El nodo hijo izquierdo (por defecto es None).
        right : Node, opcional
            El nodo hijo derecho (por defecto es None).
        value : int o float, opcional
            El valor para un nodo hoja (por defecto es None).
        """
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    def is_leaf_node(self):
        """
        Verifica si el nodo es un nodo hoja (es decir, sin hijos).

        Retorna
        -------
        bool
            True si el nodo es un nodo hoja, False en caso contrario.
        """
        return self.value is not None
