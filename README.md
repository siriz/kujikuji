# 🎲 KUJIKUJI - Interactive 3D Lottery

An interactive 3D lottery application built with Three.js and GSAP, featuring animated robot characters with smooth camera transitions and dramatic lighting effects.

![KUJIKUJI Demo](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- **14 Animated Robot Characters** - Each with unique positions and random animations
- **Smooth 3D Transitions** - Camera movements powered by GSAP for cinematic effects
- **Dynamic Lighting** - Spotlight effects that focus on selected characters
- **Interactive Selection** - Click to randomly select a character with dramatic reveal
- **Character Animations** - Multiple animation states including idle, walking, dancing, and emotes
- **Name Tag System** - Flipping name cards with index numbers and custom names
- **Responsive Design** - Works across different screen sizes
- **Auto-Rotation** - Camera automatically rotates for a dynamic view

## 🎮 How to Use

1. **Initial View**: When you load the page, you'll see all 14 robot characters arranged on a platform with an auto-rotating camera.

2. **Select a Character**: Click the "GO" button at the bottom of the screen to randomly select a character.

3. **Character Reveal**: 
   - The camera zooms in on the selected character
   - Background darkens with a spotlight on the winner
   - Character performs random emotes
   - Name card flips to reveal the character's name
   - Character gives a thumbs up

4. **Return to Overview**: Click the "RETURN" button to go back to the full view and select again.

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebGL support
- Local web server (or use the simple method below)

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
├── index.html          # Main HTML file with embedded JavaScript
├── main.css           # Stylesheet for UI elements
├── build/             # Three.js library files
│   └── three.module.js
├── jsm/               # Three.js addons and utilities
│   ├── controls/
│   ├── loaders/
│   ├── geometries/
│   └── libs/
├── models/            # 3D model files
│   └── gltf/
│       └── RobotExpressive/
└── fonts/             # Font files for 3D text
    └── optimer_bold.typeface.json
```

## 🛠️ Technologies Used

- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[GSAP](https://greensock.com/gsap/)** - Animation library for smooth transitions
- **[GLTF](https://www.khronos.org/gltf/)** - 3D model format
- **WebGL** - Hardware-accelerated 3D rendering
- **OrbitControls** - Camera controls for user interaction

## 🎨 Customization

### Changing Character Names

Edit the `nameList` array in `index.html`:

```javascript
const nameList = [
    'NAME1',
    'NAME2',
    // ... add your names
];
```

### Adjusting Character Positions

Modify the `initPos` array to change character positions and rotations:

```javascript
const initPos = [
    {x: 0, z: 0, rot: 0},    // x, z: position, rot: rotation in degrees
    {x: 10, z: -20, rot: 45},
    // ...
];
```

### Adding More Characters

1. Add more entries to both `initPos` and `nameList` arrays
2. The application will automatically load the additional characters

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
