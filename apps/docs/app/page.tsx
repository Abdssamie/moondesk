import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Moondesk Documentation</h1>
          <p>
            Welcome to the official documentation for Moondesk, a scalable,
            protocol-agnostic IoT platform.
          </p>
        </header>

        <section id="overview" className={styles.section}>
          <h2>Project Overview</h2>
          <p>
            Moondesk is designed to handle high-throughput data ingestion,
            real-time analytics, and device management for IoT ecosystems.
          </p>
        </section>

        <section id="architecture" className={styles.section}>
          <h2>System Architecture</h2>
          <p>
            The system follows an event-driven microservices architecture. Below
            is a brief overview of the key components:
          </p>
          <ul>
            <li>
              <strong>Edge Devices</strong>: Simulate or real devices sending
              data via MQTT.
            </li>
            <li>
              <strong>Broker (Mosquitto)</strong>: Handles MQTT messsaging.
            </li>
            <li>
              <strong>Worker (MQTT Worker)</strong>: Subscribes to broker,
              processes ingestion, and broadcasts &quot;hot&quot; data to API.
            </li>
            <li>
              <strong>API (Fastify)</strong>: REST & WebSocket API for frontend
              clients. Handles command dispatching and real-time updates.
            </li>
            <li>
              <strong>Storage</strong>:
              <ul>
                <li>
                  <strong>TimescaleDB (PostgreSQL)</strong>: Time-series data
                  (sensor readings).
                </li>
                <li>
                  <strong>Redis</strong>: Caching, pub/sub for scaling
                  WebSockets, and short-term state.
                </li>
              </ul>
            </li>
            <li>
              <strong>Frontend (Next.js)</strong>: Dashboard for visualization
              and admin controls.
            </li>
          </ul>
        </section>

        <section id="repo-structure" className={styles.section}>
          <h2>Repository Structure</h2>
          <p>
            This is a Monorepo managed by <strong>Turbo</strong> and{" "}
            <strong>pnpm</strong> workspaces.
          </p>
          <h3>apps/</h3>
          <ul>
            <li>
              <strong>api</strong>: Fastify backend.
            </li>
            <li>
              <strong>mqtt-worker</strong>: Node.js worker for MQTT traffic.
            </li>
            <li>
              <strong>edge-simulator</strong>: Tool to generate synthetic load.
            </li>
            <li>
              <strong>moondesk-dash</strong>: Next.js frontend application.
            </li>
            <li>
              <strong>docs</strong>: This documentation site.
            </li>
          </ul>
          <h3>packages/</h3>
          <ul>
            <li>
              <strong>config</strong>: Shared configuration (env vars, schemas).
            </li>
            <li>
              <strong>database</strong>: Drizzle ORM schemas.
            </li>
            <li>
              <strong>domain</strong>: Shared interfaces, types, and Models.
            </li>
            <li>
              <strong>logger</strong>: Standardized Pino logger.
            </li>
            <li>
              <strong>ui</strong>: Shared React UI components.
            </li>
            <li>
              <strong>typescript-config</strong>: Shared `tsconfig.json` bases.
            </li>
          </ul>
        </section>

        <section id="tech-stack" className={styles.section}>
          <h2>Technology Stack</h2>
          <ul>
            <li>
              <strong>Runtime</strong>: Node.js (v20+), strictly TypeScript.
            </li>
            <li>
              <strong>Package Manager</strong>: pnpm (Corepack enabled).
            </li>
            <li>
              <strong>Build System</strong>: Turbo and tsup.
            </li>
            <li>
              <strong>Database</strong>: PostgreSQL with TimescaleDB.
            </li>
            <li>
              <strong>ORM</strong>: Drizzle ORM.
            </li>
            <li>
              <strong>Auth</strong>: Clerk and Internal Tokens.
            </li>
            <li>
              <strong>Infrastructure</strong>: Docker Compose.
            </li>
          </ul>
        </section>

        <section id="dev-philosophy" className={styles.section}>
          <h2>Development Philosophy</h2>
          <ol>
            <li>
              <strong>Strict Types</strong>: No `any` is allowed.
            </li>
            <li>
              <strong>Docker First</strong>: The entire backend stack runs in
              Docker.
            </li>
            <li>
              <strong>Branch Protection</strong>: `main` is protected. Work on
              `develop` or feature branches.
            </li>
            <li>
              <strong>Environment Variables</strong>: Validated with Zod.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
