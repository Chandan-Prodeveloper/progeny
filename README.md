# Plant Disease Detection System

Full-stack application for detecting plant diseases using machine learning.

## Project Structure

```
.
├── app/                    # Next.js frontend application
├── components/             # React components
├── backend/               # Python Flask ML service
│   ├── models/           # TensorFlow models (.h5 files)
│   ├── utils/            # Utility scripts
│   ├── app.py            # Flask application
│   └── requirements.txt  # Python dependencies
├── lib/                   # Shared utilities
└── public/               # Static assets
```

## Setup Instructions

### 1. Frontend Setup (Next.js)

```bash
# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Update .env.local with your credentials
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ML_SERVICE_URL (default: http://localhost:5000)

# Run development server
npm run dev
```

Frontend will be available at http://localhost:3000

### 2. Backend Setup (Python Flask)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Ensure models are in backend/models/ directory
# The setup script should have copied them automatically

# Run the Flask server
python app.py
```

Backend will be available at http://localhost:5000

### 3. Verify Setup

Test the backend health endpoint:
```bash
curl http://localhost:5000/health
```

## Running Both Services

### Option 1: Separate Terminals

Terminal 1 (Backend):
```bash
cd backend
venv\Scripts\activate
python app.py
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Option 2: Using the startup script (Windows)

```bash
start-dev.bat
```

## API Endpoints

### Backend (Flask)

- `GET /health` - Health check and model status
- `POST /predict` - Predict plant disease from image
  - Parameters: `image` (file), `crop_type` (string)

### Frontend (Next.js)

- `/` - Home page
- `/dashboard` - User dashboard
- `/api/scan` - Scan API (proxies to backend)

## Supported Crops

- Apple
- Corn
- Potato
- Tomato

## Technologies

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)

### Backend
- Python 3.x
- Flask
- TensorFlow 2.19
- NumPy
- Pillow

## Troubleshooting

### Backend Issues

1. **Models not loading**: Ensure .h5 files are in `backend/models/`
2. **TensorFlow errors**: Run diagnostic script:
   ```bash
   cd backend
   python utils/diagnose_tf.py
   ```
3. **Port already in use**: Change PORT in `backend/.env`

### Frontend Issues

1. **API connection failed**: Verify `ML_SERVICE_URL` in `.env.local`
2. **Supabase errors**: Check Supabase credentials
3. **Build errors**: Clear cache with `rm -rf .next && npm run dev`

## Development

### Adding New Crop Models

1. Place model file in `backend/models/` as `{crop}_model.h5`
2. Update `CROP_TYPES` in `backend/config.py`
3. Add class mappings in `backend/app.py`
4. Add disease remedies in `backend/app.py`

## License

MIT
