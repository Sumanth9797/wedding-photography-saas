import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/event_provider.dart';

class CreateEventScreen extends StatefulWidget {
  const CreateEventScreen({super.key});

  @override
  State<CreateEventScreen> createState() => _CreateEventScreenState();
}

class _CreateEventScreenState extends State<CreateEventScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _venueCtrl = TextEditingController();
  final _brideNameCtrl = TextEditingController();
  final _brideEmailCtrl = TextEditingController();
  final _bridePhoneCtrl = TextEditingController();
  final _groomNameCtrl = TextEditingController();
  final _groomEmailCtrl = TextEditingController();
  final _groomPhoneCtrl = TextEditingController();
  DateTime? _weddingDate;
  bool _loading = false;

  @override
  void dispose() {
    for (final c in [_titleCtrl, _venueCtrl, _brideNameCtrl, _brideEmailCtrl,
        _bridePhoneCtrl, _groomNameCtrl, _groomEmailCtrl, _groomPhoneCtrl]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _weddingDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final event = await context.read<EventProvider>().createEvent({
        'title': _titleCtrl.text,
        'weddingDate': _weddingDate!.toIso8601String().split('T')[0],
        'venue': _venueCtrl.text,
        'brideName': _brideNameCtrl.text,
        'brideEmail': _brideEmailCtrl.text,
        'bridePhone': _bridePhoneCtrl.text,
        'groomName': _groomNameCtrl.text,
        'groomEmail': _groomEmailCtrl.text,
        'groomPhone': _groomPhoneCtrl.text,
      });
      if (event != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Event created successfully!')),
        );
        context.go('/photographer/events/${event.id}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Event')),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _sectionLabel('Event Details'),
              TextFormField(
                controller: _titleCtrl,
                decoration: const InputDecoration(labelText: 'Event Title *'),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(_weddingDate == null
                    ? 'Select Wedding Date *'
                    : 'Date: ${_weddingDate!.toLocal().toString().split(' ')[0]}'),
                leading: const Icon(Icons.calendar_today),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now().add(const Duration(days: 30)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 1825)),
                  );
                  if (picked != null) setState(() => _weddingDate = picked);
                },
              ),
              TextFormField(
                controller: _venueCtrl,
                decoration: const InputDecoration(labelText: 'Venue'),
              ),
              const SizedBox(height: 20),
              _sectionLabel('Bride Details'),
              TextFormField(
                controller: _brideNameCtrl,
                decoration: const InputDecoration(labelText: 'Bride Name *'),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 8),
              TextFormField(controller: _brideEmailCtrl,
                  decoration: const InputDecoration(labelText: 'Bride Email'),
                  keyboardType: TextInputType.emailAddress),
              const SizedBox(height: 8),
              TextFormField(controller: _bridePhoneCtrl,
                  decoration: const InputDecoration(labelText: 'Bride Phone'),
                  keyboardType: TextInputType.phone),
              const SizedBox(height: 20),
              _sectionLabel('Groom Details'),
              TextFormField(
                controller: _groomNameCtrl,
                decoration: const InputDecoration(labelText: 'Groom Name *'),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 8),
              TextFormField(controller: _groomEmailCtrl,
                  decoration: const InputDecoration(labelText: 'Groom Email'),
                  keyboardType: TextInputType.emailAddress),
              const SizedBox(height: 8),
              TextFormField(controller: _groomPhoneCtrl,
                  decoration: const InputDecoration(labelText: 'Groom Phone'),
                  keyboardType: TextInputType.phone),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _submit,
                  child: _loading
                      ? const SizedBox(width: 20, height: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Create Event'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: const TextStyle(
        fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF1E3A5F),
      )),
    );
  }
}
