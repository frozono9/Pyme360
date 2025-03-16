import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, mean_squared_error, r2_score
from sklearn.inspection import permutation_importance
from sklearn.impute import SimpleImputer
import json
import warnings
warnings.filterwarnings('ignore')

def analizar_datos_pyme_mejorado(dataframe, target_variable, tipo_problema='clasificacion', max_features_vis=10, top_n_features_insight=3):
    """
    Analiza automáticamente un dataframe y extrae información relevante para PYMEs. (Versión Mejorada)

    Args:
        dataframe: DataFrame de pandas o ruta a archivo CSV
        target_variable: Nombre de la columna a predecir
        tipo_problema: 'clasificacion' o 'regresion'
        max_features_vis: Número máximo de características a mostrar en los gráficos de importancia.
        top_n_features_insight: Número de características principales a mencionar en el insight de importancia.

    Returns:
        dict: Diccionario con información del análisis y datos para visualizaciones
    """
    # Cargar datos si se proporciona una ruta
    if isinstance(dataframe, str):
        df = pd.read_csv(dataframe)
    else:
        df = dataframe.copy()

    # Verificar que el target existe en el dataframe
    if target_variable not in df.columns:
        return {
            'error': f'La variable objetivo "{target_variable}" no existe en el dataframe',
            'columnas_disponibles': df.columns.tolist()
        }

    # Validar tipo de problema
    tipo_problema = tipo_problema.lower()
    if tipo_problema not in ['clasificacion', 'regresion']:
        return {'error': 'Tipo de problema no válido. Opciones: "clasificacion" o "regresion"'}

    # Estructura para almacenar resultados
    resultados = {
        'resumen_datos': {},
        'analisis_estadistico': {},
        'valores_faltantes': {},
        'analisis_target': {},
        'correlaciones': {},
        'modelo': {},
        'importancia_features': {},
        'visualizaciones_data': {}, # Data for visualizations, not images
        'insights': []
    }

    # Identificar columnas por tipo (more robust way)
    all_feature_columns = [col for col in df.columns if col != target_variable] # All columns except target
    columnas_numericas = df[all_feature_columns].select_dtypes(include=['int64', 'float64']).columns.tolist()
    columnas_categoricas = df[all_feature_columns].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()

    print(f"Numeric columns identified: {len(columnas_numericas)}") # Debugging print
    print(f"Categorical columns identified: {len(columnas_categoricas)}") # Debugging print

    # 1. ANÁLISIS BÁSICO DE DATOS
    resultados['resumen_datos'] = {
        'filas': df.shape[0],
        'columnas': df.shape[1],
        'tipos_datos': {str(k): v for k, v in df.dtypes.value_counts().items()},
        'memoria_usada': f"{df.memory_usage(deep=True).sum() / 1024**2:.2f} MB"
    }

    # 2. ANÁLISIS ESTADÍSTICO
    # Estadísticas numéricas ampliadas
    if columnas_numericas:
        stats_numericas = df[columnas_numericas].describe().transpose()[['mean', 'std', 'min', 'max']]
        stats_numericas['skew'] = df[columnas_numericas].skew()
        stats_numericas['kurtosis'] = df[columnas_numericas].kurt()
        stats_numericas['unicos'] = df[columnas_numericas].nunique()
        resultados['analisis_estadistico']['numericas'] = stats_numericas.to_dict()

    # Estadísticas categóricas ampliadas
    if columnas_categoricas:
        stats_categoricas = {}
        for col in columnas_categoricas:
            if len(df[col].unique()) < 10:
                mode_val = df[col].mode()
                stats_categoricas[col] = {
                    'top_valores': df[col].value_counts().head(5).to_dict(),
                    'valores_unicos': len(df[col].unique()),
                    'moda': mode_val[0] if not mode_val.empty else None # Handle empty mode
                }
            else:
                stats_categoricas[col] = {
                    'valores_unicos': len(df[col].unique())
                } # Only unique values for high cardinality
        resultados['analisis_estadistico']['categoricas'] = stats_categoricas

    # 3. ANÁLISIS DE VALORES FALTANTES
    valores_faltantes = df.isnull().sum()
    if valores_faltantes.sum() > 0:
        resultados['valores_faltantes'] = {
            'conteo': valores_faltantes[valores_faltantes > 0].to_dict(),
            'porcentaje': (valores_faltantes[valores_faltantes > 0] / len(df) * 100).round(2).to_dict()
        }
    else:
        resultados['valores_faltantes'] = {'mensaje': 'No hay valores faltantes'}

    # 4. ANÁLISIS DE VARIABLE OBJETIVO
    if tipo_problema == 'clasificacion':
        # Distribución de clases
        target_distribution = df[target_variable].value_counts()
        resultados['analisis_target'] = {
            'distribucion': target_distribution.to_dict(),
            'porcentaje': df[target_variable].value_counts(normalize=True).round(4).to_dict(),
            'tipo_variable': 'categorica'
        }
        resultados['visualizaciones_data']['distribucion_target'] = { # Data for frontend plot
            'labels': target_distribution.index.tolist(),
            'counts': target_distribution.values.tolist()
        }

        # Añadir insight sobre balance de clases
        if len(df[target_variable].unique()) > 1:
            min_class = df[target_variable].value_counts().min()
            max_class = df[target_variable].value_counts().max()
            ratio = min_class / max_class
            if ratio < 0.3:
                resultados['insights'].append(f"Datos desbalanceados: la clase minoritaria representa solo el {(ratio*100):.1f}% de la mayoritaria")
    else:
        # Estadísticas de la variable numérica
        target_stats = df[target_variable].describe().to_dict()
        target_stats['skew'] = df[target_variable].skew()
        target_stats['kurtosis'] = df[target_variable].kurt()
        target_stats['tipo_variable'] = 'numerica'
        resultados['analisis_target'] = target_stats
        resultados['visualizaciones_data']['distribucion_target'] = { # Data for frontend plot
            'hist_values': np.histogram(df[target_variable], bins=30)[0].tolist(), # Histogram data
            'bin_edges': np.histogram(df[target_variable], bins=30)[1].tolist() # Bin edges
        }


    # 5. CORRELACIONES (solo las más relevantes para el target)
    if target_variable in df.columns and target_variable in columnas_numericas: # ensure target_variable is actually numeric column
        correlaciones = df[columnas_numericas].corr()[target_variable].sort_values(ascending=False)
        # Excluir autocorrelación
        correlaciones = correlaciones[correlaciones.index != target_variable]
        resultados['correlaciones'] = {
            'con_target': correlaciones.head(5).to_dict()
        }

        # Añadir insights sobre correlaciones
        for var, corr in correlaciones.head(3).items():
            if abs(corr) > 0.7:
                direccion = "positiva" if corr > 0 else "negativa"
                resultados['insights'].append(f"Fuerte correlación {direccion} ({corr:.2f}) entre {target_variable} y {var}")
    else:
        resultados['correlaciones'] = {'mensaje': 'Análisis de correlaciones no aplicable o variable objetivo no numérica.'}

    # 6. MODELADO Y EVALUACIÓN
    # Preparar datos
    X = df.drop(columns=[target_variable])
    y = df[target_variable]

    # División en conjuntos de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    # Preprocesamiento combinado
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # Modificar el OneHotEncoder para ignorar categorías con alta cardinalidad
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', max_categories=5))  # Limitar a 5 categorías por variable
    ])

    # En el ColumnTransformer, eliminar el remainder='passthrough' si no es necesario
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, columnas_numericas),
            ('cat', categorical_transformer, columnas_categoricas)
        ],
        remainder='drop'  # Cambiar de 'passthrough' a 'drop'
    )

    # Seleccionar modelo según tipo de problema
    if tipo_problema == 'clasificacion':
        model = RandomForestClassifier(n_estimators=100, random_state=42)
    else:
        model = RandomForestRegressor(n_estimators=100, random_state=42)

    # Pipeline de modelo
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])

    # Entrenamiento y evaluación
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    # Métricas según tipo de problema
    if tipo_problema == 'clasificacion':
        report = classification_report(y_test, y_pred, output_dict=True)
        cm = confusion_matrix(y_test, y_pred)

        resultados['modelo'] = {
            'accuracy': round(report['accuracy'], 4),
            'precision': round(report['weighted avg']['precision'], 4),
            'recall': round(report['weighted avg']['recall'], 4),
            'f1': round(report['weighted avg']['f1-score'], 4),
            'matriz_confusion': cm.tolist()
        }

        # Añadir insight sobre rendimiento
        if report['accuracy'] > 0.8:
            resultados['insights'].append(f"El modelo logra una buena precisión de {report['accuracy']:.2f}")
        elif report['accuracy'] < 0.6:
            resultados['insights'].append(f"El modelo tiene una precisión baja de {report['accuracy']:.2f}. Considere más datos o diferentes features")
    else:
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        resultados['modelo'] = {
            'rmse': round(np.sqrt(mse), 4),
            'r2': round(r2, 4)
        }

        # Añadir insight sobre rendimiento
        if r2 > 0.7:
            resultados['insights'].append(f"El modelo explica bien la variabilidad con R² de {r2:.2f}")
        elif r2 < 0.3:
            resultados['insights'].append(f"El modelo solo explica {r2:.2f} de la variabilidad. Considere mejorar las features")

    # 7. IMPORTANCIA DE CARACTERÍSTICAS
    importancias = None # Initialize importancias to None
    try:
            # Get the preprocessed test data
            # Dentro del bloque try de "IMPORTANCIA DE CARACTERÍSTICAS":

        # Obtener nombres de características considerando el remainder
        preprocessor = pipeline.named_steps['preprocessor']
        feature_names = preprocessor.get_feature_names_out()

        # Si hay columnas residuales (remainder='passthrough'), sus nombres no se modifican
        # Asegurar que todas las características están incluidas
        X_test_transformed = preprocessor.transform(X_test)

        # Si es una matriz dispersa, convertir a densa
        if hasattr(X_test_transformed, 'toarray'):
            X_test_transformed = X_test_transformed.toarray()

        # Verificar consistencia en dimensiones
        if len(feature_names) != X_test_transformed.shape[1]:
            feature_names = [f'feature_{i}' for i in range(X_test_transformed.shape[1])]

        # Calcular importancia de permutación
        # Dentro del bloque try, reducir n_repeats y usar paralelismo
        perm_importance = permutation_importance(
            pipeline.named_steps['model'], 
            X_test_transformed,
            y_test, 
            n_repeats=3,  # Reducir de 5 a 3
            random_state=42,
            n_jobs=-1  # Usar todos los núcleos del CPU
        )

        # Crear DataFrame con nombres e importancias
        importancias_df = pd.DataFrame({
            'caracteristica': feature_names,
            'importancia': perm_importance.importances_mean,
            'std': perm_importance.importances_std
        }).sort_values('importancia', ascending=False)
        resultados['importancia_features']['importancias_completas'] = importancias_df.to_dict(orient='records')
        importancias = importancias_df

        # --- MEJORAS EN INSIGHTS DE IMPORTANCIA DE FEATURES ---
        # Insight general sobre importancia de features
        resultados['insights'].append("La importancia de las características indica cuánto contribuye cada una a las predicciones del modelo. Cuanto mayor sea la puntuación de importancia, más influyente es la característica.")

        # Insight con las top N características más importantes
        top_n_features = importancias.head(top_n_features_insight)
        top_feature_names = top_n_features['caracteristica'].tolist()
        top_feature_list_str = ", ".join(top_feature_names) # Formatear lista de features como string

        if top_feature_names: # Ensure there are top features to list
            resultados['insights'].append(f"Las características más influyentes en el modelo son: {top_feature_list_str}.")
        else:
            resultados['insights'].append("No se pudieron determinar características influyentes.") # Fallback message

        # Insight sugiriendo acciones basadas en la importancia
        resultados['insights'].append("Considere enfocarse en estas características clave para análisis adicionales, ingeniería de características o recolección de datos.")
        # --- FIN DE MEJORAS EN INSIGHTS DE IMPORTANCIA DE FEATURES ---


    except Exception as e:
        resultados['importancia_features'] = {'error': str(e)}
        resultados['insights'].append(f"Error al calcular la importancia de las características: {str(e)}") # Insight de error más descriptivo
        print(f"Error in feature importance: {e}") # Print full error for debugging


    # 8. DATOS PARA VISUALIZACIÓN DE RELACIÓN FEATURE VS TARGET
    if importancias is not None and isinstance(importancias, pd.DataFrame): # Ensure importancias is DataFrame and not None
        top_num_features = [f for f in importancias['caracteristica'].tolist()
                            if f in columnas_numericas and f in df.columns][:3]

        if top_num_features:
            resultados['visualizaciones_data']['top_features_vs_target'] = []
            for feature in top_num_features[:3]:
                if tipo_problema == 'clasificacion':
                    # Data for boxplot
                    plot_data = []
                    for category in df[target_variable].unique():
                        category_data = df[df[target_variable] == category][feature].tolist()
                        plot_data.append({'category': str(category), 'values': category_data}) # Ensure category is string for JSON
                    resultados['visualizaciones_data']['top_features_vs_target'].append({
                        'feature': feature,
                        'type': 'boxplot',
                        'data': plot_data
                    })
                else:
                    # Data for scatterplot
                    resultados['visualizaciones_data']['top_features_vs_target'].append({
                        'feature': feature,
                        'type': 'scatterplot',
                        'x_values': df[feature].tolist(),
                        'y_values': df[target_variable].tolist()
                    })
    else:
        resultados['visualizaciones_data']['top_features_vs_target'] = {'mensaje': 'Importancia de características no calculada, no se puede generar visualización Feature vs Target'}


    return resultados

# # Ejemplo de uso (con la función mejorada):
# df = pd.read_csv('pruebas_sigma/train.csv')
# resultados_mejorado = analizar_datos_pyme_mejorado(df, 'Survived', tipo_problema='clasificacion', max_features_vis=7, top_n_features_insight=5) # Ejemplo con parámetros ajustados
# print(json.dumps(resultados_mejorado, indent=2, ensure_ascii=False))
# # Guardar resultados en un archivo JSON
# output_path = '/Users/nicolasrosales/Desktop/prueba json/pruebas_sigma/resultados_analisis.json'
# with open(output_path, 'w', encoding='utf-8') as f:
#     json.dump(resultados_mejorado, f, ensure_ascii=False, indent=2)

# print(f"Resultados guardados en {output_path}")