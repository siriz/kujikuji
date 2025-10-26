# 🎲 KUJIKUJI - Interactive 3D Lottery

An interactive 3D lottery application built with Three.js and GSAP, featuring animated robot characters with smooth camera transitions, dramatic lighting effects, and particle animations.

![KUJIKUJI Demo](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### Character Management
- **Flexible Input System** - Three ways to add characters:
  - Number-based auto-generation
  - Text paste (line-by-line parsing)
  - Manual individual addition
- **DiceBear Avatar Integration** - Unique robot avatars for each character
- **Edit & Delete** - Modify character names or remove them anytime
- **LocalStorage Persistence** - Characters saved automatically

### 3D Scene
- **Dynamic Character Placement** - Intelligent positioning algorithm:
  - Center-based circular arrangement
  - Collision detection to prevent overlaps
  - Automatic scaling for any number of characters
- **Animated Robots** - Each character displays random animations
- **Smooth Camera Movements** - GSAP-powered cinematic transitions
- **Dynamic Lighting** - Spotlight effects for dramatic reveals

### Selection System
- **Random Lottery** - Fair random selection from remaining characters
- **Particle Effects** - Spectacular visual feedback:
  - Gold particle burst
  - Sparkle effects
  - Firework celebration
- **Selection Tracking** - Progress saved to localStorage
- **Statistics Display** - Real-time progress monitoring

### UI/UX
- **Responsive Design** - Works on desktop and mobile devices
- **Intuitive Controls** - Easy navigation between screens
- **Progress Tracking** - Visual feedback on selection status
- **Completion Detection** - Automatic prompt when all characters are selected

## 🎮 How to Use

### Step 1: Add Characters (`index.html`)

Choose one of three input methods:

1. **Number Generation**: Enter a number (1-50) to auto-generate characters named "User 1", "User 2", etc.
2. **Text Paste**: Copy and paste names from Excel or a text file (one name per line)
3. **Manual Addition**: Click the "+ Add" button to add characters one by one

Each character gets a unique robot avatar from DiceBear. You can edit names or delete characters before starting.

### Step 2: Start the Lottery (`select.html`)

1. Click **"배치 시작하기"** (Start) to proceed to the 3D scene
2. Characters are randomly arranged in a circular pattern
3. The camera smoothly descends to reveal all characters
4. Watch as characters perform random animations

### Step 3: Make Selections

1. Click the **"GO"** button to randomly select a character
2. Enjoy the dramatic reveal:
   - Background darkens
   - Spotlight focuses on the winner
   - Particle effects burst
   - Character performs emotes
   - Name card flips to reveal identity

3. Click **"RETURN"** to go back to the overview
4. Repeat until all characters are selected

### Step 4: Completion

- Progress is tracked in the top-left corner
- When all characters are selected, you'll be prompted to restart
- All data persists in localStorage between sessions

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebGL support
- LocalStorage enabled
- Local web server (or use the methods below)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/siriz/kujikuji.git
cd kujikuji
```

2. Serve the files using a local web server:

**Option 1: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Using Node.js**
```bash
npx http-server
```

**Option 3: Using VS Code**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 📁 Project Structure

```
kujikuji/
├── index.html          # Character input screen (entry point)
├── select.html         # Main 3D lottery selection scene
├── css/
│   ├── main.css       # Global stylesheet
│   └── select.css     # Select page specific styles
├── js/
│   ├── main.js        # Main 3D scene logic
│   ├── storage.js     # LocalStorage data management
│   ├── utils.js       # Utility functions (positioning, collision detection)
│   └── particles.js   # Particle effect system
├── libs/
│   ├── gsap/
│   │   └── gsap.min.js    # GSAP animation library (local)
│   └── threejs/       # Three.js library files
│       ├── build/
│       │   └── three.module.js
│       └── jsm/       # Three.js addons and utilities
│           ├── controls/      # OrbitControls
│           ├── loaders/       # GLTFLoader, FontLoader
│           ├── geometries/    # TextGeometry
│           └── libs/          # Stats, GUI
├── models/            # 3D model files
│   └── gltf/
│       └── RobotExpressive/
└── fonts/             # Font files for 3D text
    └── optimer_bold.typeface.json
```

## 🛠️ Technologies Used

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[GSAP](https://greensock.com/gsap/)** - Animation library (local)
- **[DiceBear API](https://www.dicebear.com/)** - Avatar generation
- **[GLTF](https://www.khronos.org/gltf/)** - 3D model format
- **WebGL** - Hardware-accelerated 3D rendering
- **LocalStorage** - Client-side data persistence
- **OrbitControls** - Camera controls for user interaction

## 🎨 Customization

### Adding Your Own Character Names

1. Open `index.html`
2. Use any of the three input methods
3. Characters are automatically saved to localStorage

### Adjusting Visual Effects

Edit `js/particles.js` to customize:
- Particle count
- Colors
- Animation duration
- Effect types

```javascript
ParticleEffects.createSelectionEffect(scene, position, {
    particleCount: 100,  // More particles
    color: 0xFF0000,     // Red particles
    duration: 3          // Longer animation
});
```

### Changing Positioning Algorithm

Modify `js/utils.js` → `generatePositions()`:
- Adjust `minDistance` for spacing
- Change layer spacing
- Modify circular/spiral patterns

## 📊 Data Management

### LocalStorage Structure

```json
{
  "characters": [
    {
      "id": "unique-id",
      "name": "Character Name",
      "avatarSeed": "random-seed",
      "selected": false,
      "selectedAt": null,
      "createdAt": "2025-10-26T..."
    }
  ],
  "selectedCharacters": [],
  "createdAt": "2025-10-26T...",
  "updatedAt": "2025-10-26T..."
}
```

### Data Operations

- **Export**: Click "데이터 내보내기" to download JSON backup
- **Reset**: Clear all data and start fresh
- **Persist**: Data automatically saves after each action

## 🎭 Animation States

The robots support various animation states:

- **States**: Idle, Walking, Running, Dance, Sitting, Standing, Death
- **Emotes**: Jump, Yes, No, Wave, Punch, ThumbsUp

Characters randomly perform these animations when not selected.

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

**Note**: Requires WebGL support. Some older browsers or devices may not be compatible.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js team for the amazing 3D library
- GSAP team for the smooth animation framework
- Robot model from Three.js examples (RobotExpressive)

## 📧 Contact

siriz - [@siriz](https://github.com/siriz)

Project Link: [https://github.com/siriz/kujikuji](https://github.com/siriz/kujikuji)

---

Made with ❤️ and Three.js
