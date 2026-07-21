# AR-Based Fitness System for Personalized Home Workout Guidance and Performance Tracking

A browser-based intelligent fitness application that combines **Computer Vision**, **Machine Learning**, and **Augmented Reality** to provide real-time home workout guidance and posture assessment.

The system performs **all pose estimation, biomechanical feature extraction, and machine learning inference locally within the browser**, ensuring low latency and improved privacy.

---

## Features

- Secure login using Firebase Authentication
- Real-time pose estimation using MediaPipe Pose
- Exercise form classification using Random Forest classifiers
- Biomechanical feature extraction
- Real-time repetition counting
- Live posture feedback
- Augmented Reality exercise demonstrations
- Workout dashboard with performance statistics
- Browser-based Progressive Web Application (PWA)
- No cloud storage of workout or profile data

---

## Supported Exercises

- Squat
- Bicep Curl

---

## Technologies Used

### Frontend

- React.js
- React Router
- HTML5
- CSS3

### Computer Vision

- MediaPipe Pose

### Machine Learning

- Random Forest Classifiers
- JSON Model Deployment

### Augmented Reality

- Three.js
- React Three Fiber

### Authentication

- Firebase Authentication

### Browser APIs

- WebRTC
- MediaDevices API

---

## System Architecture

```
Webcam
   │
   ▼
MediaPipe Pose
   │
   ▼
Biomechanical Feature Extraction
   │
   ▼
Random Forest Classification
   │
   ▼
Real-Time Feedback
   │
   ▼
Dashboard (React Runtime State)
```

---

## Data Processing

The application processes:

- Pose landmarks
- Joint angles
- Body symmetry
- Exercise depth
- Repetition speed

These biomechanical features are used by lightweight Random Forest classifiers to determine whether an exercise repetition is performed correctly.

---

## Privacy

The application follows a privacy-by-design approach.

- Pose estimation is performed locally.
- Machine learning inference runs entirely within the browser.
- Webcam images and videos are never stored.
- Workout statistics and profile information exist only during the active browser session using React state.
- No workout data are transmitted to external servers.

Firebase Authentication is used solely for secure access to the demonstration account.

---

## Machine Learning Models

Separate Random Forest models are provided for each supported exercise.

Current models:

- Squat Random Forest
- Bicep Curl Random Forest

Both models are deployed as lightweight JSON files for browser-based inference.

---

## Installation

Clone the repository.

```bash
git clone https://github.com/yourusername/ar-fitness.git
```

Navigate into the project.

```bash
cd ar-fitness
```

Install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm start
```

The application will be available at:

```
http://localhost:3000
```

---

## Project Structure

```
src/
│
├── components/
├── context/
├── hooks/
├── pages/
├── services/
├── utils/
├── data/
├── App.js
└── index.js

public/
│
├── squat_random_forest_model.json
├── bicepcurl_random_forest_model.json
└── assets/
```

---

## Demo Account

A demonstration account is provided for evaluation purposes.

Firebase Authentication is used only for secure login.

---

## Research Purpose

This project was developed as part of an MSc dissertation investigating browser-based intelligent fitness systems using:

- Computer Vision
- Machine Learning
- Augmented Reality
- Human Pose Estimation
- Biomechanical Feature Analysis

---

## Ethical Considerations

- No participant exercise data were collected for machine learning training.
- Synthetic biomechanical datasets were used to train the classification models.
- No webcam images or videos are stored.
- Workout information is maintained only during the active browser session.
- The demonstration account is used solely for evaluating the application's functionality.

---

## Future Improvements

- Additional supported exercises
- Deep learning-based posture classification
- Personalised workout recommendations
- Adaptive coaching
- Formal usability evaluation
- Evaluation using real-world exercise datasets collected with appropriate ethical approval

---

## Author

**Siddhartha Ratna Shakya**

MSc Computer Science

---

## License

This project is intended for academic and research purposes.