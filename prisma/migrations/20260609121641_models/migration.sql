/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CONCERT', 'CONFERENCE', 'ACTIVITY', 'STAND', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArtistType" AS ENUM ('ARTIST', 'SPEAKER', 'HOST');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STAGE', 'STAND', 'ENTRANCE', 'RESTROOM', 'FOOD', 'INFO', 'FIRST_AID', 'OTHER');

-- CreateEnum
CREATE TYPE "StandType" AS ENUM ('FOOD', 'DRINK', 'MERCH', 'INFO', 'SPONSOR', 'OTHER');

-- CreateEnum
CREATE TYPE "StandStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('MAIN', 'GOLD', 'SILVER', 'BRONZE', 'PARTNER');

-- CreateEnum
CREATE TYPE "MapPointType" AS ENUM ('STAGE', 'STAND', 'FOOD', 'RESTROOM', 'ENTRANCE', 'INFO', 'FIRST_AID', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReminderDelay" AS ENUM ('HOURS_24', 'HOURS_2', 'MINUTES_30');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "imageUrl" TEXT,
    "capacity" INTEGER,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,
    "genreId" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ArtistType" NOT NULL DEFAULT 'ARTIST',
    "bio" TEXT,
    "imageUrl" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventArtist" (
    "eventId" INTEGER NOT NULL,
    "artistId" INTEGER NOT NULL,
    "role" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventArtist_pkey" PRIMARY KEY ("eventId","artistId")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "StandType" NOT NULL DEFAULT 'OTHER',
    "status" "StandStatus" NOT NULL DEFAULT 'ACTIVE',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" INTEGER,
    "sponsorId" INTEGER,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandEvent" (
    "standId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "StandEvent_pkey" PRIMARY KEY ("standId","eventId")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "SponsorTier" NOT NULL DEFAULT 'PARTNER',
    "logoUrl" TEXT,
    "website" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSponsor" (
    "eventId" INTEGER NOT NULL,
    "sponsorId" INTEGER NOT NULL,

    CONSTRAINT "EventSponsor_pkey" PRIMARY KEY ("eventId","sponsorId")
);

-- CreateTable
CREATE TABLE "MapPoint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MapPointType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "MapPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReminder" (
    "id" SERIAL NOT NULL,
    "delay" "ReminderDelay" NOT NULL,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER,
    "pushSubscriptionId" INTEGER,

    CONSTRAINT "EventReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_categoryId_idx" ON "Event"("categoryId");

-- CreateIndex
CREATE INDEX "Event_genreId_idx" ON "Event"("genreId");

-- CreateIndex
CREATE INDEX "Event_locationId_idx" ON "Event"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_name_key" ON "EventCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_slug_key" ON "EventCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_name_key" ON "MusicGenre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_slug_key" ON "MusicGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");

-- CreateIndex
CREATE INDEX "Artist_type_idx" ON "Artist"("type");

-- CreateIndex
CREATE INDEX "EventArtist_artistId_idx" ON "EventArtist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "Location_type_idx" ON "Location"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_slug_key" ON "Stand"("slug");

-- CreateIndex
CREATE INDEX "Stand_type_idx" ON "Stand"("type");

-- CreateIndex
CREATE INDEX "Stand_status_idx" ON "Stand"("status");

-- CreateIndex
CREATE INDEX "Stand_locationId_idx" ON "Stand"("locationId");

-- CreateIndex
CREATE INDEX "Stand_sponsorId_idx" ON "Stand"("sponsorId");

-- CreateIndex
CREATE INDEX "StandEvent_eventId_idx" ON "StandEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_slug_key" ON "Sponsor"("slug");

-- CreateIndex
CREATE INDEX "Sponsor_tier_idx" ON "Sponsor"("tier");

-- CreateIndex
CREATE INDEX "EventSponsor_sponsorId_idx" ON "EventSponsor"("sponsorId");

-- CreateIndex
CREATE INDEX "MapPoint_type_idx" ON "MapPoint"("type");

-- CreateIndex
CREATE INDEX "MapPoint_eventId_idx" ON "MapPoint"("eventId");

-- CreateIndex
CREATE INDEX "MapPoint_locationId_idx" ON "MapPoint"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "EventReminder_eventId_idx" ON "EventReminder"("eventId");

-- CreateIndex
CREATE INDEX "EventReminder_userId_idx" ON "EventReminder"("userId");

-- CreateIndex
CREATE INDEX "EventReminder_pushSubscriptionId_idx" ON "EventReminder"("pushSubscriptionId");

-- CreateIndex
CREATE INDEX "EventReminder_remindAt_idx" ON "EventReminder"("remindAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "MusicGenre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArtist" ADD CONSTRAINT "EventArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandEvent" ADD CONSTRAINT "StandEvent_standId_fkey" FOREIGN KEY ("standId") REFERENCES "Stand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandEvent" ADD CONSTRAINT "StandEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsor" ADD CONSTRAINT "EventSponsor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsor" ADD CONSTRAINT "EventSponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPoint" ADD CONSTRAINT "MapPoint_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPoint" ADD CONSTRAINT "MapPoint_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReminder" ADD CONSTRAINT "EventReminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReminder" ADD CONSTRAINT "EventReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReminder" ADD CONSTRAINT "EventReminder_pushSubscriptionId_fkey" FOREIGN KEY ("pushSubscriptionId") REFERENCES "PushSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
