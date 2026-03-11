import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _loading = false;

  AuthProvider() {
    _user = AuthService.currentUser;
  }

  bool get isAuthenticated => _user != null;
  String? get userRole => _user?['role'];
  String? get userName => _user?['name'];
  int? get userId => _user?['id'];
  bool get loading => _loading;

  Future<Map<String, dynamic>> verifyOtp(String contact, String otp) async {
    _loading = true;
    notifyListeners();
    try {
      final data = await AuthService.verifyOtp(contact, otp);
      _user = data;
      notifyListeners();
      return data;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }
}
