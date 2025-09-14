# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KR-CODE 지능형 가이드 (Railway Regulations Chatbot) is an AI-powered chatbot for searching Korean railway construction regulations, built for a national railway regulation improvement contest. The project uses Claude API to provide natural language search capabilities for railway regulations.

## Development Commands

### Installation
```bash
# Install all dependencies (root, server, and client)
npm install
cd server && npm install
cd ../client && npm install

# Or use the root package.json script (if available)
npm run install
```

### Development
```bash
# Run both server and client in development mode
npm run dev

# Run server only (from root)
cd server && npm run dev

# Run client only (from root)
npm run start
# or
cd client && npm start
```

### Testing
```bash
# Run Playwright tests
npm test
npm run test:headed  # Run with browser UI
npm run test:ui      # Run with Playwright UI
npm run test:report  # Show test report
```

### Build
```bash
# Build client for production
npm run build
# This builds the client and copies server files to api/ directory for Vercel deployment
```

## Architecture

### Monorepo Structure
```
railway-regulations-chatbot/
├── client/          # React frontend (TypeScript)
├── server/          # Express backend (Node.js)
├── api/            # Vercel serverless functions (auto-generated from server/)
├── tests/          # Playwright end-to-end tests
└── data/           # Mock regulation data (JSON)
```

### Backend (server/)
- **Express.js** server with middleware for security (Helmet), CORS, rate limiting
- **Claude API integration** via @anthropic-ai/sdk for natural language processing
- **Modular route structure**: `/api/chat` and `/api/regulations`
- **Environment variables**: Requires `ANTHROPIC_API_KEY` in server/.env
- **Mock data**: Uses JSON files for regulations and categories (no database)

### Frontend (client/)
- **React 19 + TypeScript** with functional components and hooks
- **Styled Components** for CSS-in-JS styling with a railway-themed design system
- **React Router** for navigation between Chat, Regulations Browser, and About pages
- **Axios** for API communication with the backend
- **Responsive design** with mobile-first approach

### Key API Endpoints
- `POST /api/chat/message` - Send chat message to Claude AI
- `GET /api/chat/faq` - Get frequently asked questions
- `GET /api/regulations` - Get all regulations or search with query param
- `GET /api/regulations/categories/list` - Get regulation categories
- `GET /api/health` - Health check endpoint

### Data Models
The application uses JSON-based mock data with two main structures:
- **Regulations**: Contains regulation details with categories, content, legal basis, keywords
- **Categories**: 8 main railway regulation categories (노반편, 궤도편, 전력편, etc.)

## Environment Configuration

### Required Environment Variables
Create `server/.env` with:
```env
ANTHROPIC_API_KEY=your_claude_api_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Port Configuration
- Frontend: http://localhost:3000 (React dev server)
- Backend: http://localhost:5000 (Express server)

## Development Notes

### Claude API Integration
- Uses Anthropic's Claude API for intelligent regulation search
- Implements conversation context management with session IDs
- Includes confidence scoring and related regulation suggestions
- Rate limited to prevent API abuse (100 requests per 15 minutes)

### Security Features
- Helmet middleware for security headers
- CORS configured for localhost development and production domains
- Rate limiting per IP address
- Input validation and XSS prevention

### Error Handling
- Comprehensive error handling with user-friendly messages
- Development vs production error detail levels
- Logging for debugging and monitoring

### Deployment
The project is configured for Vercel deployment:
- Build process copies server files to api/ directory
- Serverless functions created for each API endpoint
- Environment variables configured in Vercel dashboard

## Common Development Tasks

### Adding New Regulations
1. Edit `data/regulations.json` to add new regulation entries
2. Update categories in `data/categories.json` if needed
3. Test with chat interface to verify AI can find and reference new data

### Modifying API Endpoints
1. Server-side routes are in `server/routes/` directory
2. Update corresponding API client methods in `client/src/services/api.ts`
3. Test endpoints with both development server and Vercel deployment

### Styling Changes
1. Global styles are in `client/src/styles/GlobalStyle.ts`
2. Component styles use Styled Components with consistent theme
3. Design system includes railway-themed colors (blues and purples)

### Testing
- Playwright tests cover end-to-end user flows
- Tests run against both local development and deployed versions
- Test configuration supports multiple browsers and devices

This is a full-stack TypeScript/JavaScript project with a focus on AI-powered search and user experience optimization.