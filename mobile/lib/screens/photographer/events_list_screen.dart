import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/event_provider.dart';
import '../../models/event_model.dart';

class EventsListScreen extends StatefulWidget {
  const EventsListScreen({super.key});

  @override
  State<EventsListScreen> createState() => _EventsListScreenState();
}

class _EventsListScreenState extends State<EventsListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EventProvider>().loadEvents();
    });
  }

  @override
  Widget build(BuildContext context) {
    final events = context.watch<EventProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('My Events')),
      body: events.loading
          ? const Center(child: CircularProgressIndicator())
          : events.events.isEmpty
              ? const Center(child: Text('No events yet'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: events.events.length,
                  itemBuilder: (_, i) {
                    final e = events.events[i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        title: Text(e.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Text('${e.brideName} & ${e.groomName} · ${e.weddingDate}'),
                        trailing: Text(e.statusLabel),
                        onTap: () => context.push('/photographer/events/${e.id}'),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/photographer/events/new'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
