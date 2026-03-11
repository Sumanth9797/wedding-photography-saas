import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/gallery_service.dart';

class ReviewScreen extends StatefulWidget {
  final String token;
  const ReviewScreen({super.key, required this.token});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  int _rating = 0;
  String _status = 'PENDING';
  final _commentCtrl = TextEditingController();
  bool _loading = false;
  bool _submitted = false;

  @override
  void dispose() {
    _commentCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      await GalleryService.submitReview(widget.token, {
        'rating': _rating > 0 ? _rating : null,
        'comment': _commentCtrl.text,
        'status': _status,
      });
      setState(() { _submitted = true; _loading = false; });
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit review')),
        );
      }
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('🎉', style: TextStyle(fontSize: 64)),
              const SizedBox(height: 16),
              const Text('Thank you!',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 8),
              Text('Your review has been submitted.',
                  style: TextStyle(color: Colors.grey[500])),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Review Photos')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Star Rating
            const Text('Rating', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (i) => GestureDetector(
                onTap: () => setState(() => _rating = i + 1),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Icon(
                    i < _rating ? Icons.star_rounded : Icons.star_outline_rounded,
                    size: 44,
                    color: i < _rating ? AppTheme.accent : Colors.grey[300],
                  ),
                ),
              )),
            ),
            const SizedBox(height: 24),

            // Decision
            const Text('Decision', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => setState(() => _status = 'APPROVED'),
                    icon: Icon(Icons.thumb_up_outlined,
                        color: _status == 'APPROVED' ? Colors.green : Colors.grey),
                    label: Text('Approve',
                        style: TextStyle(color: _status == 'APPROVED' ? Colors.green : Colors.grey)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: _status == 'APPROVED' ? Colors.green : Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => setState(() => _status = 'CHANGES_REQUESTED'),
                    icon: Icon(Icons.thumb_down_outlined,
                        color: _status == 'CHANGES_REQUESTED' ? Colors.orange : Colors.grey),
                    label: Text('Request Changes',
                        style: TextStyle(color: _status == 'CHANGES_REQUESTED' ? Colors.orange : Colors.grey),
                        overflow: TextOverflow.ellipsis),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                          color: _status == 'CHANGES_REQUESTED' ? Colors.orange : Colors.grey),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Comment
            TextField(
              controller: _commentCtrl,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Comments (optional)',
                hintText: 'Share your feedback...',
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loading ? null : _submit,
                child: _loading
                    ? const SizedBox(width: 20, height: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Submit Review'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
