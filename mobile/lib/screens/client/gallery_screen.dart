import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/gallery_provider.dart';
import '../../models/photo_model.dart';

class GalleryScreen extends StatefulWidget {
  final String token;
  const GalleryScreen({super.key, required this.token});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<GalleryProvider>().loadGallery(widget.token);
    });
  }

  Future<void> _submitSelections() async {
    setState(() => _submitting = true);
    try {
      await context.read<GalleryProvider>().submitSelections(widget.token);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Selections submitted!')),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit selections')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final gallery = context.watch<GalleryProvider>();
    final selectedCount = gallery.selectedCount;

    return Scaffold(
      appBar: AppBar(
        title: Text(gallery.gallery?.title ?? 'Gallery'),
        actions: [
          TextButton.icon(
            onPressed: () => context.push('/gallery/${widget.token}/review'),
            icon: const Icon(Icons.rate_review_outlined, color: Colors.white, size: 20),
            label: const Text('Review', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: gallery.loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => gallery.loadGallery(widget.token),
              child: Column(
                children: [
                  // Selection info bar
                  if (selectedCount > 0)
                    Container(
                      color: AppTheme.accent.withOpacity(0.1),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('$selectedCount photo${selectedCount > 1 ? 's' : ''} selected',
                              style: const TextStyle(fontWeight: FontWeight.w600)),
                          ElevatedButton(
                            onPressed: _submitting ? null : _submitSelections,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.accent,
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              minimumSize: Size.zero,
                            ),
                            child: _submitting
                                ? const SizedBox(width: 16, height: 16,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                : const Text('Submit', style: TextStyle(fontSize: 13)),
                          ),
                        ],
                      ),
                    ),

                  Expanded(
                    child: GridView.builder(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(4),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3, crossAxisSpacing: 3, mainAxisSpacing: 3,
                      ),
                      itemCount: gallery.photos.length,
                      itemBuilder: (_, i) {
                        final photo = gallery.photos[i];
                        final sel = gallery.selections[photo.id];
                        final isSelected = sel?['selected'] == true;
                        final isAlbum = sel?['isAlbumPhoto'] == true;

                        return GestureDetector(
                          onTap: () => gallery.toggleSelection(photo.id),
                          onLongPress: () {
                            if (isSelected) gallery.toggleAlbum(photo.id);
                          },
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: Image.network(
                                  photo.displayUrl,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Container(
                                    color: Colors.grey[200],
                                    child: const Icon(Icons.image_outlined, color: Colors.grey),
                                  ),
                                ),
                              ),
                              if (isSelected)
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: isAlbum ? AppTheme.secondary : AppTheme.accent,
                                        width: 3,
                                      ),
                                    ),
                                    child: Align(
                                      alignment: Alignment.topRight,
                                      child: Padding(
                                        padding: const EdgeInsets.all(4),
                                        child: Icon(
                                          isAlbum ? Icons.favorite : Icons.check_circle,
                                          color: isAlbum ? AppTheme.secondary : AppTheme.accent,
                                          size: 18,
                                        ),
                                      ),
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
            ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (i) {
          if (i == 1) context.push('/gallery/${widget.token}/review');
          if (i == 2) context.push('/gallery/${widget.token}/download');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.photo_library_outlined), label: 'Gallery'),
          BottomNavigationBarItem(icon: Icon(Icons.rate_review_outlined), label: 'Review'),
          BottomNavigationBarItem(icon: Icon(Icons.download_outlined), label: 'Download'),
        ],
      ),
    );
  }
}
