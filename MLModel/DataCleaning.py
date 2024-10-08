import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def load_data(file_path):
    """
    Carga el conjunto de datos desde un archivo CSV.

    Parámetros
    ----------
    file_path : str
        La ruta del archivo CSV.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos cargado.
    """
    return pd.read_csv(file_path, delimiter=';', encoding='latin1')

def replace_invalid_data(data, invalid_value='??'):
    """
    Reemplaza los valores inválidos en el conjunto de datos con NaN.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos que contiene valores inválidos.
    invalid_value : str, opcional
        El valor inválido a reemplazar (por defecto es '??').
    """
    data.replace(invalid_value, np.nan, inplace=True)

def clean_nrs_pain(data):
    """
    Limpia la columna NRS_pain y realiza la imputación de valores faltantes.

    Convierte la columna NRS_pain a valores numéricos y reemplaza los valores
    faltantes con la media de la columna.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos que contiene la columna NRS_pain.

    Retorna
    -------
    int
        El número de valores faltantes antes de la imputación.
    """
    data['NRS_pain'] = pd.to_numeric(data['NRS_pain'], errors='coerce')
    missing_count = data['NRS_pain'].isnull().sum()
    mean_value = data['NRS_pain'].mean()
    data['NRS_pain'] = data['NRS_pain'].fillna(mean_value)
    
    return missing_count

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

def ensure_numeric(data, column_name):
    """
    Asegura que la columna especificada sea numérica.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos.
    column_name : str
        El nombre de la columna que debe ser numérica.
    """
    data[column_name] = pd.to_numeric(data[column_name], errors='coerce')

def prepare_data_for_regression(data, features):
    """
    Prepara el conjunto de datos para la regresión eliminando valores faltantes.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos que contiene las características.
    features : list
        Las características que se usarán para la regresión.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos preparado para la regresión.
    """
    data = data.dropna(subset=features)
    return data[data['Saturation'].notnull()]

def train_linear_regression(X_train, y_train):
    """
    Entrena un modelo de regresión lineal.

    Parámetros
    ----------
    X_train : pd.DataFrame
        Las características de entrenamiento.
    y_train : pd.Series
        La variable objetivo (Saturation) para entrenamiento.

    Retorna
    -------
    LinearRegression
        El modelo de regresión lineal entrenado.
    """
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

def predict_missing_saturation(model, missing_data, features):
    """
    Predice y rellena los valores faltantes de Saturation.

    Parámetros
    ----------
    model : LinearRegression
        El modelo de regresión lineal entrenado.
    missing_data : pd.DataFrame
        Las filas con valores faltantes de Saturation.
    features : list
        Las características usadas para predecir Saturation.

    Retorna
    -------
    np.ndarray
        Los valores de Saturation predichos.
    """
    X_missing = missing_data[features]
    predicted_saturation = model.predict(X_missing)
    return predicted_saturation

def save_to_csv(data, output_file_path):
    """
    Guarda el conjunto de datos en un archivo CSV.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a guardar.
    output_file_path : str
        La ruta del archivo CSV de salida.
    """
    data.to_csv(output_file_path, index=False)
    print(f"Datos limpios guardados en {output_file_path}")

def remove_columns(data, columns_to_remove):
    """
    Elimina las columnas especificadas del conjunto de datos.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos.
    columns_to_remove : list
        Las columnas a eliminar.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos sin las columnas especificadas.
    """
    return data.drop(columns=columns_to_remove)

def convert_object_to_numeric(data):
    """
    Convierte columnas de tipo objeto a int64 o float64, según su contenido.

    Las columnas con comas se convierten primero a punto decimal antes de intentar
    convertirlas a numérico.

    Parámetros
    ----------
    data : pd.DataFrame
        El conjunto de datos a convertir.

    Retorna
    -------
    pd.DataFrame
        El conjunto de datos con las columnas convertidas.
    """
    for column in data.select_dtypes(include=['object']).columns:
        if data[column].str.contains(r'\,').any():
            data[column] = data[column].str.replace(',', '.')
            print(f"Se eliminaron comas en {column}")
        
        if data[column].str.contains(r'\.').any():
            try:
                data[column] = pd.to_numeric(data[column], errors='raise').astype('float64')
                print(f"Se convirtió {column} a float64")
            except ValueError:
                print(f"No se pudo convertir {column} a float64")
        else:
            try:
                data[column] = pd.to_numeric(data[column], errors='raise').astype('int64')
                print(f"Se convirtió {column} a int64")
            except ValueError:
                try:
                    data[column] = pd.to_numeric(data[column], errors='raise').astype('float64')
                    print(f"Se convirtió {column} a float64")
                except ValueError:
                    print(f"No se pudo convertir {column} a tipos numéricos")
    
    return data

def main(file_path):
    """
    Función principal que realiza la limpieza de datos y el entrenamiento de un modelo de regresión lineal.

    Parámetros
    ----------
    file_path : str
        La ruta del archivo CSV que contiene los datos.
    """
    data = load_data(file_path)
    replace_invalid_data(data)
    missing_nrs_pain_count = clean_nrs_pain(data)
    print(f'Valores faltantes en NRS_pain después de la limpieza: {missing_nrs_pain_count}')

    print("Valores faltantes antes de la limpieza:")
    print(data.isnull().sum()[data.isnull().sum() > 0])

    columns_to_check = ['Chief_complain', 'SBP', 'DBP', 'HR', 'RR', 'BT', 'Diagnosis in ED']
    data = remove_missing_values(data, columns_to_check)
    print(f'Número de filas después de la limpieza: {len(data)}')

    ensure_numeric(data, 'Saturation')

    features = ['Age', 'RR']
    train_data = prepare_data_for_regression(data, features)

    X_train, X_test, y_train, y_test = train_test_split(
        train_data[features], 
        train_data['Saturation'], 
        test_size=0.25, 
        random_state=42
    )

    model = train_linear_regression(X_train, y_train)
    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    print(f"Error cuadrático medio (RMSE): {rmse}")

    missing_saturation = data[data['Saturation'].isnull()]
    predicted_saturation = predict_missing_saturation(model, missing_saturation, features)
    data.loc[data['Saturation'].isnull(), 'Saturation'] = predicted_saturation

    print(f'Valores faltantes de Saturation después de la predicción: {data["Saturation"].isnull().sum()}')
    print("Valores faltantes finales:")
    print(data.isnull().sum()[data.isnull().sum() > 0])

    columns_to_remove = ['Chief_complain', 'Diagnosis in ED', 'Group', 'Patients number per hour', 'KTAS_RN', 'mistriage', 'Length of stay_min', 'KTAS duration_min', 'Error_group', 'Disposition']
    data = remove_columns(data, columns_to_remove)
    print(f"Se eliminaron las columnas: {columns_to_remove}")

    data = convert_object_to_numeric(data)
    print(data.dtypes)

    output_file_path = './Data/training_data.csv'
    save_to_csv(data, output_file_path)

if __name__ == "__main__":
    file_path = './Data/data.csv'
    main(file_path)
