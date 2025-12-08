// ml-service/class-mappings.ts
export type CropType = 'apple' | 'corn' | 'potato' | 'tomato';

// Class mappings for each crop model
export const CLASS_MAPPINGS: Record<CropType, Record<number, string>> = {
  apple: {
    0: 'Alternaria',
    1: 'Insect',
    2: 'MLB',
    3: 'Mosaic',
    4: 'Multiple',
    5: 'Powdery Mildew',
    6: 'Scab',
  },
  corn: {
    0: 'Blight',
    1: 'Common Rust',
    2: 'Healthy',
  },
  potato: {
    0: 'Early Blight',
    1: 'Late Blight',
    2: 'Healthy',
  },
  tomato: {
    0: 'Bacterial Spot',
    1: 'Early Blight',
    2: 'Late Blight',
    3: 'Leaf Mold',
    4: 'Target Spot',
    5: 'Healthy',
  },
};

// Disease remedies database
const DISEASE_REMEDIES: Record<string, string[]> = {
  // Apple diseases
  'Alternaria': [
    'Remove and destroy infected leaves and fruit',
    'Apply fungicides containing copper or mancozeb',
    'Improve air circulation by pruning',
    'Avoid overhead irrigation to reduce leaf wetness',
    'Apply preventive fungicide sprays before disease appears',
  ],
  'Insect': [
    'Identify the specific insect pest for targeted treatment',
    'Use appropriate insecticides or biological controls',
    'Remove heavily infested plant parts',
    'Encourage beneficial insects like ladybugs',
    'Use sticky traps to monitor and control pests',
  ],
  'MLB': [
    'Remove fallen leaves to reduce spore buildup',
    'Apply fungicides during early spring before symptoms appear',
    'Prune trees to improve air circulation',
    'Choose resistant apple varieties for future planting',
    'Apply protective fungicide sprays throughout growing season',
  ],
  'Mosaic': [
    'Remove and destroy infected plants immediately',
    'Control aphid populations as they spread the virus',
    'Use virus-free planting material',
    'Keep area weed-free to eliminate virus reservoirs',
    'No chemical cure available - focus on prevention',
  ],
  'Multiple': [
    'Consult with agricultural specialist for proper diagnosis',
    'Implement integrated disease management approach',
    'Improve overall plant health through proper nutrition',
    'Apply broad-spectrum fungicides as recommended',
    'Monitor plants closely and isolate affected areas',
  ],
  'Powdery Mildew': [
    'Apply sulfur or potassium bicarbonate sprays',
    'Improve air circulation around plants',
    'Avoid overhead watering',
    'Remove infected plant parts',
    'Apply fungicides at first sign of disease',
  ],
  'Scab': [
    'Apply fungicides during primary infection period',
    'Remove fallen leaves to reduce overwintering spores',
    'Prune for better air circulation',
    'Choose scab-resistant varieties',
    'Apply preventive fungicide sprays in early spring',
  ],

  // Corn diseases
  'Blight': [
    'Plant resistant corn hybrids',
    'Rotate crops with non-host plants',
    'Remove crop debris after harvest',
    'Apply fungicides if disease pressure is high',
    'Maintain proper plant spacing for air circulation',
  ],
  'Common Rust': [
    'Plant resistant varieties',
    'Apply fungicides if infection is severe',
    'Monitor fields regularly for early detection',
    'Maintain good field sanitation',
    'Avoid excessive nitrogen fertilization',
  ],

  // Potato diseases
  'Early Blight': [
    'Apply fungicides containing chlorothalonil or mancozeb',
    'Remove infected leaves promptly',
    'Practice crop rotation with non-solanaceous crops',
    'Avoid overhead irrigation',
    'Apply mulch to prevent soil splash on leaves',
  ],
  'Late Blight': [
    'Apply fungicides immediately (copper-based or systemic)',
    'Destroy infected plants to prevent spread',
    'Plant certified disease-free seed potatoes',
    'Improve air circulation',
    'Monitor weather conditions and spray preventively',
  ],

  // Tomato diseases
  'Bacterial Spot': [
    'Use disease-free seeds and transplants',
    'Apply copper-based bactericides',
    'Avoid overhead irrigation',
    'Remove and destroy infected plant material',
    'Practice crop rotation (3-4 years)',
  ],
  'Leaf Mold': [
    'Improve air circulation and reduce humidity',
    'Apply fungicides containing chlorothalonil',
    'Remove infected leaves',
    'Avoid wetting foliage when watering',
    'Plant resistant varieties',
  ],
  'Target Spot': [
    'Apply fungicides at first sign of disease',
    'Remove infected plant debris',
    'Improve air circulation',
    'Avoid overhead irrigation',
    'Practice crop rotation',
  ],

  // Healthy plants
  'Healthy': [
    'Continue regular monitoring for early disease detection',
    'Maintain proper watering and fertilization schedule',
    'Ensure good air circulation around plants',
    'Practice preventive measures like crop rotation',
    'Keep growing area clean and weed-free',
  ],
};

/**
 * Get class mapping for a specific crop type
 */
export function getClassMapping(cropType: CropType): Record<number, string> {
  return CLASS_MAPPINGS[cropType];
}

/**
 * Get remedies for a specific disease
 */
export function getDiseaseRemedies(cropType: CropType, diseaseName: string): string[] {
  // Normalize disease name for lookup
  const normalizedName = diseaseName.trim();
  
  if (DISEASE_REMEDIES[normalizedName]) {
    return DISEASE_REMEDIES[normalizedName];
  }

  // Return generic remedies if specific ones not found
  return [
    'Consult with a local agricultural extension service',
    'Remove and destroy infected plant parts',
    'Improve plant care practices (watering, fertilization)',
    'Monitor plants regularly for changes',
    'Consider using appropriate fungicides or pesticides as recommended',
  ];
}

/**
 * Get all available crop types
 */
export function getAvailableCropTypes(): CropType[] {
  return Object.keys(CLASS_MAPPINGS) as CropType[];
}

/**
 * Validate if a crop type is supported
 */
export function isValidCropType(cropType: string): cropType is CropType {
  return cropType in CLASS_MAPPINGS;
}