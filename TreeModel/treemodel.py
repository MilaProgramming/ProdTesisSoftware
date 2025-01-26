import pickle
from sklearn.tree import DecisionTreeClassifier, export_text

# Datos de entrenamiento y niveles de urgencia
# Etiquetas = [dolor_cabeza, temperatura, dolor_estómago, malestar_general, dolor_garganta, herida]
# "leve"=1, "fuerte"=2, "baja"=1, "alta"=2, "no_sangra"=1, "sangra"=2

# colico, continuo 
X = [
    # Casos de entrenamiento
    # Casos 1: Critico
    [2, 2, 2, 2, 2, 2], # Síntomas graves en todas partes
    [0, 2, 0, 2, 0, 2], # Combinación de síntomas críticos: herida sangrante y temperatura alta
    [2, 2, 0, 2, 0, 0], # Combinación de síntomas críticos: dolor de cabeza fuerte y temperatura alta
    # Casos 2: Emergencia
    [0, 2, 2, 2, 0, 0],  # Temperatura alta, dolor de estómago
    [1, 1, 0, 2, 0, 1],  # Herida presente, dolor de cabeza y temperatura baja
    [1, 2, 0, 2, 0, 0],  # Dolor de cabeza leve, temperatura alta
    # Casos 3: Urgencia
    [0, 2, 0, 2, 0, 0],  # Solo temperatura alta.
    [1, 1, 0, 2, 0, 1],  # Dolor de cabeza leve, malestar general alto, herida presente.
    [0, 1, 2, 1, 0, 0],  # Dolor estomacal alto y temperatura baja.
    # Casos 4: Estándar
    [1, 1, 0, 0, 0, 0],  # Dolor de cabeza leve, temperatura baja.
    [0, 1, 1, 0, 0, 0],  # Dolor estomacal leve, temperatura baja.
    [0, 0, 0, 2, 0, 0],  # Malestar general alto.
    # Casos 5: No urgente
    [0, 0, 0, 0, 0, 0],  # Sin ningún síntoma.
    [0, 0, 0, 0, 1, 0],  # Solo dolor de garganta leve.
    [0, 0, 1, 0, 0, 0],  # Solo dolor estomacal leve.
]

y = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5]

# Entrenar un clasificador de árbol de decisión
clf = DecisionTreeClassifier()
clf.fit(X, y)

# Ejemplo: Predecir urgencia para nuevos síntomas
# Síntomas: dolor de cabeza leve, temperatura alta, dolor de estómago fuerte, sin malestar, dolor de garganta, sin herida sangrante
nuevos_sintomas = [[1, 2, 2, 0, 1, 0]]
nivel_urgencia = clf.predict(nuevos_sintomas)

print("Nivel de urgencia predicho:", nivel_urgencia[0])

# Mostrar la estructura del árbol de decisión
reglas_arbol = export_text(clf, feature_names=[
    "dolor_cabeza", "temperatura", "dolor_estómago", "malestar_general", "dolor_garganta", "herida"
])
print(reglas_arbol)

# Guardar el modelo en un archivo .pkl
with open('modelo_arbol.pkl', 'wb') as file:
    pickle.dump(clf, file)

print("Modelo guardado como 'modelo_arbol.pkl'")