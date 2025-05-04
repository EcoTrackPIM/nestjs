import os
import re
import time
import pytesseract
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict
from pydantic import BaseModel
import tempfile
from pathlib import Path
import logging
from PIL import Image
import cv2
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Textile Tag OCR Service",
    description="API for extracting exact text from textile composition tags",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TagAnalysisResult(BaseModel):
    extracted_text: str = ""
    detected_composition: Dict[str, float] = {}
    is_exact: bool = False
    processing_time_ms: float

def preprocess_image(image_path: str) -> Image.Image:
    """Enhanced image preprocessing for textile tags"""
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image")

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Resize for better OCR (but not too large)
        height, width = gray.shape
        if max(height, width) < 1000:
            gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

        # Adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 31, 10
        )

        # Clean up small artifacts
        kernel = np.ones((2,2), np.uint8)
        processed = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

        return Image.fromarray(processed)
    except Exception as e:
        logger.error(f"Image preprocessing failed: {str(e)}")
        raise

def extract_text_from_image(image_path: str) -> str:
    """Specialized text extraction for textile tags"""
    try:
        img = preprocess_image(image_path)
        
        # Custom configuration optimized for textile tags
        custom_config = r'--oem 3 --psm 6 -l eng+textile'
        text = pytesseract.image_to_string(img, config=custom_config)
        
        # Clean up common OCR errors
        text = text.replace('|', 'I').replace(':', '').replace('=', '')
        text = re.sub(r'\n\s*\n', '\n', text)  # Remove empty lines
        return text.strip() or "No text could be extracted from the image"
    except Exception as e:
        logger.error(f"Text extraction failed: {str(e)}")
        return "Text extraction failed"

def extract_composition(text: str) -> Dict[str, float]:
    """Specialized composition extraction for textile tags"""
    patterns = [
        # Standard percentage patterns
        (r'(\d+)\s*%\s*(COTTON|POLYESTER|POLY|WOOL|SILK|LINEN|ELASTANE|LYCRA|NYLON)', 
         lambda m: (m.group(2).capitalize(), float(m.group(1)))),
        (r'(COTTON|POLYESTER|POLY|WOOL|SILK|LINEN|ELASTANE|LYCRA|NYLON)\s*(\d+)\s*%', 
         lambda m: (m.group(1).capitalize(), float(m.group(2)))),
        
        # Handle common OCR misreads
        (r'(\d+)\s*%\s*(C[O0]TT[O0]N|P[O0]LY[E3]STER)', 
         lambda m: (m.group(2).replace('0','O').replace('3','E').capitalize(), float(m.group(1)))),
         
        # Combined percentages
        (r'(\d+)\s*/\s*(\d+)\s*%', 
         lambda m: [("Cotton", float(m.group(1))), ("Polyester", float(m.group(2)))])
    ]
    
    composition = {}
    text = text.upper()  # Normalize to uppercase
    
    for pattern, processor in patterns:
        try:
            for match in re.finditer(pattern, text):
                result = processor(match)
                if isinstance(result, list):
                    for material, percent in result:
                        composition[material] = percent
                else:
                    material, percent = result
                    composition[material] = percent
        except Exception as e:
            logger.warning(f"Pattern {pattern} failed: {str(e)}")
            continue
    
    # Validate composition
    if composition:
        total = sum(composition.values())
        if 95 <= total <= 105:  # Allow small rounding errors
            return {k: round(v, 1) for k, v in composition.items()}
    
    return {}

@app.post("/analyze", response_model=TagAnalysisResult)
async def analyze_tag(file: UploadFile = File(...)):
    start_time = time.time()
    temp_path = None
    
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as temp_file:
            temp_path = temp_file.name
            temp_file.write(await file.read())

        extracted_text = extract_text_from_image(temp_path)
        composition = extract_composition(extracted_text)
        
        # Post-process extracted text to fix common issues
        clean_text = re.sub(r'([A-Z])\s+([A-Z])', r'\1\2', extracted_text)  # Fix split words
        clean_text = re.sub(r'\n\s*\n', '\n', clean_text)  # Remove excessive newlines
        
        return TagAnalysisResult(
            extracted_text=clean_text,
            detected_composition=composition,
            is_exact=bool(composition),
            processing_time_ms=round((time.time() - start_time) * 1000, 2)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}"
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except Exception:
                pass

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Tag OCR Service"}

if __name__ == "__main__":
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    uvicorn.run(app, host="0.0.0.0", port=8001)