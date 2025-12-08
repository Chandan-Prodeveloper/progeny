// ml-service/predict.ts
import * as tf from '@tensorflow/tfjs-node';
import { CropType, getClassMapping, getDiseaseRemedies } from './class-mappings';
import sharp from 'sharp';

// Cache for loaded models
const modelCache: Map<CropType, tf.LayersModel> = new Map();

// Model paths - adjust these based on your model storage location
const MODEL_PATHS = {
  apple: process.env.APPLE_MODEL_PATH || './models/apple_model.h5',
  corn: process.env.CORN_MODEL_PATH || './models/corn_model.h5',
  potato: process.env.POTATO_MODEL_PATH || './models/potato_model.h5',
  tomato: process.env.TOMATO_MODEL_PATH || './models/tomato_model.h5',
};

// Image preprocessing configuration
const IMAGE_SIZE = 224; // Adjust based on your model's input size

/**
 * Load model from disk with caching
 */
async function loadModel(cropType: CropType): Promise<tf.LayersModel> {
  if (modelCache.has(cropType)) {
    return modelCache.get(cropType)!;
  }

  try {
    console.log(`[ML] Loading ${cropType} model from ${MODEL_PATHS[cropType]}`);
    const model = await tf.loadLayersModel(`file://${MODEL_PATHS[cropType]}`);
    modelCache.set(cropType, model);
    console.log(`[ML] ${cropType} model loaded successfully`);
    return model;
  } catch (error) {
    console.error(`[ML] Error loading ${cropType} model:`, error);
    throw new Error(`Failed to load ${cropType} model`);
  }
}

/**
 * Preprocess image buffer for model input
 */
async function preprocessImage(imageBuffer: Buffer): Promise<tf.Tensor4D> {
  try {
    // Resize and normalize image using sharp
    const processedImage = await sharp(imageBuffer)
      .resize(IMAGE_SIZE, IMAGE_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .removeAlpha()
      .raw()
      .toBuffer();

    // Convert to tensor and normalize
    const tensor = tf.tensor3d(
      new Uint8Array(processedImage),
      [IMAGE_SIZE, IMAGE_SIZE, 3]
    );

    // Normalize pixel values to [0, 1]
    const normalized = tensor.toFloat().div(tf.scalar(255));

    // Add batch dimension
    const batched = normalized.expandDims(0) as tf.Tensor4D;

    // Cleanup intermediate tensors
    tensor.dispose();
    normalized.dispose();

    return batched;
  } catch (error) {
    console.error('[ML] Error preprocessing image:', error);
    throw new Error('Failed to preprocess image');
  }
}

/**
 * Main prediction function
 */
export async function predictDisease(
  imageBuffer: Buffer,
  cropType: CropType
): Promise<{
  disease_name: string;
  confidence_score: number;
  remedies: string[];
  all_predictions: Array<{ class: string; confidence: number }>;
}> {
  let inputTensor: tf.Tensor4D | null = null;

  try {
    // Load the appropriate model
    const model = await loadModel(cropType);

    // Preprocess the image
    inputTensor = await preprocessImage(imageBuffer);

    // Run inference
    console.log(`[ML] Running inference for ${cropType}`);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probabilities = await prediction.data();

    // Get class mapping for this crop type
    const classMapping = getClassMapping(cropType);

    // Create array of all predictions
    const allPredictions = Array.from(probabilities).map((prob, index) => ({
      class: classMapping[index] || `Unknown_${index}`,
      confidence: prob,
    }));

    // Sort by confidence
    allPredictions.sort((a, b) => b.confidence - a.confidence);

    // Get top prediction
    const topPrediction = allPredictions[0];
    const diseaseName = topPrediction.class;
    const confidenceScore = topPrediction.confidence;

    // Get remedies for the detected disease
    const remedies = getDiseaseRemedies(cropType, diseaseName);

    // Cleanup
    prediction.dispose();
    inputTensor.dispose();

    console.log(`[ML] Prediction complete: ${diseaseName} (${(confidenceScore * 100).toFixed(2)}%)`);

    return {
      disease_name: diseaseName,
      confidence_score: confidenceScore,
      remedies,
      all_predictions: allPredictions,
    };
  } catch (error) {
    console.error('[ML] Prediction error:', error);
    
    // Cleanup on error
    if (inputTensor) {
      inputTensor.dispose();
    }

    throw new Error('Failed to analyze image. Please try again.');
  }
}

/**
 * Cleanup function to dispose models from cache
 */
export function disposeModels() {
  modelCache.forEach((model) => {
    model.dispose();
  });
  modelCache.clear();
  console.log('[ML] All models disposed');
}