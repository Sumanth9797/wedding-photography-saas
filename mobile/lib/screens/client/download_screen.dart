import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../services/gallery_service.dart';

class DownloadScreen extends StatefulWidget {
  final String token;
  const DownloadScreen({super.key, required this.token});

  @override
  State<DownloadScreen> createState() => _DownloadScreenState();
}

class _DownloadScreenState extends State<DownloadScreen> {
  List<String> _urls = [];
  bool _loading = true;
  bool _hasAccess = false;

  @override
  void initState() {
    super.initState();
    _loadDownloads();
  }

  Future<void> _loadDownloads() async {
    try {
      _urls = await GalleryService.getDownloadUrls(widget.token);
      setState(() { _hasAccess = true; _loading = false; });
    } catch (e) {
      setState(() { _hasAccess = false; _loading = false; });
    }
  }

  Future<void> _downloadAll() async {
    for (final url in _urls) {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Download Photos')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : !_hasAccess
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.lock_clock_outlined, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Downloads not yet enabled',
                          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                      SizedBox(height: 8),
                      Text(
                        'Your photographer will enable downloads\nafter final approval.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppTheme.accent.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          children: [
                            const Icon(Icons.download_done_rounded,
                                size: 56, color: AppTheme.accent),
                            const SizedBox(height: 12),
                            Text(
                              '${_urls.length} Photos Ready',
                              style: const TextStyle(
                                fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text('Your approved photos are ready for download',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: _downloadAll,
                          icon: const Icon(Icons.download),
                          label: const Text('Download All Photos'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.accent,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
