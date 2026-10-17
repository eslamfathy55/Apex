# TURBO APEX PRO MAX

A high-performance 3D Formula racing simulator built with React, TypeScript, and Three.js.

## Features

- **3D Track & Environment**: Catmull-Rom spline circuit with alternating curb kerbs, start/finish line, surrounding trees, sponsor barriers, and realistic directional lighting with soft shadows.
- **Dynamic Physics & Racing Dynamics**:
  - Realistic acceleration, progressive braking, and centripetal steering.
  - Drag Reduction System (DRS) providing speed and RPM boosts with visual alerts.
  - Dynamic AI rival cars with individual lines and competitive pacing.
  - Multiple camera angles: Chase Camera, Cockpit / Helmet View, and Dynamic Action Chase.
- **Procedural Engine Audio Synthesizer**: Authentic Web Audio API sound synthesizer producing pitch-shifting Formula 1 engine whine, rev limiter, turbo whistle on DRS, and tyre screeches on hard braking.
- **Game Modes**:
  - **Quick Race**: Jump straight into the action with 3 laps and instant competitive pacing.
  - **Career Mode**: Race for the championship, earn career points (+100 PTS per win), and climb the leaderboards.
- **Weather Conditions**:
  - **Clear Track**: Standard tyre grip with maximum 324 KM/H top speed.
  - **Rain Track**: Overcast atmosphere, active 3D rain particle effects, wet asphalt, reduced traction, and challenging handling (max 263 KM/H).
- **Livery / Garage Customization**: Choose your car color (Scuderia Red, Stealth Black, Electric Cyan, Championship Gold, Apex Violet, British Racing Green, Silver Arrow).
- **Telemetry HUD**: Real-time KM/H speedometer, animated RPM gauge, position tracking (P 01 / 08), lap counter, and DRS indicator.
- **Multi-Platform Controls**: Full keyboard navigation (WASD / Arrows, Space, C, Esc) and multi-touch on-screen pedal & steering controls for mobile and tablet devices.

## Running the App

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Created by **Eslam Fathy**.