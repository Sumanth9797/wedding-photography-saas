import 'package:flutter/material.dart';
import '../models/event_model.dart';
import '../services/api_service.dart';

class EventProvider extends ChangeNotifier {
  List<EventModel> _events = [];
  bool _loading = false;
  String? _error;

  List<EventModel> get events => _events;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> loadEvents() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await ApiService.get('/events');
      _events = (res.data as List).map((e) => EventModel.fromJson(e)).toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<EventModel?> createEvent(Map<String, dynamic> data) async {
    try {
      final res = await ApiService.post('/events', data: data);
      final event = EventModel.fromJson(res.data);
      _events.insert(0, event);
      notifyListeners();
      return event;
    } catch (_) {
      return null;
    }
  }
}
