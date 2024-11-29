from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from Classes.RandomForest import RandomForest  # Importa el modelo RandomForest personalizado
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

def reduce_dataset(X, y, sample_size):
    """
    Reduce el tamaño del conjunto de datos seleccionando aleatoriamente un subconjunto de muestras.
    
    Parámetros:
    -----------
    X : array
        El conjunto de características.
    y : array
        Las etiquetas correspondientes al conjunto de datos.
    sample_size : int
        El número de muestras que se desean conservar en el conjunto de datos reducido.
    
    Retorna:
    --------
    X_subset, y_subset : arrays
        El conjunto de características reducido y las etiquetas correspondientes.
    """
    assert sample_size <= X.shape[0], "El tamaño de la muestra no puede ser mayor al tamaño del conjunto de datos"
    
    # Obtener una muestra aleatoria de índices
    indices = np.random.choice(X.shape[0], sample_size, replace=False)
    
    # Seleccionar las muestras
    X_subset = X[indices]
    y_subset = y[indices]
    
    return X_subset, y_subset

def test_model(model, X_train, y_train, X_test, y_test):
    """
    Entrena y evalúa un modelo en los conjuntos de entrenamiento y prueba, retornando la precisión.
    
    Parámetros:
    -----------
    model : objeto de modelo
        El modelo a entrenar y probar.
    X_train : array
        El conjunto de características de entrenamiento.
    y_train : array
        Las etiquetas de entrenamiento.
    X_test : array
        El conjunto de características de prueba.
    y_test : array
        Las etiquetas de prueba.
    
    Retorna:
    --------
    accuracy : float
        La precisión del modelo en el conjunto de prueba.
    """
    print(f"\nEvaluando el modelo: {model.__class__.__name__}")
    
    # Entrenar el modelo
    model.fit(X_train, y_train)
    
    # Predecir en el conjunto de prueba
    y_pred = model.predict(X_test)
    
    # Calcular la precisión
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Precisión en el conjunto de prueba: {accuracy * 100:.2f}%")
    
    # Imprimir el informe de clasificación
    print(f"\nInforme de clasificación para {model.__class__.__name__}:\n", classification_report(y_test, y_pred, zero_division=0))
    
    return accuracy

def main():
    """
    Función principal que carga los datos, preprocesa, divide los conjuntos y evalúa varios modelos.
    """
    # Cargar el conjunto de datos
    data = pd.read_csv('./Data/new_training_data.csv')

    # Definir las características y la columna objetivo
    features = ['Sex', 'Age', 'Injury', 'Mental', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']
    target_column = 'KTAS_expert'
    
    Xo = data[features].values  # Conjunto de características
    yo = data[target_column].values  # Etiquetas
    
    # Reducir el tamaño del conjunto de datos (opcional)
    trained_dataset_size = 144809
    X, y = reduce_dataset(Xo, yo, trained_dataset_size)
    
    # Dividir el conjunto de datos en entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Escalar los datos para SVC y regresión l
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    # Modelos a evaluar
    models = [
        LogisticRegression(max_iter=5000),   # Regresión Logística
        SVC(kernel='linear'),                # Máquina de Soporte Vectorial con kernel lineal
        GradientBoostingClassifier(n_estimators=100),  # Gradient Boosting
        RandomForest(num_trees=100, max_depth=15, min_samples_split=10)  # Modelo RandomForest personalizado
    ]
    
    # Evaluar cada modelo
    for model in models:
        test_model(model, X_train, y_train, X_test, y_test)

if __name__ == "__main__":
    main()
