import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import statsmodels.api as sm

def load_cleaned_data(file_path):
    """
    Carga el conjunto de datos ya limpio desde un archivo CSV.

    Parámetros
    ----------
    file_path : str
        La ruta del archivo CSV.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos limpio.
    """
    return pd.read_csv(file_path)

def summarize_data(data):
    """
    Muestra un resumen del conjunto de datos, incluyendo estadísticas descriptivas.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    print("Resumen del conjunto de datos:")
    print(data.info())
    print("\nEstadísticas descriptivas:")
    print(data.describe())

def check_missing_values(data):
    """
    Revisa los valores faltantes en el conjunto de datos.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    missing_values = data.isnull().sum()
    print("\nValores faltantes en el conjunto de datos:")
    print(missing_values[missing_values > 0])

def check_correlations(data):
    """
    Muestra el mapa de calor de las correlaciones entre características.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    correlation_matrix = data.corr()
    plt.figure(figsize=(12, 8))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f')
    plt.title("Mapa de Calor de Correlaciones")
    plt.show()

def check_feature_importance(data, target_column, features):
    """
    Verifica la importancia de las características usando un modelo de bosque aleatorio.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    target_column : str
        La columna objetivo para la clasificación.
    features : list
        Las características que se usarán en el modelo.
    """
    X = data[features]
    y = data[target_column]
    
    # Dividir los datos en conjuntos de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    # Crear y entrenar un modelo de bosque aleatorio
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Predecir y mostrar la precisión
    y_pred = model.predict(X_test)
    print("\nPrecisión del modelo de Bosque Aleatorio:", accuracy_score(y_test, y_pred))
    print("\nReporte de Clasificación:\n", classification_report(y_test, y_pred, zero_division=0))

    # Mostrar importancia de características
    feature_importance = model.feature_importances_
    importance_df = pd.DataFrame({'Caracteristica': features, 'Importancia': feature_importance})
    importance_df = importance_df.sort_values(by='Importancia', ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importancia', y='Caracteristica', data=importance_df)
    plt.title("Importancia de las Características - Bosque Aleatorio")
    plt.show()

def plot_feature_distributions(data):
    """
    Grafica las distribuciones de las características numéricas.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    numeric_columns = data.select_dtypes(include=[np.number]).columns.tolist()
    data[numeric_columns].hist(bins=15, figsize=(15, 10), layout=(4, 4))
    plt.suptitle("Distribuciones de Características Numéricas")
    plt.show()

def check_data_suitability(data, target_column):
    """
    Revisa la idoneidad del conjunto de datos mediante una regresión logística multinomial.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    target_column : str
        La columna objetivo para la clasificación multinomial.
    """
    # Escoger las características numéricas
    numeric_columns = data.select_dtypes(include=[np.number]).columns.tolist()
    numeric_columns.remove(target_column)

    # Crear las variables independientes (X) y la variable objetivo (y)
    X = data[numeric_columns]
    y = data[target_column]
    
    # Agregar una constante a X (para la intersección)
    X = sm.add_constant(X)  
    
    # Utilizar MNLogit para regresión logística multinomial
    model = sm.MNLogit(y, X).fit()

    print("\nResultados del modelo de Regresión Logística Multinomial:")
    print(model.summary())



def main(file_path):
    """
    Función principal para realizar análisis de datos exploratorio y análisis de idoneidad.

    Parámetros
    ----------
    file_path : str
        La ruta del archivo CSV que contiene los datos limpios.
    """
    data = load_cleaned_data(file_path)

    # Resumen y estadísticas del conjunto de datos
    summarize_data(data)

    # Verificar valores faltantes
    check_missing_values(data)

    # Verificar distribuciones de características
    plot_feature_distributions(data)

    # Verificar correlaciones entre características
    check_correlations(data)

    # Verificar la importancia de las características con Bosque Aleatorio
    target_column = 'KTAS_expert'  # Columna objetivo
    features = ['Sex', 'Age', 'Arrival mode', 'Injury', 'Mental', 'Pain', 'NRS_pain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Saturation']  # Características para le analisis
    check_feature_importance(data, target_column, features)

    # Verificar idoneidad del conjunto de datos
    check_data_suitability(data, target_column)

if __name__ == "__main__":
    file_path = './Data/training_data.csv'  # Ruta del archivo de datos limpio
    main(file_path)
