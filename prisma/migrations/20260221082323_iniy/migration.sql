-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('active', 'expired', 'canceled', 'pending_payment');

-- CreateEnum
CREATE TYPE "Paymentmethod" AS ENUM ('card', 'paypal', 'bank_transfer', 'crypto');

-- CreateEnum
CREATE TYPE "PaymentStep" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "Quality" AS ENUM ('240p', '360p', '480p', '720p', '1080p', '4K');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending_payment',
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "user_subscription_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_method" "Paymentmethod" NOT NULL,
    "payment_details" JSONB NOT NULL,
    "status" "PaymentStep" NOT NULL DEFAULT 'completed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slud" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "release_year" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "poster_url" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "subscription_type" "SubscriptionType" NOT NULL DEFAULT 'free',
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCategory" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "MovieCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieFiles" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "quality" "Quality" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'uz',

    CONSTRAINT "MovieFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchHistory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "watched_duration" INTEGER NOT NULL,
    "watched_percentage" DECIMAL(5,2) NOT NULL,
    "last_watched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slud_key" ON "Category"("slud");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MovieCategory_movie_id_category_id_key" ON "MovieCategory"("movie_id", "category_id");

-- CreateIndex
CREATE INDEX "MovieFiles_movie_id_idx" ON "MovieFiles"("movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_user_id_movie_id_key" ON "Favorites"("user_id", "movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_user_id_movie_id_key" ON "Review"("user_id", "movie_id");

-- CreateIndex
CREATE INDEX "WatchHistory_user_id_idx" ON "WatchHistory"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WatchHistory_user_id_movie_id_key" ON "WatchHistory"("user_id", "movie_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_subscription_id_fkey" FOREIGN KEY ("user_subscription_id") REFERENCES "UserSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCategory" ADD CONSTRAINT "MovieCategory_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCategory" ADD CONSTRAINT "MovieCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieFiles" ADD CONSTRAINT "MovieFiles_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchHistory" ADD CONSTRAINT "WatchHistory_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchHistory" ADD CONSTRAINT "WatchHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
