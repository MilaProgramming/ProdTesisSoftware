from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from Classes.RandomForest import RandomForest  # Modelo RandomForest personalizado
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np
import joblib
import time

def reduce_dataset(X, y, sample_size):
    print(f"\nReduciendo conjunto de datos a {sample_size} muestras...")
    indices = np.random.choice(X.shape[0], sample_size, replace=False)
    print("Reducción completa.")
    return X[indices], y[indices]


def train_and_save_model(model, X_train, y_train, X_test, y_test, filename):
    """
    Entrena el modelo y lo guarda en un archivo .pkl.
    """
    print(f"\nEntrenando y guardando el modelo {model.__class__.__name__}...")
    start_time = time.time()
    
    model.fit(X_train, y_train)
    
    elapsed_time = time.time() - start_time
    print(f"Modelo {model.__class__.__name__} entrenado en {elapsed_time:.2f} segundos.")
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Precisión en el conjunto de prueba: {accuracy * 100:.2f}%")
    print(f"\nInforme de clasificación:\n{classification_report(y_test, y_pred, zero_division=0)}")
    
    print(f"Guardando el modelo en '{filename}'...")
    joblib.dump(model, filename)
    print(f"Modelo guardado exitosamente en '{filename}'.\n")

def main():
    print("Cargando datos...")
    data = pd.read_csv('./Data/new_training_data.csv')
    print("Datos cargados exitosamente.\n")

    # Definir características y objetivo
    features = ['Sex', 'Age', 'Injury', 'Mental', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']
    target_column = 'KTAS_expert'

    Xo = data[features].values
    yo = data[target_column].values

    # Reducción del tamaño del dataset
    trained_dataset_size = 144809
    X, y = reduce_dataset(Xo, yo, trained_dataset_size)

    print("Dividiendo los datos en conjuntos de entrenamiento y prueba...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print("División completa.\n")

    print("Escalando los datos...")
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    print("Escalado completo.\n")

    models = [
        (GradientBoostingClassifier(n_estimators=100), 'gradient_boosting_model.pkl'),
        (RandomForest(num_trees=100, max_depth=15, min_samples_split=10), 'random_forest_model.pkl')
    ]

    for model, filename in models:
        train_and_save_model(model, X_train, y_train, X_test, y_test, filename)


    print("Todos los modelos han sido entrenados y guardados con éxito.\n")

if __name__ == "__main__":
    main()
