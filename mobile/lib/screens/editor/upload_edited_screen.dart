import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';

class UploadEditedScreen extends StatefulWidget {
  final String eventId;
  const UploadEditedScreen({super.key, required this.eventId});

  @override
  State<UploadEditedScreen> createState() => _UploadEditedScreenState();
}

class _UploadEditedScreenState extends State<UploadEditedScreen> {
  final _notesCtrl = TextEditingController();
  bool _uploading = false;

  @override
  void dispose() {
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _uploadAlbum() async {
    final picker = ImagePicker();
    final img = await picker.pickImage(source: ImageSource.gallery);
    if (img == null) return;
    setState(() => _uploading = true);
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(img.path, filename: img.name),
        if (_notesCtrl.text.isNotEmpty) 'editorNotes': _notesCtrl.text,
      });
      await ApiService.uploadFile(
        '/editor/assignments/${widget.eventId}/upload-album', formData,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Album preview uploaded!')),
        );
        Navigator.pop(context);
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Upload failed')),
        );
      }
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upload Album Preview')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            TextField(
              controller: _notesCtrl,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Editor Notes',
                hintText: 'Add notes about this upload...',
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _uploading ? null : _uploadAlbum,
                icon: _uploading
                    ? const SizedBox(width: 18, height: 18,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.upload),
                label: const Text('Select & Upload Album'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
