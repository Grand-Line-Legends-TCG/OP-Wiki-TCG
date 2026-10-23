CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pseudo" text NOT NULL,
	"berrys" integer DEFAULT 100,
	CONSTRAINT "users_pseudo_unique" UNIQUE("pseudo")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pageid" integer NOT NULL,
	"title" text NOT NULL,
	"rarity" text NOT NULL,
	"image" text,
	"description" text NOT NULL,
	CONSTRAINT "cards_pageid_unique" UNIQUE("pageid")
);
