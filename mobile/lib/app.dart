import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/routes.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/event_provider.dart';
import 'providers/gallery_provider.dart';

class WeddingPhotographyApp extends StatelessWidget {
  const WeddingPhotographyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => EventProvider()),
        ChangeNotifierProvider(create: (_) => GalleryProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return MaterialApp.router(
            title: 'WeddingSnap',
            theme: AppTheme.lightTheme,
            routerConfig: AppRoutes.router(auth),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}
