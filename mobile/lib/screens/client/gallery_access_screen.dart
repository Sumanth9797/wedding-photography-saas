import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';
import '../../config/theme.dart';
import '../../services/gallery_service.dart';
import '../../services/auth_service.dart';
import '../../models/gallery_model.dart';

class GalleryAccessScreen extends StatefulWidget {
  final String token;
  const GalleryAccessScreen({super.key, required this.token});

  @override
  State<GalleryAccessScreen> createState() => _GalleryAccessScreenState();
}

class _GalleryAccessScreenState extends State<GalleryAccessScreen> {
  GalleryModel? _gallery;
  bool _loading = true;
  bool _verifying = false;
  final _pinController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadGallery();
  }

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  Future<void> _loadGallery() async {
    try {
      _gallery = await GalleryService.getGalleryInfo(widget.token);
      setState(() => _loading = false);
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _verifyAccess() async {
    if (_pinController.text.length != 6) return;
    setState(() => _verifying = true);
    try {
      await AuthService.galleryAccess(widget.token, _pinController.text);
      if (mounted) context.go('/gallery/${widget.token}/view');
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid PIN. Please try again.')),
        );
        _pinController.clear();
      }
    } finally {
      if (mounted) setState(() => _verifying = false);
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
            colors: [AppTheme.primary, AppTheme.secondary, AppTheme.accent],
          ),
        ),
        child: SafeArea(
          child: _loading
              ? const Center(child: CircularProgressIndicator(color: Colors.white))
              : Center(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      overflow: Overflow.clip,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Header
                          Container(
                            padding: const EdgeInsets.all(28),
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                colors: [AppTheme.primary, AppTheme.secondary],
                              ),
                            ),
                            child: Column(
                              children: [
                                const Icon(Icons.camera_alt_rounded, size: 48, color: Colors.white),
                                const SizedBox(height: 12),
                                Text(
                                  _gallery?.title ?? 'Wedding Gallery',
                                  style: const TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                if (_gallery != null)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Text(
                                      '${_gallery!.brideName} & ${_gallery!.groomName}',
                                      style: TextStyle(color: Colors.white.withOpacity(0.8)),
                                    ),
                                  ),
                              ],
                            ),
                          ),

                          Padding(
                            padding: const EdgeInsets.all(28),
                            child: Column(
                              children: [
                                const Icon(Icons.lock_outline, size: 36, color: AppTheme.primary),
                                const SizedBox(height: 12),
                                const Text('Enter your 6-digit PIN',
                                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 24),
                                Pinput(
                                  controller: _pinController,
                                  length: 6,
                                  onCompleted: (_) => _verifyAccess(),
                                ),
                                const SizedBox(height: 24),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _verifying ? null : _verifyAccess,
                                    child: _verifying
                                        ? const SizedBox(width: 20, height: 20,
                                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                        : const Text('Access Gallery'),
                                  ),
                                ),
                              ],
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
