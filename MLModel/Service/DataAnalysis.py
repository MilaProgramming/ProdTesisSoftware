import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

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
    
def check_data_types(data):
    """
    Muestra los tipos de datos de cada columna y el número de valores únicos para datos categóricos.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    print("\nTipos de datos de las columnas:")
    print(data.dtypes)
    print("\nNúmero de valores únicos en columnas categóricas:")
    for col in data.select_dtypes(include='object').columns:
        print(f"{col}: {data[col].nunique()} valores únicos")

def plot_categorical_distributions(data):
    """
    Grafica las distribuciones de las columnas categóricas.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    categorical_columns = data.select_dtypes(include=['object', 'category']).columns.tolist()
    for col in categorical_columns:
        plt.figure(figsize=(10, 6))
        sns.countplot(data=data, x=col, order=data[col].value_counts().index, palette='viridis')
        plt.title(f"Distribución de {col}")
        plt.xticks(rotation=45)
        plt.show()

def detect_outliers(data):
    """
    Detecta posibles valores atípicos usando el método IQR.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    """
    numeric_columns = data.select_dtypes(include=[np.number]).columns.tolist()
    for col in numeric_columns:
        Q1 = data[col].quantile(0.25)
        Q3 = data[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outliers = data[(data[col] < lower_bound) | (data[col] > upper_bound)]
        print(f"\n{col}: {len(outliers)} posibles valores atípicos")

def check_class_balance(data, target_column):
    """
    Verifica el balance de clases de la variable objetivo.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    target_column : str
        La columna objetivo para la clasificación.
    """
    print("\nBalance de clases de la variable objetivo:")
    class_counts = data[target_column].value_counts()
    sns.barplot(x=class_counts.index, y=class_counts.values, palette='plasma')
    plt.title(f"Distribución de {target_column}")
    plt.show()

def plot_pairwise_relationships(data, target_column):
    """
    Grafica las relaciones entre pares de características.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a analizar.
    target_column : str
        La columna objetivo para colorear las relaciones.
    """
    sns.pairplot(data, hue=target_column, palette='coolwarm')
    plt.title("Relaciones entre pares de características")
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

def remove_missing_values(data, columns):
    """
    Elimina las filas con valores faltantes en las columnas especificadas.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos.
    columns : list
        Las columnas donde se deben verificar y eliminar las filas con valores faltantes.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos con las filas faltantes eliminadas.
    """
    return data.dropna(subset=columns)

def remove_missing_rows(data):
    """
    Elimina todas las filas que tienen datos faltantes.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos original.

    Retorna
    -------
    pd.DataFrame
        Un nuevo DataFrame sin filas con valores faltantes.
    """
    print(f"Total filas antes de eliminar datos faltantes: {len(data)}")
    cleaned_data = data.dropna()
    print(f"Total filas después de eliminar datos faltantes: {len(cleaned_data)}")
    print(f"Se eliminaron {len(data) - len(cleaned_data)} filas con datos faltantes.")
    return cleaned_data

def main(file_path):
    """
    Función principal para realizar análisis de datos exploratorio y análisis de idoneidad.

    Parámetros
    ----------
    file_path : str
        La ruta del archivo CSV que contiene los datos limpios.
    """
    data1 = load_cleaned_data(file_path)

    summarize_data(data1)
    
    print("\nElimino columnas no relevantes:")
    # Columns Group,Sex,Age,Patients number per hour,Arrival mode,Injury,Chief_complain,Mental,Pain,NRS_pain,SBP,DBP,HR,RR,BT,Saturation,KTAS_RN,Diagnosis in ED,Disposition,KTAS_expert,Error_group,Length of stay_min,KTAS duration_min,mistriage
    columns_to_remove = ['Group', 'Patients number per hour', 'Arrival mode', 'Chief_complain', 'Diagnosis in ED', 'Disposition','KTAS_RN', 'KTAS duration_min', 'Length of stay_min', 'mistriage', 'Error_group']
    
    data = data1.drop(columns=columns_to_remove)
    # Resumen y estadísticas del conjunto de datos
    summarize_data(data)

    # Tipos de datos y valores únicos
    check_data_types(data)

    # Verificar valores faltantes
    check_missing_values(data)
    
    dataFinal = remove_missing_rows(data)
    
    summarize_data(dataFinal)


if __name__ == "__main__":
    file_path = './Data/dataP1.csv'  # Ruta del archivo de datos limpio
    main(file_path)
