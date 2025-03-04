import pickle
from sklearn.tree import DecisionTreeClassifier, export_text

# Datos de entrenamiento optimizados y niveles de urgencia
# Etiquetas = [dolor_cabeza, temperatura_alta, dolor_abdominal, malestar_general, dolor_garganta, golpe]
# "no presente" = 0, "presente" = 1; Para dolor de cabeza escala 1 leve, 5 fuerte;

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

# Entrenar un clasificador de árbol de decisión
clf = DecisionTreeClassifier()
clf.fit(X, y) 

# Ejemplo: Predecir urgencia para nuevos síntomas
# Síntomas: dolor de cabeza leve, temperatura alta, dolor de estómago fuerte, sin dolor de garganta, sin golpe
nuevos_sintomas = [[1, 1, 1, 1, 0, 0]]
nivel_urgencia = clf.predict(nuevos_sintomas)

print("Nivel de urgencia predicho:", nivel_urgencia[0])

# Mostrar la estructura del árbol de decisión
reglas_arbol = export_text(clf, feature_names=[
    "dolor_cabeza", "temperatura_alta", "dolor_abdominal", "malestar_general", "dolor_garganta", "golpe"
])
print(reglas_arbol)

# Detalles del modelo
tree = clf.tree_

for i in range(tree.node_count):
    print(f"Node {i}:")
    print(f"  Gini impurity: {tree.impurity[i]}")
    print(f"  Samples: {tree.n_node_samples[i]}")
    print(f"  Value (class distribution): {tree.value[i]}")


# Guardar el modelo en un archivo .pkl
with open('modelo_arbol.pkl', 'wb') as file:
    pickle.dump(clf, file)

print("Modelo guardado como 'modelo_arbol.pkl'")