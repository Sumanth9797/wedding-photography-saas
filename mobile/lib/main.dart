import 'package:flutter/material.dart';
import 'app.dart';
import 'config/app_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.initialize();
  runApp(const WeddingPhotographyApp());
}
