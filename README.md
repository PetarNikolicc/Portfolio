# Petar's Portfolio

A portfolio website built with React, TypeScript, and Tailwind CSS.

##  Technologies

- **Vite** - Fast build tool and dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/PetarNikolicc/petar-s-portfolio.git

# Navigate to project directory
cd petar-s-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

##  Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite and configure build settings
6. Click "Deploy"

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the `dist` folder to deploy
4. Or connect your GitHub repo for automatic deployments

### Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to `package.json`:
   ```json
   "homepage": "https://PetarNikolicc.github.io/petar-s-portfolio",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

## Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Author

**Petar Nikolić**

---

Built by Petar
