
from fastapi import APIRouter, UploadFile, File, Form
import pandas as pd
import tempfile
import os
import sys
import json

# Add parent directory to path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from analizador_importancias import analizar_datos_pyme_mejorado

router = APIRouter()

@router.post("/analyze")
async def analyze_data(file: UploadFile = File(...), target_variable: str = Form(...)):
    """
    API endpoint to analyze data using analizador_importancias.py
    
    Args:
        file: CSV file to analyze
        target_variable: Column to predict/analyze
        
    Returns:
        JSON with analysis results
    """
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
            temp_file_path = temp_file.name
            contents = await file.read()
            temp_file.write(contents)
            
        # Read the CSV file with pandas
        df = pd.read_csv(temp_file_path)
        
        # Run the analysis
        results = analizar_datos_pyme_mejorado(
            df, 
            target_variable=target_variable, 
            tipo_problema='clasificacion'
        )
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return results
    except Exception as e:
        return {"error": str(e)}
