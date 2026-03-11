import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';

class AssignmentDetailScreen extends StatefulWidget {
  final String eventId;
  const AssignmentDetailScreen({super.key, required this.eventId});

  @override
  State<AssignmentDetailScreen> createState() => _AssignmentDetailScreenState();
}

class _AssignmentDetailScreenState extends State<AssignmentDetailScreen> {
  List<Map<String, dynamic>> _photos = [];
  bool _loading = true;
  Map<String, dynamic>? _selectedPhoto;
  final _notesCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _notesCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final res = await ApiService.get('/editor/assignments/${widget.eventId}/photos');
      setState(() {
        _photos = List<Map<String, dynamic>>.from(res.data ?? []);
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _uploadEdited() async {
    if (_selectedPhoto == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a photo first')),
      );
      return;
    }
    final picker = ImagePicker();
    final img = await picker.pickImage(source: ImageSource.gallery, imageQuality: 90);
    if (img == null) return;

    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(img.path, filename: img.name),
        'photoId': _selectedPhoto!['id'].toString(),
        if (_notesCtrl.text.isNotEmpty) 'editorNotes': _notesCtrl.text,
      });
      await ApiService.uploadFile(
        '/editor/assignments/${widget.eventId}/upload-edited', formData,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Edited photo uploaded!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Upload failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assignment Photos'),
        actions: [
          IconButton(
            icon: const Icon(Icons.upload_file_outlined),
            onPressed: _uploadEdited,
            tooltip: 'Upload Edited',
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                if (_selectedPhoto != null)
                  Container(
                    color: const Color(0xFF6B4FA0).withOpacity(0.1),
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle, color: Color(0xFF6B4FA0), size: 20),
                        const SizedBox(width: 8),
                        Expanded(child: Text('Selected: ${_selectedPhoto!['fileName']}',
                            style: const TextStyle(fontSize: 13))),
                        TextButton(
                          onPressed: () => setState(() => _selectedPhoto = null),
                          child: const Text('Clear'),
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: GridView.builder(
                    padding: const EdgeInsets.all(8),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3, crossAxisSpacing: 4, mainAxisSpacing: 4,
                    ),
                    itemCount: _photos.length,
                    itemBuilder: (_, i) {
                      final photo = _photos[i];
                      final isSelected = _selectedPhoto?['id'] == photo['id'];
                      return GestureDetector(
                        onTap: () => setState(() => _selectedPhoto = photo),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                photo['previewUrl'] ?? '',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: Colors.grey[200],
                                  child: const Icon(Icons.image_outlined, color: Colors.grey),
                                ),
                              ),
                            ),
                            if (isSelected)
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFF6B4FA0), width: 3),
                                ),
                                child: const Align(
                                  alignment: Alignment.topRight,
                                  child: Padding(
                                    padding: EdgeInsets.all(4),
                                    child: Icon(Icons.check_circle, color: Color(0xFF6B4FA0), size: 20),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }
}
