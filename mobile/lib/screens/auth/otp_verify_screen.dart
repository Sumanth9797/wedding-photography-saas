import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:pinput/pinput.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/auth_service.dart';

class OtpVerifyScreen extends StatefulWidget {
  final String contact;
  const OtpVerifyScreen({super.key, required this.contact});

  @override
  State<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
}

class _OtpVerifyScreenState extends State<OtpVerifyScreen> {
  final _otpController = TextEditingController();
  bool _loading = false;

  Future<void> _verifyOtp() async {
    if (_otpController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter the 6-digit OTP')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final data = await context.read<AuthProvider>().verifyOtp(
        widget.contact, _otpController.text,
      );
      if (!mounted) return;
      final role = data['role'];
      if (role == 'PHOTOGRAPHER') context.go('/photographer');
      else if (role == 'EDITOR') context.go('/editor');
      else context.go('/auth/login');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid OTP. Please try again.')),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _resendOtp() async {
    try {
      await AuthService.sendOtp(widget.contact, 'PHOTOGRAPHER');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('OTP resent!')),
        );
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: 52,
      height: 60,
      textStyle: const TextStyle(
        fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.primary,
      ),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(12),
      ),
    );

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Verify OTP')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 32),
              const Icon(Icons.lock_outline_rounded, size: 56, color: AppTheme.primary),
              const SizedBox(height: 16),
              const Text('Enter Verification Code',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 8),
              Text('We sent a 6-digit code to ${widget.contact}',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey[500])),
              const SizedBox(height: 36),
              Pinput(
                controller: _otpController,
                length: 6,
                defaultPinTheme: defaultPinTheme,
                focusedPinTheme: defaultPinTheme.copyDecorationWith(
                  border: Border.all(color: AppTheme.primary, width: 2),
                ),
                onCompleted: (_) => _verifyOtp(),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _verifyOtp,
                  child: _loading
                      ? const SizedBox(width: 20, height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Verify & Login'),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _resendOtp,
                child: const Text('Resend OTP'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
