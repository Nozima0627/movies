import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { UserSubscriptionModule } from './modules/user-subscription/user-subscription.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesModule } from './modules/movies/movies.module';
import { MovieCategoryModule } from './modules/movie-category/movie-category.module';
import { MovieFilesModule } from './modules/movie-files/movie-files.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewModule } from './modules/review/review.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './core/database/prisma.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), "src", 'uploads'),
        serveRoot: '/avatars'
    }),
    ConfigModule.forRoot({
        isGlobal: true
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    MoviesModule,
    SubscriptionPlansModule,
    UserSubscriptionModule,
    PaymentModule,
    CategoriesModule,
    MovieCategoryModule,
    MovieFilesModule,
    FavoritesModule,
    ReviewModule,
    WatchHistoryModule,
    PrismaModule
  ]
})
export class AppModule {}
