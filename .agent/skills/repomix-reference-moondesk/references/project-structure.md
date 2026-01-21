# Directory Structure

```
.github/
  workflows/
    ci.yml (41 lines)
.husky/
  commit-msg (19 lines)
  pre-commit (15 lines)
  pre-push (11 lines)
apps/
  docs/
    app/
      globals.css (50 lines)
      layout.tsx (31 lines)
      page.module.css (82 lines)
      page.tsx (161 lines)
    public/
      file-text.svg (3 lines)
      globe.svg (10 lines)
      next.svg (1 lines)
      turborepo-dark.svg (19 lines)
      turborepo-light.svg (19 lines)
      vercel.svg (10 lines)
      window.svg (3 lines)
    .gitignore (36 lines)
    eslint.config.js (4 lines)
    next.config.js (4 lines)
    package.json (28 lines)
    README.md (36 lines)
    tsconfig.json (20 lines)
  edge-simulator/
    src/
      __tests__/
        generators.test.ts (91 lines)
        presets.test.ts (35 lines)
      generators.ts (78 lines)
      main.ts (93 lines)
      mqtt-publisher.ts (60 lines)
      presets.ts (72 lines)
      simulation-engine.ts (93 lines)
      types.ts (42 lines)
    Dockerfile (33 lines)
    eslint.config.mjs (3 lines)
    package.json (30 lines)
    tsconfig.json (14 lines)
    tsup.config.ts (13 lines)
  moondesk-dash/
    .husky/
      pre-commit (3 lines)
    src/
      app/
        (external)/
          page.tsx (77 lines)
        (main)/
          auth/
            _components/
              social-auth/
                google-button.tsx (35 lines)
              login-form.tsx (122 lines)
              register-form.tsx (162 lines)
            v1/
              login/
                page.tsx (53 lines)
              register/
                page.tsx (53 lines)
            v2/
              login/
                page.tsx (53 lines)
              register/
                page.tsx (53 lines)
              layout.tsx (37 lines)
          dashboard/
            _components/
              sidebar/
                account-switcher.tsx (81 lines)
                app-sidebar.tsx (45 lines)
                clerk-auth.tsx (54 lines)
                layout-controls.tsx (191 lines)
                nav-documents.tsx (83 lines)
                nav-main.tsx (223 lines)
                nav-secondary.tsx (43 lines)
                nav-user-clerk.tsx (95 lines)
                nav-user.tsx (92 lines)
                search-dialog.tsx (79 lines)
                theme-switcher.tsx (26 lines)
            [...not-found]/
              page.tsx (10 lines)
            analytics/
              _components/
                data-usage.tsx (58 lines)
                energy-consumption.tsx (43 lines)
                performance-metrics.tsx (53 lines)
                system-health.tsx (62 lines)
              page.tsx (24 lines)
            assets/
              _components/
                asset-insight-cards.tsx (92 lines)
              [assetId]/
                page.tsx (8 lines)
              page.tsx (31 lines)
            coming-soon/
              page.tsx (8 lines)
            overview/
              _components/
                chart-area-interactive.tsx (146 lines)
                columns.tsx (133 lines)
                data-table.tsx (85 lines)
                schema.ts (23 lines)
                section-cards.tsx (42 lines)
                table-cell-viewer.tsx (185 lines)
              page.tsx (49 lines)
            layout.tsx (82 lines)
            page.tsx (3 lines)
          unauthorized/
            page.tsx (27 lines)
        organization/
          [[...organization]]/
            page.tsx (9 lines)
        sentry-example-page/
          page.tsx (219 lines)
        sso-callback/
          page.tsx (5 lines)
        global-error.tsx (25 lines)
        globals.css (172 lines)
        layout.tsx (49 lines)
        not-found.tsx (17 lines)
      components/
        data-table/
          data-table-column-header.tsx (69 lines)
          data-table-pagination.tsx (88 lines)
          data-table-view-options.tsx (50 lines)
          data-table.tsx (125 lines)
          drag-column.tsx (32 lines)
          draggable-row.tsx (27 lines)
          table-utils.ts (7 lines)
        providers/
          query-provider.tsx (20 lines)
        ui/
          accordion.tsx (53 lines)
          alert-dialog.tsx (113 lines)
          alert.tsx (49 lines)
          aspect-ratio.tsx (9 lines)
          avatar.tsx (34 lines)
          badge.tsx (36 lines)
          breadcrumb.tsx (92 lines)
          button-group.tsx (75 lines)
          button.tsx (52 lines)
          calendar.tsx (161 lines)
          card.tsx (56 lines)
          carousel.tsx (216 lines)
          chart.tsx (298 lines)
          checkbox.tsx (29 lines)
          collapsible.tsx (17 lines)
          command.tsx (137 lines)
          context-menu.tsx (211 lines)
          dialog.tsx (123 lines)
          drawer.tsx (108 lines)
          dropdown-menu.tsx (219 lines)
          empty.tsx (85 lines)
          field.tsx (226 lines)
          form.tsx (138 lines)
          hover-card.tsx (38 lines)
          input-group.tsx (149 lines)
          input-otp.tsx (68 lines)
          input.tsx (21 lines)
          item.tsx (158 lines)
          kbd.tsx (22 lines)
          label.tsx (21 lines)
          menubar.tsx (236 lines)
          navigation-menu.tsx (142 lines)
          pagination.tsx (100 lines)
          popover.tsx (42 lines)
          progress.tsx (24 lines)
          radio-group.tsx (33 lines)
          resizable.tsx (48 lines)
          scroll-area.tsx (48 lines)
          select.tsx (162 lines)
          separator.tsx (28 lines)
          sheet.tsx (103 lines)
          sidebar.tsx (677 lines)
          skeleton.tsx (7 lines)
          slider.tsx (56 lines)
          sonner.tsx (34 lines)
          spinner.tsx (9 lines)
          switch.tsx (28 lines)
          table.tsx (75 lines)
          tabs.tsx (42 lines)
          textarea.tsx (18 lines)
          toggle-group.tsx (80 lines)
          toggle.tsx (41 lines)
          tooltip.tsx (48 lines)
        simple-icon.tsx (30 lines)
      hooks/
        __tests__/
          use-signalr.test.ts (41 lines)
        use-data-table-instance.ts (69 lines)
        use-mobile.ts (19 lines)
        use-signalr.ts (45 lines)
      lib/
        adapters/
          __tests__/
            dashboard-adapter.test.ts (44 lines)
          dashboard-adapter.ts (235 lines)
        mock-data/
          iot-data.ts (350 lines)
        layout-utils.ts (13 lines)
        theme-utils.ts (12 lines)
        utils.ts (42 lines)
      navigation/
        sidebar/
          sidebar-items.ts (103 lines)
      scripts/
        generate-theme-presets.ts (127 lines)
      server/
        server-actions.ts (27 lines)
      services/
        api-client.ts (78 lines)
        device-service.ts (0 lines)
      stores/
        preferences/
          preferences-provider.tsx (31 lines)
          preferences-store.ts (18 lines)
      styles/
        presets/
          brutalist.css (89 lines)
          soft-pop.css (89 lines)
          tangerine.css (89 lines)
        clerk-custom.css (0 lines)
      test/
        setup.ts (14 lines)
        utils.tsx (21 lines)
      types/
        preferences/
          layout.ts (32 lines)
          theme.ts (57 lines)
        iot.ts (78 lines)
      config.ts (14 lines)
      instrumentation-client.ts (20 lines)
      instrumentation.ts (13 lines)
      proxy.disabled.ts (25 lines)
      proxy.ts (25 lines)
    .env.local.example (14 lines)
    .gitignore (40 lines)
    .prettierignore (12 lines)
    .prettierrc (9 lines)
    CLERK_AUTH_INTEGRATION.md (136 lines)
    CLERK_SETUP.md (84 lines)
    components.json (22 lines)
    CONTRIBUTING.md (130 lines)
    eslint.config.mjs (163 lines)
    IIOT_DASHBOARD_SPEC.md (522 lines)
    LICENSE (21 lines)
    next.config.mjs (50 lines)
    package.json (93 lines)
    postcss.config.mjs (8 lines)
    README.md (108 lines)
    sentry.edge.config.ts (20 lines)
    sentry.server.config.ts (19 lines)
    tsconfig.json (27 lines)
    vitest.config.ts (17 lines)
  mqtt-worker/
    src/
      api-broadcaster.test.ts (136 lines)
      api-broadcaster.ts (117 lines)
      index.ts (71 lines)
      ingestion-handler.test.ts (78 lines)
      ingestion-handler.ts (309 lines)
      mqtt-client.ts (152 lines)
      parser.ts (114 lines)
    Dockerfile (33 lines)
    eslint.config.mjs (3 lines)
    package.json (32 lines)
    tsconfig.json (14 lines)
    tsup.config.ts (13 lines)
docker/
  mosquitto/
    config/
      mosquitto.conf (10 lines)
packages/
  config/
    src/
      app.ts (40 lines)
      database.ts (17 lines)
      env.ts (66 lines)
      index.ts (6 lines)
      mqtt.ts (20 lines)
    eslint.config.mjs (4 lines)
    package.json (29 lines)
    README.md (56 lines)
    tsconfig.json (14 lines)
  database/
    src/
      migrations/
        meta/
          _journal.json (13 lines)
          0000_snapshot.json (1164 lines)
        0000_tranquil_shotgun.sql (150 lines)
      repositories/
        alert.repository.ts (297 lines)
        asset.repository.ts (146 lines)
        command.repository.ts (142 lines)
        connection-credential.repository.ts (199 lines)
        index.ts (29 lines)
        organization.repository.ts (192 lines)
        reading.repository.ts (200 lines)
        sensor.repository.ts (186 lines)
        user.repository.ts (80 lines)
      schema/
        alerts.ts (61 lines)
        assets.ts (51 lines)
        commands.ts (60 lines)
        connection-credentials.ts (50 lines)
        index.ts (9 lines)
        organizations.ts (81 lines)
        readings.ts (59 lines)
        sensors.ts (65 lines)
        users.ts (35 lines)
      client.ts (58 lines)
      index.ts (10 lines)
    drizzle.config.ts (12 lines)
    eslint.config.mjs (4 lines)
    package.json (44 lines)
    tsconfig.json (14 lines)
  domain/
    src/
      enums/
        alert-severity.ts (11 lines)
        asset-status.ts (12 lines)
        command-status.ts (13 lines)
        index.ts (9 lines)
        parameter.ts (31 lines)
        protocol.ts (12 lines)
        reading-quality.ts (12 lines)
        sensor-type.ts (34 lines)
        user-role.ts (10 lines)
      errors/
        index.ts (66 lines)
      interfaces/
        repositories/
          alert.repository.ts (51 lines)
          asset.repository.ts (49 lines)
          command.repository.ts (44 lines)
          connection-credential.repository.ts (56 lines)
          index.ts (12 lines)
          organization.repository.ts (63 lines)
          reading.repository.ts (55 lines)
          sensor.repository.ts (55 lines)
          user.repository.ts (26 lines)
        services/
          encryption.service.ts (15 lines)
          index.ts (3 lines)
          notification.service.ts (26 lines)
        index.ts (3 lines)
      models/
        alert.ts (83 lines)
        asset.ts (54 lines)
        command.ts (46 lines)
        connection-credential.ts (47 lines)
        index.ts (41 lines)
        organization.ts (52 lines)
        reading.ts (75 lines)
        sensor.ts (75 lines)
        user.ts (30 lines)
      schemas/
        index.ts (108 lines)
      index.ts (17 lines)
    eslint.config.mjs (4 lines)
    package.json (40 lines)
    tsconfig.json (14 lines)
  eslint-config/
    base.js (32 lines)
    next.js (57 lines)
    package.json (24 lines)
    react-internal.js (39 lines)
    README.md (3 lines)
  logger/
    src/
      index.ts (47 lines)
    eslint.config.mjs (4 lines)
    package.json (29 lines)
    tsconfig.json (14 lines)
  typescript-config/
    base.json (23 lines)
    nextjs.json (12 lines)
    package.json (9 lines)
    react-library.json (7 lines)
  ui/
    src/
      button.tsx (17 lines)
      card.tsx (26 lines)
      code.tsx (14 lines)
    eslint.config.mjs (4 lines)
    package.json (26 lines)
    tsconfig.json (13 lines)
.env.example (40 lines)
.gitignore (62 lines)
AGENTS.md (110 lines)
docker-compose.yml (112 lines)
package.json (24 lines)
pnpm-workspace.yaml (3 lines)
README.md (81 lines)
repomix-output.1.xml (15964 lines)
repomix-output.2.xml (6291 lines)
turbo.json (47 lines)
```