import pickle
import time
import tracemalloc
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import numpy as np

# Datos de entrenamiento y niveles de urgencia
X = [
    # Casos Críticos (Nivel 1)
    [5, 1, 1, 1, 1, 1],  # Todos los síntomas graves presentes.
    [5, 1, 0, 1, 0, 1],  # Dolor de cabeza severo, fiebre alta, malestar general y golpe.
    [5, 1, 1, 0, 0, 0],  # Dolor de cabeza severo, fiebre alta y dolor abdominal.

    # Casos de Emergencia (Nivel 2)
    [3, 1, 1, 1, 0, 0],  # Dolor de cabeza moderado, fiebre alta, dolor abdominal y malestar general.
    [5, 0, 1, 1, 0, 1],  # Dolor de cabeza severo, dolor abdominal, malestar general y golpe.
    [0, 1, 1, 1, 0, 1],  # Fiebre alta, dolor abdominal, malestar general y golpe.

    # Casos de Urgencia (Nivel 3)
    [1, 1, 0, 1, 0, 0],  # Dolor de cabeza leve, fiebre alta y malestar general.
    [0, 1, 1, 0, 0, 0],  # Fiebre alta y dolor abdominal.
    [3, 1, 0, 1, 0, 1],  # Dolor de cabeza moderado, fiebre alta, malestar general y golpe.

    # Casos Estándar (Nivel 4)
    [0, 0, 1, 0, 0, 0],  # Solo dolor abdominal.
    [0, 0, 0, 1, 1, 0],  # Dolor de garganta y malestar general.
    [0, 0, 0, 1, 0, 1],  # Malestar general y golpe.

    # Casos No Urgentes (Nivel 5)
    [0, 0, 0, 0, 0, 0],  # Sin ningún síntoma.
    [0, 0, 0, 0, 1, 0],  # Solo dolor de garganta leve.
    [0, 0, 0, 0, 0, 1],  # Solo golpe.
]

y = [
    1, 1, 1,  # Crítico
    2, 2, 2,  # Emergencia
    3, 3, 3,  # Urgencia
    4, 4, 4,  # Estándar
    5, 5, 5   # No Urgente
]

# Dividir los datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Función para evaluar modelos
def evaluate_model(model, X_train, X_test, y_train, y_test):
    tracemalloc.start()
    start_time = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - start_time
    memory_usage = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    return {
        'accuracy': accuracy,
        'train_time': train_time,
        'memory_usage': memory_usage[1]  # Peak memory usage
    }

# Entrenar y evaluar modelos
decision_tree = DecisionTreeClassifier()
gb_classifier = GradientBoostingClassifier()

dt_results = evaluate_model(decision_tree, X_train, X_test, y_train, y_test)
gb_results = evaluate_model(gb_classifier, X_train, X_test, y_train, y_test)

# Comparar modelos
print("Decision Tree Results:", dt_results)
print("Gradient Boosting Results:", gb_results)
