import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/otp_verify_screen.dart';
import '../screens/photographer/photographer_dashboard.dart';
import '../screens/photographer/events_list_screen.dart';
import '../screens/photographer/event_detail_screen.dart';
import '../screens/photographer/create_event_screen.dart';
import '../screens/photographer/photo_upload_screen.dart';
import '../screens/photographer/analytics_screen.dart';
import '../screens/editor/editor_dashboard.dart';
import '../screens/editor/assignment_detail_screen.dart';
import '../screens/editor/upload_edited_screen.dart';
import '../screens/client/gallery_access_screen.dart';
import '../screens/client/gallery_screen.dart';
import '../screens/client/photo_viewer_screen.dart';
import '../screens/client/review_screen.dart';
import '../screens/client/download_screen.dart';

class AppRoutes {
  static GoRouter router(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/splash',
      redirect: (context, state) {
        final isAuth = auth.isAuthenticated;
        final isOnAuth = state.matchedLocation.startsWith('/auth') ||
            state.matchedLocation == '/splash';
        final isOnGallery = state.matchedLocation.startsWith('/gallery');

        if (isOnGallery) return null;
        if (!isAuth && !isOnAuth) return '/auth/login';
        if (isAuth && isOnAuth) {
          return auth.userRole == 'PHOTOGRAPHER'
              ? '/photographer'
              : auth.userRole == 'EDITOR'
                  ? '/editor'
                  : '/auth/login';
        }
        return null;
      },
      routes: [
        GoRoute(path: '/splash', builder: (ctx, _) => const SplashScreen()),
        GoRoute(path: '/auth/login', builder: (ctx, _) => const LoginScreen()),
        GoRoute(
          path: '/auth/verify-otp',
          builder: (ctx, state) => OtpVerifyScreen(
            contact: state.extra as String? ?? '',
          ),
        ),

        // Photographer
        GoRoute(path: '/photographer', builder: (ctx, _) => const PhotographerDashboard()),
        GoRoute(path: '/photographer/events', builder: (ctx, _) => const EventsListScreen()),
        GoRoute(path: '/photographer/events/new', builder: (ctx, _) => const CreateEventScreen()),
        GoRoute(
          path: '/photographer/events/:id',
          builder: (ctx, state) => EventDetailScreen(eventId: state.pathParameters['id']!),
        ),
        GoRoute(
          path: '/photographer/events/:id/photos',
          builder: (ctx, state) => PhotoUploadScreen(eventId: state.pathParameters['id']!),
        ),
        GoRoute(path: '/photographer/analytics', builder: (ctx, _) => const AnalyticsScreen()),

        // Editor
        GoRoute(path: '/editor', builder: (ctx, _) => const EditorDashboard()),
        GoRoute(
          path: '/editor/assignments/:eventId',
          builder: (ctx, state) => AssignmentDetailScreen(
            eventId: state.pathParameters['eventId']!,
          ),
        ),
        GoRoute(
          path: '/editor/assignments/:eventId/upload',
          builder: (ctx, state) => UploadEditedScreen(
            eventId: state.pathParameters['eventId']!,
          ),
        ),

        // Client Gallery (Deep Links)
        GoRoute(
          path: '/gallery/:token',
          builder: (ctx, state) => GalleryAccessScreen(
            token: state.pathParameters['token']!,
          ),
        ),
        GoRoute(
          path: '/gallery/:token/view',
          builder: (ctx, state) => GalleryScreen(
            token: state.pathParameters['token']!,
          ),
        ),
        GoRoute(
          path: '/gallery/:token/photo',
          builder: (ctx, state) => PhotoViewerScreen(
            photos: state.extra as List<Map<String, dynamic>>? ?? [],
            initialIndex: int.tryParse(state.uri.queryParameters['index'] ?? '0') ?? 0,
          ),
        ),
        GoRoute(
          path: '/gallery/:token/review',
          builder: (ctx, state) => ReviewScreen(
            token: state.pathParameters['token']!,
          ),
        ),
        GoRoute(
          path: '/gallery/:token/download',
          builder: (ctx, state) => DownloadScreen(
            token: state.pathParameters['token']!,
          ),
        ),
      ],
    );
  }
}
