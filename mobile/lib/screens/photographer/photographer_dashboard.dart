import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/event_provider.dart';
import '../../models/event_model.dart';

class PhotographerDashboard extends StatefulWidget {
  const PhotographerDashboard({super.key});

  @override
  State<PhotographerDashboard> createState() => _PhotographerDashboardState();
}

class _PhotographerDashboardState extends State<PhotographerDashboard> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EventProvider>().loadEvents();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final events = context.watch<EventProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('WeddingSnap'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          PopupMenuButton<String>(
            onSelected: (val) {
              if (val == 'logout') {
                auth.logout();
                context.go('/auth/login');
              }
            },
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'logout', child: Text('Logout')),
            ],
          ),
        ],
      ),
      body: _selectedIndex == 0
          ? _buildDashboard(events)
          : _selectedIndex == 1
              ? _buildEventsTab(events)
              : _buildAnalyticsTab(),
      floatingActionButton: _selectedIndex == 0 || _selectedIndex == 1
          ? FloatingActionButton(
              onPressed: () => context.push('/photographer/events/new'),
              backgroundColor: AppTheme.primary,
              child: const Icon(Icons.add, color: Colors.white),
            )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (i) => setState(() => _selectedIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.event_outlined), label: 'Events'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart_outlined), label: 'Analytics'),
        ],
      ),
    );
  }

  Widget _buildDashboard(EventProvider events) {
    return RefreshIndicator(
      onRefresh: events.loadEvents,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome back!',
                style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 16),

            // Stats Row
            Row(
              children: [
                _StatCard(
                  icon: Icons.event, label: 'Events',
                  value: events.events.length.toString(), color: Colors.blue,
                ),
                const SizedBox(width: 12),
                _StatCard(
                  icon: Icons.photo_library_outlined, label: 'Active',
                  value: events.events.where((e) => e.status == 'ACTIVE').length.toString(),
                  color: Colors.green,
                ),
              ],
            ),
            const SizedBox(height: 20),

            const Text('Recent Events',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),

            if (events.loading)
              const Center(child: CircularProgressIndicator())
            else if (events.events.isEmpty)
              _buildEmptyState()
            else
              ...events.events.take(5).map((e) => _EventListTile(event: e)),
          ],
        ),
      ),
    );
  }

  Widget _buildEventsTab(EventProvider events) {
    return RefreshIndicator(
      onRefresh: events.loadEvents,
      child: events.loading
          ? const Center(child: CircularProgressIndicator())
          : events.events.isEmpty
              ? _buildEmptyState()
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: events.events.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (_, i) => _EventListTile(event: events.events[i]),
                ),
    );
  }

  Widget _buildAnalyticsTab() {
    return const Center(
      child: Text('Analytics coming soon', style: TextStyle(color: Colors.grey)),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        children: [
          const SizedBox(height: 40),
          const Icon(Icons.event_note_outlined, size: 64, color: Colors.grey),
          const SizedBox(height: 12),
          const Text('No events yet', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text('Create your first wedding event!',
              style: TextStyle(color: Colors.grey[500])),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 8),
              Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
              Text(label, style: const TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
        ),
      ),
    );
  }
}

class _EventListTile extends StatelessWidget {
  final EventModel event;
  const _EventListTile({required this.event});

  @override
  Widget build(BuildContext context) {
    final statusColors = {
      'DRAFT': Colors.grey,
      'ACTIVE': Colors.green,
      'EDITING': Colors.orange,
      'REVIEW': Colors.blue,
      'COMPLETED': Colors.purple,
    };

    return Card(
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AppTheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.favorite_border, color: AppTheme.primary),
        ),
        title: Text(event.title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text('${event.brideName} & ${event.groomName}'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: (statusColors[event.status] ?? Colors.grey).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            event.statusLabel,
            style: TextStyle(
              color: statusColors[event.status] ?? Colors.grey,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        onTap: () => context.push('/photographer/events/${event.id}'),
      ),
    );
  }
}
