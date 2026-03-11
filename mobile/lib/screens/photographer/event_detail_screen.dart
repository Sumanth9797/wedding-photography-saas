import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../services/api_service.dart';
import '../../models/event_model.dart';

class EventDetailScreen extends StatefulWidget {
  final String eventId;
  const EventDetailScreen({super.key, required this.eventId});

  @override
  State<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends State<EventDetailScreen> {
  EventModel? _event;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadEvent();
  }

  Future<void> _loadEvent() async {
    try {
      final res = await ApiService.get('/events/${widget.eventId}');
      setState(() {
        _event = EventModel.fromJson(res.data);
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_event?.title ?? 'Event Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.photo_library_outlined),
            onPressed: () => context.push('/photographer/events/${widget.eventId}/photos'),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _event == null
              ? const Center(child: Text('Event not found'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _InfoRow('Wedding Date', _event!.weddingDate),
                              if (_event!.venue != null) _InfoRow('Venue', _event!.venue!),
                              _InfoRow('Status', _event!.statusLabel),
                              const Divider(height: 24),
                              _InfoRow('Bride', _event!.brideName),
                              if (_event!.brideEmail != null) _InfoRow('Bride Email', _event!.brideEmail!),
                              const Divider(height: 24),
                              _InfoRow('Groom', _event!.groomName),
                              if (_event!.groomEmail != null) _InfoRow('Groom Email', _event!.groomEmail!),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (_event!.pinCode != null)
                        Card(
                          color: AppTheme.primary.withOpacity(0.05),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Gallery PIN', style: TextStyle(fontWeight: FontWeight.w600)),
                                const SizedBox(height: 8),
                                Text(
                                  _event!.pinCode!,
                                  style: const TextStyle(
                                    fontSize: 32, fontWeight: FontWeight.bold,
                                    color: AppTheme.primary, letterSpacing: 8,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
