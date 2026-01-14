CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'unknown' NOT NULL,
	"last_seen" timestamp with time zone,
	"description" text,
	"manufacturer" text,
	"model_number" text,
	"installation_date" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensors" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"parameter" text DEFAULT 'none' NOT NULL,
	"unit" text NOT NULL,
	"threshold_low" double precision,
	"threshold_high" double precision,
	"min_value" double precision,
	"max_value" double precision,
	"sampling_interval_ms" integer DEFAULT 1000 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"protocol" text DEFAULT 'mqtt' NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"sensor_id" integer NOT NULL,
	"organization_id" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"value" double precision NOT NULL,
	"parameter" text DEFAULT 'none' NOT NULL,
	"protocol" text DEFAULT 'mqtt' NOT NULL,
	"quality" text DEFAULT 'good' NOT NULL,
	"notes" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "readings_sensor_id_timestamp_pk" PRIMARY KEY("sensor_id","timestamp")
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"organization_id" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"trigger_value" double precision NOT NULL,
	"threshold_value" double precision,
	"acknowledged" boolean DEFAULT false NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"acknowledged_by" text,
	"notes" text,
	"protocol" text DEFAULT 'mqtt' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"parameters" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"protocol" text DEFAULT 'mqtt' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_memberships_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"image_url" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "connection_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"protocol" text NOT NULL,
	"endpoint_uri" text NOT NULL,
	"username" text NOT NULL,
	"encrypted_password" text NOT NULL,
	"encryption_iv" text NOT NULL,
	"client_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commands" ADD CONSTRAINT "commands_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_assets_organization_id" ON "assets" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_assets_status" ON "assets" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "idx_sensors_asset_id" ON "sensors" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_readings_org_sensor_time" ON "readings" USING btree ("organization_id","sensor_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_readings_org_time" ON "readings" USING btree ("organization_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_alerts_org_acknowledged_time" ON "alerts" USING btree ("organization_id","acknowledged","timestamp");--> statement-breakpoint
CREATE INDEX "idx_alerts_org_sensor" ON "alerts" USING btree ("organization_id","sensor_id");--> statement-breakpoint
CREATE INDEX "idx_commands_org_status_time" ON "commands" USING btree ("organization_id","status","created_at");--> statement-breakpoint
CREATE INDEX "idx_commands_org_user" ON "commands" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_organizations_owner" ON "organizations" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_credentials_org_protocol" ON "connection_credentials" USING btree ("organization_id","protocol");--> statement-breakpoint
CREATE INDEX "idx_credentials_org_active" ON "connection_credentials" USING btree ("organization_id","is_active");