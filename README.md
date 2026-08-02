<div align="center">

  <img src="docs/assets/Logo.png" alt="Tokyo Universal Downloader" width="150" />

  # 🌸 Tokyo Universal Downloader

  ### Download anything. Simply. ✨

  **Enganxa un enllaç i descarrega'l a l'instant.**

  <p>
    Una aplicació d'escriptori moderna, ràpida i minimalista per descarregar
    vídeos i àudio des de la web, amb una interfície inspirada en Tokyo,
    animacions suaus i una experiència pensada perquè qualsevol persona
    la pugui utilitzar sense complicacions.
  </p>

  <p>
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg?logo=tauri" alt="Tauri 2" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Rust-stable-000000.svg?logo=rust" alt="Rust" />
    <img src="https://img.shields.io/badge/tests-131%20passing-brightgreen.svg" alt="131 tests passing" />
  </p>

</div>

---

## 🌸 Preview

<div align="center">

<img src="docs/assets/12.PNG" alt="Tokyo Universal Downloader — Main Interface" width="900" />

</div>

> ✨ Una interfície visual, interactiva i pensada perquè descarregar contingut sigui tan senzill com enganxar un enllaç.

---

# ⚡ Prova'l ara

No vols configurar res ni entrar en el codi?

### 🪟 Windows

Ves a la secció de **Releases** del repositori i descarrega directament el fitxer `.exe`.

**No necessites obrir una terminal per utilitzar l'aplicació.**

1. Descarrega el `.exe`.
2. Obre'l.
3. Instal·la l'aplicació.
4. Obre **Tokyo Universal Downloader**.
5. Enganxa un enllaç.
6. Prem descarregar.
7. ✨ Fet.

> 💡 Per provar l'aplicació ràpidament, utilitza directament l'`.exe` inclòs en el projecte/release.

---

# 🎀 Com funciona?

<div align="center">

<img src="docs/assets/comfunciona.png" alt="Com funciona Tokyo Universal Downloader" width="900" />

</div>

Tokyo Universal Downloader està dissenyat amb una idea molt simple:

> **Enganxa → Analitza → Tria → Descarrega.**

No cal conèixer yt-dlp, FFmpeg, terminals ni com funcionen els formats de vídeo.

## 1. 🔗 Enganxa l'enllaç

Copia l'enllaç del vídeo o àudio que vols descarregar i enganxa'l al camp principal.

L'aplicació detecta automàticament l'enllaç i comença a analitzar-lo.

---

## 2. 🔎 L'aplicació analitza el contingut

Tokyo Universal Downloader utilitza `yt-dlp` per obtenir la informació disponible.

Pot detectar:

- 🎬 Títol
- 👤 Creador / canal
- ⏱️ Duració
- 🖼️ Miniatura
- 🎞️ Formats disponibles
- 🔊 Formats d'àudio
- 📺 Qualitats disponibles
- 💬 Subtítols disponibles
- 📦 Informació necessària per descarregar

Això permet saber què estàs descarregant abans de començar.

---

## 3. 🎚️ Escull com el vols descarregar

Pots deixar que l'aplicació seleccioni automàticament la millor opció o personalitzar la descàrrega.

Entre les opcions disponibles hi ha:

- ⭐ Automàtic
- 🎥 Vídeo
- 🎵 Àudio
- 💎 Qualitat
- 📦 Format
- 💬 Subtítols
- ⚙️ Opcions avançades

La idea és que la configuració avançada només sigui necessària quan realment la necessites.

---

## 4. 🚀 Comença la descàrrega

Quan tot estigui preparat, inicia la descàrrega.

L'aplicació mostra en temps real:

- 📊 Percentatge
- ⚡ Velocitat
- ⏳ Temps estimat
- 📥 Estat
- 🔄 Fase actual
- 📝 Informació del procés

No cal mirar cap terminal.

Tot passa directament dins de la interfície.

---

## 5. ✨ Quan acaba

Quan la descàrrega finalitza, pots:

- 📂 Obrir la carpeta
- ▶️ Obrir el fitxer
- 🔎 Consultar la descàrrega
- 🗑️ Gestionar-la des de l'historial

Les descàrregues completades també poden quedar registrades a l'historial.

---

# 💗 Per què Tokyo Universal Downloader?

Perquè descarregar un vídeo **no hauria de ser complicat**.

No volem una aplicació plena de menús, configuracions impossibles i terminals.

Volem:

> **Enganxa un enllaç.  
> Prem un botó.  
> Gaudeix del resultat. 🌸**

---

# ✨ Característiques

### 🔗 Paste & Download

Enganxa un enllaç i comença.

### 🎬 Vídeo

Descarrega vídeo en les qualitats i formats disponibles.

### 🎵 Àudio

Extreu només l'àudio quan no necessites el vídeo.

### 💎 Qualitat

Selecciona presets de qualitat o deixa que l'aplicació triï automàticament.

### 📦 Formats

Tria el format que necessitis segons les opcions disponibles.

### 💬 Subtítols

Permet treballar amb subtítols disponibles, incloent-hi subtítols generats automàticament.

### 📥 Cua de descàrregues

Gestiona diverses descàrregues sense haver de controlar-les manualment.

### 📊 Progrés en temps real

Visualitza percentatge, velocitat, ETA i fase de la descàrrega.

### ⏸️ Control de descàrrega

Pots gestionar les descàrregues amb opcions com:

- Pausar
- Reprendre
- Cancel·lar
- Reintentar

### 🔄 Retry automàtic

Les errades temporals poden gestionar-se amb reintents automàtics i backoff.

### 🕘 Historial

Consulta les descàrregues anteriors des de l'historial.

### 🖱️ Drag & Drop

Arrossega enllaços directament a l'aplicació.

### 📋 Clipboard

Opcionalment pot detectar enllaços copiats al porta-retalls.

### 🔔 Notificacions

Rep notificacions d'escriptori quan una descàrrega finalitza o falla.

### 🖥️ System Tray

Integració amb la safata del sistema.

### 🚀 Start at Login

Opció per iniciar l'aplicació amb el sistema.

### 🌙 Minimize to Tray

Mantén l'aplicació funcionant discretament a la safata.

### 🔧 Diagnostics

Consulta versions detectades de `yt-dlp` i `ffmpeg` i revisa informació de diagnòstic.

### 🎨 UI moderna

Interfície inspirada en Tokyo amb:

- 🌸 Sakura
- ✨ Animacions
- 💗 Gradients
- 🔮 Glassmorphism
- 🌙 Dark mode
- 🖱️ Microinteraccions
- ⚡ Transicions
- 🎀 Components interactius

---

# 🖼️ Interface

<div align="center">

<img src="docs/assets/14.PNG" alt="Tokyo Universal Downloader Interface" width="900" />

</div>

La interfície està pensada per donar protagonisme a una única acció:

## 🔗 Enganxa l'enllaç.

Tot el necessari està organitzat al voltant d'aquest flux perquè no hagis d'anar saltant entre menús.

---

# 🧠 Arquitectura

```text
Tokyo Universal Downloader
│
├── React + TypeScript
│   ├── App Shell
│   ├── Downloads
│   ├── Metadata
│   ├── Settings
│   ├── History
│   ├── Advanced Options
│   └── Desktop Integration
│
├── Zustand
│   └── Application State
│
├── Framer Motion
│   └── Animations & Transitions
│
├── Tauri 2
│   └── Desktop Runtime
│
└── Rust
    ├── Download Commands
    ├── yt-dlp Integration
    ├── FFmpeg Integration
    ├── Diagnostics
    ├── Tray
    └── File Management
