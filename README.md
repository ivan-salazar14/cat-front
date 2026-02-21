# Cat Front - Angular Application

app frontend from cat services, built with **Angular 21**.

By Ivan Salazar

## 🚀 Requisitos previos

* [Node.js](https://nodejs.org/) (version 20 or higher recommended)
* [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)
* Docker (optional, for deployment/local production tests)

## 🛠️ Installation

1. Clone the repository.
2. Navigate to the root folder of the project.
3. Install the dependencies:

    ```bash
    npm install
    ```

## 💻 Local Development

Run the development server:

```bash
npm run start
```

The application will be available at `http://localhost:4200/`.

> **Note:** The project is configured with a proxy (`proxy.conf.json`) to redirect requests to `/api` to `http://localhost:3000` (the backend) automatically during development.

## 🐳 Docker (Simulate Production)

If you want to test the application as it would be deployed (using Nginx):

1. **Build the image:**

    ```bash
    docker build -t cat-front .
    ```

2. **Run the container:**

    ```bash
    docker run -p 8080:80 cat-front
    ```

    The application will be available at `http://localhost:8080/`.

> **Backend Configuration in Docker:** The `nginx.conf` file is configured to look for the backend at `http://host.docker.internal:3000`. Make sure your backend is running outside Docker or configured to be accessible.

## 🧪 Tests

To run the unit tests:

```bash
npm run test
```

## 🚀 CI/CD (GitHub Actions)

The project has an automated pipeline in `.github/workflows/ci.yml` that:

1. Installs dependencies.
2. Builds the production image.
3. Publishes the image to **GitHub Container Registry (GHCR)**.

The published images follow the format: `ghcr.io/tu-usuario/cat-front:latest`.
