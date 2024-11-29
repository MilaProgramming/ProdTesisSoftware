from Classes.RandomForest import RandomForest
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, learning_curve
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

def reduce_dataset(X, y, sample_size):
    """
    Reduce el tamaño del conjunto de datos seleccionando aleatoriamente una muestra de instancias.

    Parámetros:
    -----------
    X : array
        Conjunto de datos de características.
    y : array
        Etiquetas correspondientes al conjunto de datos.
    sample_size : int
        El número de muestras que se desean mantener en el conjunto reducido.

    Retorna:
    --------
    X_subset, y_subset : arrays
        El conjunto de datos reducido y las etiquetas correspondientes.
    """
    assert sample_size <= X.shape[0], "El tamaño de la muestra no puede exceder el tamaño del conjunto de datos."
    
    # Seleccionar aleatoriamente un subconjunto de índices
    indices = np.random.choice(X.shape[0], sample_size, replace=False)
    
    # Retornar el subconjunto de datos y etiquetas
    return X[indices], y[indices]

def reset_model(rf):
    """
    Reinicia el modelo para permitir un nuevo entrenamiento durante la validación cruzada.
    
    Parámetros:
    -----------
    rf : RandomForest
        El modelo RandomForest que se reiniciará.

    Retorna:
    --------
    rf : RandomForest
        El modelo reiniciado.
    """
    rf.is_trained = False
    return rf

def main():
    """
    Función principal para cargar los datos, reducir el conjunto, entrenar el modelo y evaluarlo.
    También genera una curva de aprendizaje visualizando la precisión del modelo en varios tamaños de entrenamiento.
    """
    # Paso 1: Cargar los datos limpios desde el archivo CSV
    print("Cargando los datos del CSV limpio...")
    data = pd.read_csv('./Data/new_training_data.csv')

    # Mostrar el tamaño y las primeras filas del conjunto de datos
    print(f"Tamaño de los datos: {data.shape}")
    print("Primeras 5 filas del conjunto de datos:\n", data.head())
    
    original_dataset_size = 144810
    trained_dataset_size = 144809

    # Paso 2: Dividir los datos en características (X) y etiquetas (y)
    target_column = 'KTAS_expert'
    features = ['Sex', 'Age', 'Injury', 'Mental', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']
    Xo = data[features].values
    yo = data[target_column].values

    print(f"\nTamaño de las características (X): {Xo.shape}")
    print(f"Tamaño del objetivo (y): {yo.shape}")
    
    # Paso 3: Reducir el tamaño del conjunto de datos
    X, y = reduce_dataset(Xo, yo, trained_dataset_size)
    
    print(f"\nTamaño reducido de las características (X): {X.shape}")
    print(f"Tamaño reducido del objetivo (y): {y.shape}")

    # Paso 4: Dividir los datos en conjuntos de entrenamiento y prueba (80% entrenamiento, 20% prueba)
    print("\nDividiendo los datos en conjuntos de entrenamiento y prueba...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Tamaño del conjunto de entrenamiento: {X_train.shape[0]}")
    print(f"Tamaño del conjunto de prueba: {X_test.shape[0]}")

    # Paso 5: Inicializar el modelo RandomForest
    rf = RandomForest(num_trees=100, max_depth=15, min_samples_split=20)

    # Paso 6: Entrenar el modelo con el conjunto de entrenamiento
    print("\nEntrenando el modelo con el conjunto de entrenamiento completo...")
    rf.fit(X_train, y_train)

    # Paso 7: Hacer predicciones sobre el conjunto de prueba
    print("\nRealizando predicciones sobre el conjunto de prueba...")
    y_pred = rf.predict(X_test)

    # Paso 8: Evaluar el modelo
    print("\nEvaluando el modelo...")

    # Imprimir precisión
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Precisión del conjunto de prueba: {accuracy * 100:.2f}%")

    # Imprimir informe de clasificación
    print("\nInforme de clasificación:\n", classification_report(y_test, y_pred, zero_division=0))

    # Paso 8.1: Identificar las muestras mal clasificadas
    misclassified_idx = np.where(y_test != y_pred)[0]
    print(f"Número de muestras mal clasificadas: {len(misclassified_idx)}")
    print(f"Índices de las muestras mal clasificadas: {misclassified_idx}")

    # Probar una predicción individual
    print("\nProbando una predicción individual...")
    sample_patient = X_test[0]
    predicted_label = rf.predict(np.array([sample_patient]))
    print(f"Severidad predicha para este caso de prueba: {predicted_label[0]}")
    print(f"Severidad real para este caso de prueba: {y_test[0]}")
    
    print("\nProbando otra predicción con un caso de prueba diferente...")
    # Seleccionar un caso aleatorio del conjunto original y realizar una predicción
    for i in range(5):
        random_index = np.random.randint(0, original_dataset_size)
        sample_patient = Xo[random_index]
        predicted_label = rf.predict(np.array([sample_patient]))
        actual_label = yo[random_index]
        print(f"Severidad predicha para este caso: {predicted_label[0]}")
        print(f"Severidad real para este caso: {actual_label}")
        print(f"Características: {sample_patient}\n")
    
    print(f"Tamaño del conjunto de entrenamiento: {X_train.shape[0]}")

    # Paso 9: Generar la curva de aprendizaje
    print("\nGenerando curva de aprendizaje...")
    train_sizes, train_scores, test_scores = learning_curve(
        reset_model(RandomForest(num_trees=100, max_depth=15, min_samples_split=20)),
        X_train, y_train, cv=5, scoring='accuracy', n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 5)
    )

    # Calcular la media y desviación estándar de los conjuntos de entrenamiento y prueba
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    train_accuracy = rf.score(X_train, y_train)
    test_accuracy = rf.score(X_test, y_test)
    print(f"Precisión del conjunto de entrenamiento: {train_accuracy * 100:.2f}%")
    print(f"Precisión del conjunto de prueba: {test_accuracy * 100:.2f}%")
    
    # Graficar la curva de aprendizaje
    plt.figure()
    plt.plot(train_sizes, train_mean, 'o-', color="r", label="Precisión en entrenamiento")
    plt.plot(train_sizes, test_mean, 'o-', color="g", label="Precisión en validación cruzada")
    plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color="r")
    plt.fill_between(train_sizes, test_mean - test_std, test_mean + test_std, alpha=0.1, color="g")
    plt.title('Curva de aprendizaje')
    plt.xlabel('Tamaño de entrenamiento')
    plt.ylabel('Precisión')
    plt.legend(loc="best")
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    main()
