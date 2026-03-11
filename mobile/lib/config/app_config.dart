import 'package:shared_preferences/shared_preferences.dart';

class AppConfig {
  static late SharedPreferences _prefs;

  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080',
  );

  static Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs => _prefs;

  static const String apiUrl = '$baseUrl/api';
  static const String galleryUrl = 'http://localhost:3000/gallery';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'auth_user';
  static const String galleryTokenKey = 'gallery_token';
}
