# ==============================================================================
# STAGE 1: Build React Frontend (Vite)
# ==============================================================================
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

# Optional build arguments for Frontend (if passed at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL=/api

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL

# Copy package manifests and install dependencies
COPY frontend/package*.json ./
RUN npm ci || npm install

# Copy frontend source code and build production bundle
COPY frontend/ ./
RUN npm run build

# ==============================================================================
# STAGE 2: Build ASP.NET Core 8.0 Web API Backend
# ==============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend
WORKDIR /src

# Copy csproj and restore NuGet dependencies
COPY backend/MYFITDAILY_EXE201_Group6.csproj ./backend/
RUN dotnet restore "backend/MYFITDAILY_EXE201_Group6.csproj"

# Copy backend source code and publish
COPY backend/ ./backend/
WORKDIR /src/backend
RUN dotnet publish "MYFITDAILY_EXE201_Group6.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==============================================================================
# STAGE 3: Final Production Runtime (Fullstack Container)
# ==============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published .NET application
COPY --from=build-backend /app/publish .

# Copy Frontend production assets directly into ASP.NET Core wwwroot
COPY --from=build-frontend /app/frontend/dist ./wwwroot

# Render supplies PORT environment variable (defaults to 10000 on Render, or 8080)
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MYFITDAILY_EXE201_Group6.dll"]
