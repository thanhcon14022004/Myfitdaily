# ==============================================================================
# Backend Only Dockerfile (ASP.NET Core 8.0)
# ==============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["MYFITDAILY_EXE201_Group6.csproj", "./"]
RUN dotnet restore "MYFITDAILY_EXE201_Group6.csproj"

COPY . .
RUN dotnet publish "MYFITDAILY_EXE201_Group6.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MYFITDAILY_EXE201_Group6.dll"]
