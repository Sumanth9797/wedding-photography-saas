import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/api_service.dart';

class EditorDashboard extends StatefulWidget {
  const EditorDashboard({super.key});

  @override
  State<EditorDashboard> createState() => _EditorDashboardState();
}

class _EditorDashboardState extends State<EditorDashboard> {
  List<Map<String, dynamic>> _assignments = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ApiService.get('/editor/assignments');
      setState(() {
        _assignments = List<Map<String, dynamic>>.from(res.data ?? []);
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Assignments')),
      body: RefreshIndicator(
        onRefresh: _load,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _assignments.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.edit_outlined, size: 64, color: Colors.grey),
                        SizedBox(height: 12),
                        Text('No assignments yet'),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _assignments.length,
                    itemBuilder: (_, i) {
                      final a = _assignments[i];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: const Icon(Icons.camera_alt_outlined, color: Color(0xFF6B4FA0)),
                          title: Text(a['eventTitle'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                          subtitle: Text('Wedding: ${a['weddingDate'] ?? ''}'),
                          trailing: Text(a['status'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                          onTap: () => context.push('/editor/assignments/${a['eventId']}'),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
