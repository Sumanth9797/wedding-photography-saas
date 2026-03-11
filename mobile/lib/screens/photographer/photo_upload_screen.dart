import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';

class PhotoUploadScreen extends StatefulWidget {
  final String eventId;
  const PhotoUploadScreen({super.key, required this.eventId});

  @override
  State<PhotoUploadScreen> createState() => _PhotoUploadScreenState();
}

class _PhotoUploadScreenState extends State<PhotoUploadScreen> {
  List<Map<String, dynamic>> _photos = [];
  bool _loading = true;
  bool _uploading = false;
  double _uploadProgress = 0;

  @override
  void initState() {
    super.initState();
    _loadPhotos();
  }

  Future<void> _loadPhotos() async {
    try {
      final res = await ApiService.get('/events/${widget.eventId}/photos');
      setState(() {
        _photos = List<Map<String, dynamic>>.from(res.data ?? []);
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _uploadPhotos() async {
    final picker = ImagePicker();
    final images = await picker.pickMultiImage(imageQuality: 85);
    if (images.isEmpty) return;

    setState(() { _uploading = true; _uploadProgress = 0; });
    int done = 0;

    for (final img in images) {
      try {
        final formData = FormData.fromMap({
          'file': await MultipartFile.fromFile(img.path, filename: img.name),
        });
        await ApiService.uploadFile(
          '/events/${widget.eventId}/photos/upload-preview',
          formData,
          onProgress: (sent, total) {
            setState(() => _uploadProgress = sent / total);
          },
        );
        done++;
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$done/${images.length} uploaded')),
          );
        }
      } catch (e) {
        // Continue uploading remaining photos
      }
    }

    setState(() { _uploading = false; _uploadProgress = 0; });
    _loadPhotos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Photos'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_photo_alternate_outlined),
            onPressed: _uploading ? null : _uploadPhotos,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                if (_uploading)
                  LinearProgressIndicator(value: _uploadProgress, minHeight: 4),
                Expanded(
                  child: _photos.isEmpty
                      ? const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.photo_library_outlined, size: 64, color: Colors.grey),
                              SizedBox(height: 12),
                              Text('No photos yet. Tap + to upload.'),
                            ],
                          ),
                        )
                      : GridView.builder(
                          padding: const EdgeInsets.all(8),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3, crossAxisSpacing: 4, mainAxisSpacing: 4,
                          ),
                          itemCount: _photos.length,
                          itemBuilder: (_, i) {
                            final photo = _photos[i];
                            return Stack(
                              fit: StackFit.expand,
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.network(
                                    photo['thumbnailUrl'] ?? photo['previewUrl'] ?? '',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(
                                      color: Colors.grey[200],
                                      child: const Icon(Icons.image_outlined, color: Colors.grey),
                                    ),
                                  ),
                                ),
                                if (photo['status'] == 'SELECTED')
                                  Positioned(
                                    bottom: 4, right: 4,
                                    child: Container(
                                      padding: const EdgeInsets.all(3),
                                      decoration: const BoxDecoration(
                                        color: Color(0xFFD4A843), shape: BoxShape.circle,
                                      ),
                                      child: const Icon(Icons.check, size: 12, color: Colors.white),
                                    ),
                                  ),
                              ],
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}
