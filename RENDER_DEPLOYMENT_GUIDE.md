# Frontend Render Deployment Guide

This guide will help you deploy the StudentHub Frontend application to Render as a Web Service.

## 1. Prerequisites

- Push your code to GitHub
- Have a Render account
- Backend API deployed and accessible

## 2. Configuration

The frontend uses environment variables to connect to the backend API. The configuration is already set up in:

- `package.json` - includes the `serve` package and `serve` script
- `.env.example` - example environment variable configuration

## 3. Setting up Render Environment Variables

When creating your Web Service on Render, configure the following environment variable:

### Required Environment Variables:

- `REACT_APP_API_URL` - Your backend API URL (e.g., `https://your-backend.onrender.com`)

**Example:**
```
REACT_APP_API_URL=https://studenthub-backend.onrender.com
```

## 4. Build & Start Commands

Configure your Render Web Service with:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run serve`

## 5. Deployment Steps

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository (StudentHubApplication-Frontend)
4. Configure the service:
   - **Name**: studenthub-frontend (or your preferred name)
   - **Branch**: testing_main_branch (or main)
   - **Root Directory**: Leave empty if deploying from repo root
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run serve`
5. Add Environment Variables:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL (e.g., `https://studenthub-backend.onrender.com`)
6. Click "Create Web Service"

## 6. Post-Deployment

After deployment:
1. Note your frontend URL (e.g., `https://studenthub-frontend.onrender.com`)
2. Update your backend's `CORS_ALLOWED_ORIGINS` environment variable to include this URL
3. Test the connection between frontend and backend

## 7. Troubleshooting

- **API connection issues**: Verify `REACT_APP_API_URL` is set correctly
- **CORS errors**: Ensure backend's `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Build failures**: Check that all dependencies are in `dependencies` (not `devDependencies`) for production builds
