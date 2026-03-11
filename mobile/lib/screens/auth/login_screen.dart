import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _contactController = TextEditingController();
  String _role = 'PHOTOGRAPHER';
  bool _loading = false;

  @override
  void dispose() {
    _contactController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final contact = _contactController.text.trim();
    if (contact.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email or phone number')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      await AuthService.sendOtp(contact, _role);
      if (mounted) context.push('/auth/verify-otp', extra: contact);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to send OTP: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AppTheme.primary, AppTheme.secondary],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.camera_alt_rounded,
                          size: 40, color: AppTheme.primary),
                    ),
                    const SizedBox(height: 16),
                    const Text('WeddingSnap',
                        style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                    const SizedBox(height: 4),
                    Text('Secure login with OTP',
                        style: TextStyle(color: Colors.grey[500], fontSize: 14)),
                    const SizedBox(height: 28),

                    // Role Selector
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('I am a...', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: ['PHOTOGRAPHER', 'EDITOR', 'CLIENT'].map((role) => Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _role = role),
                          child: Container(
                            margin: const EdgeInsets.only(right: 6),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _role == role ? AppTheme.primary : Colors.white,
                              border: Border.all(
                                color: _role == role ? AppTheme.primary : Colors.grey[300]!,
                              ),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              role[0] + role.substring(1).toLowerCase(),
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: _role == role ? Colors.white : Colors.grey[600],
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      )).toList(),
                    ),
                    const SizedBox(height: 16),

                    // Contact Input
                    TextField(
                      controller: _contactController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        hintText: 'Email or phone number',
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                    ),
                    const SizedBox(height: 20),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _sendOtp,
                        child: _loading
                            ? const SizedBox(width: 20, height: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Text('Send OTP'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
