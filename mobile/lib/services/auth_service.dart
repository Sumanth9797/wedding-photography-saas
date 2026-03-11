import '../config/app_config.dart';
import 'api_service.dart';
import 'dart:convert';

class AuthService {
  static Future<void> sendOtp(String contact, String role) async {
    await ApiService.post('/auth/send-otp', data: {
      'contact': contact,
      'role': role,
    });
  }

  static Future<Map<String, dynamic>> verifyOtp(String contact, String otp) async {
    final response = await ApiService.post('/auth/verify-otp', data: {
      'contact': contact,
      'otp': otp,
    });
    final data = response.data as Map<String, dynamic>;

    // Save token and user
    await AppConfig.prefs.setString(AppConfig.tokenKey, data['token']);
    await AppConfig.prefs.setString(
      AppConfig.userKey,
      jsonEncode({'id': data['userId'], 'role': data['role'], 'name': data['name']}),
    );

    return data;
  }

  static Future<Map<String, dynamic>> galleryAccess(String token, String pin) async {
    final response = await ApiService.post('/auth/gallery-access/$token', data: {'pin': pin});
    final data = response.data as Map<String, dynamic>;
    await AppConfig.prefs.setString(AppConfig.galleryTokenKey, data['token']);
    return data;
  }

  static bool get isAuthenticated =>
      AppConfig.prefs.containsKey(AppConfig.tokenKey);

  static Map<String, dynamic>? get currentUser {
    final json = AppConfig.prefs.getString(AppConfig.userKey);
    if (json == null) return null;
    return jsonDecode(json);
  }

  static Future<void> logout() async {
    await AppConfig.prefs.remove(AppConfig.tokenKey);
    await AppConfig.prefs.remove(AppConfig.userKey);
    await AppConfig.prefs.remove(AppConfig.galleryTokenKey);
  }
}
