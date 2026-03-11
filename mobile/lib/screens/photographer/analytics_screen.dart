import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/api_service.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final res = await ApiService.get('/analytics/overview');
      setState(() { _stats = res.data; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadStats,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _StatsRow(stats: _stats),
                    const SizedBox(height: 16),
                    if (_stats?['eventsByStatus'] != null)
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Events by Status',
                                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                              const SizedBox(height: 12),
                              ...(_stats!['eventsByStatus'] as Map).entries.map((e) =>
                                Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(e.key, style: const TextStyle(color: Colors.grey)),
                                      Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final Map<String, dynamic>? stats;
  const _StatsRow({this.stats});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatCard(label: 'Events', value: '${stats?['totalEvents'] ?? 0}', icon: Icons.event, color: Colors.blue),
        const SizedBox(width: 12),
        _StatCard(label: 'Photos', value: '${stats?['totalPhotos'] ?? 0}', icon: Icons.photo, color: Colors.green),
        const SizedBox(width: 12),
        _StatCard(label: 'Rating', value: '${stats?['averageRating'] ?? 0}★', icon: Icons.star, color: Colors.amber),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 6),
              Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
              Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }
}
