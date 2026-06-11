-- CreateTable
CREATE TABLE "app"."PushEventSubscription" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pushSubscriptionId" INTEGER NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "eventTitle" TEXT,
    "eventStartsAt" TIMESTAMP(3),

    CONSTRAINT "PushEventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."EventSubscriptionReminder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pushEventSubscriptionId" INTEGER NOT NULL,

    CONSTRAINT "EventSubscriptionReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."PushTopic" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."PushSubscriptionTopic" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pushSubscriptionId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "PushSubscriptionTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."ScheduledPush" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "url" VARCHAR(500),
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" INTEGER,
    "createdById" INTEGER,

    CONSTRAINT "ScheduledPush_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PushEventSubscription_pushSubscriptionId_idx" ON "app"."PushEventSubscription"("pushSubscriptionId");

-- CreateIndex
CREATE INDEX "PushEventSubscription_eventSlug_idx" ON "app"."PushEventSubscription"("eventSlug");

-- CreateIndex
CREATE INDEX "PushEventSubscription_eventStartsAt_idx" ON "app"."PushEventSubscription"("eventStartsAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushEventSubscription_pushSubscriptionId_eventSlug_key" ON "app"."PushEventSubscription"("pushSubscriptionId", "eventSlug");

-- CreateIndex
CREATE INDEX "EventSubscriptionReminder_pushEventSubscriptionId_idx" ON "app"."EventSubscriptionReminder"("pushEventSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSubscriptionReminder_pushEventSubscriptionId_key" ON "app"."EventSubscriptionReminder"("pushEventSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PushTopic_key_key" ON "app"."PushTopic"("key");

-- CreateIndex
CREATE INDEX "PushTopic_isDefault_idx" ON "app"."PushTopic"("isDefault");

-- CreateIndex
CREATE INDEX "PushSubscriptionTopic_topicId_idx" ON "app"."PushSubscriptionTopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscriptionTopic_pushSubscriptionId_topicId_key" ON "app"."PushSubscriptionTopic"("pushSubscriptionId", "topicId");

-- CreateIndex
CREATE INDEX "ScheduledPush_scheduledAt_idx" ON "app"."ScheduledPush"("scheduledAt");

-- CreateIndex
CREATE INDEX "ScheduledPush_sentAt_idx" ON "app"."ScheduledPush"("sentAt");

-- CreateIndex
CREATE INDEX "ScheduledPush_cancelledAt_idx" ON "app"."ScheduledPush"("cancelledAt");

-- CreateIndex
CREATE INDEX "ScheduledPush_topicId_idx" ON "app"."ScheduledPush"("topicId");

-- AddForeignKey
ALTER TABLE "app"."PushEventSubscription" ADD CONSTRAINT "PushEventSubscription_pushSubscriptionId_fkey" FOREIGN KEY ("pushSubscriptionId") REFERENCES "app"."PushSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."EventSubscriptionReminder" ADD CONSTRAINT "EventSubscriptionReminder_pushEventSubscriptionId_fkey" FOREIGN KEY ("pushEventSubscriptionId") REFERENCES "app"."PushEventSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PushSubscriptionTopic" ADD CONSTRAINT "PushSubscriptionTopic_pushSubscriptionId_fkey" FOREIGN KEY ("pushSubscriptionId") REFERENCES "app"."PushSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."PushSubscriptionTopic" ADD CONSTRAINT "PushSubscriptionTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "app"."PushTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."ScheduledPush" ADD CONSTRAINT "ScheduledPush_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "app"."PushTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
