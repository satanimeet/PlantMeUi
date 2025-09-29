# PlantMe - AI Plant Disease Detection Chatbot

A modern React-based web application that helps users identify plant diseases through image uploads and voice/text interactions. Built with React Router v7, TypeScript, and Tailwind CSS.

## Features

- 🌱 **Plant Disease Detection**: Upload images to identify plant diseases
- 🎤 **Voice Interaction**: Record voice messages for natural conversation
- 💬 **Text Chat**: Type messages to get plant care advice
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Session Management**: Maintains conversation history

## Tech Stack

- **Frontend**: React 19, React Router v7, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend Integration**: FastAPI (external service)

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker (optional, for containerized deployment)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/satanimeet/PlantMeUi.git
cd PlantMeUi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t plantme-app .
```

2. Run the container:
```bash
docker run -p 3000:3000 plantme-app
```

Or use Docker Compose:
```bash
docker-compose up -d
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
my-app/
├── app/
│   ├── components/
│   │   └── Chatbot.tsx          # Main chatbot component
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Theme management
│   ├── routes/
│   │   ├── api.chat.ts          # Chat API endpoint
│   │   ├── api.upload.ts        # Image upload endpoint
│   │   └── home.tsx             # Home page
│   ├── types/
│   │   └── chatbot.ts           # TypeScript type definitions
│   └── welcome/                 # Welcome page assets
├── public/                      # Static assets
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose configuration
└── package.json
```

## API Endpoints

- `POST /api/chat` - Handle text and voice messages
- `POST /api/upload` - Handle image uploads for disease detection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React Router v7](https://reactrouter.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Plant disease detection powered by AI/ML backend

## Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

Made with ❤️ for plant lovers everywhere 🌱