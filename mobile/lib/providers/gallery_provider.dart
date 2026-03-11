import 'package:flutter/material.dart';
import '../models/gallery_model.dart';
import '../models/photo_model.dart';
import '../services/gallery_service.dart';

class GalleryProvider extends ChangeNotifier {
  GalleryModel? _gallery;
  List<PhotoModel> _photos = [];
  Map<int, Map<String, dynamic>> _selections = {};
  bool _loading = false;

  GalleryModel? get gallery => _gallery;
  List<PhotoModel> get photos => _photos;
  Map<int, Map<String, dynamic>> get selections => _selections;
  bool get loading => _loading;
  int get selectedCount => _selections.values.where((s) => s['selected'] == true).length;

  Future<void> loadGallery(String token) async {
    _loading = true;
    notifyListeners();
    try {
      _gallery = await GalleryService.getGalleryInfo(token);
      _photos = await GalleryService.getPhotos(token);
    } catch (e) {
      rethrow;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void toggleSelection(int photoId) {
    final current = _selections[photoId] ?? {};
    _selections[photoId] = {
      ...current,
      'selected': !(current['selected'] ?? false),
    };
    notifyListeners();
  }

  void toggleAlbum(int photoId) {
    final current = _selections[photoId] ?? {};
    _selections[photoId] = {
      ...current,
      'isAlbumPhoto': !(current['isAlbumPhoto'] ?? false),
    };
    notifyListeners();
  }

  Future<void> submitSelections(String token) async {
    final selected = _selections.entries
        .where((e) => e.value['selected'] == true)
        .map((e) => {
              'photoId': e.key,
              'isAlbumPhoto': e.value['isAlbumPhoto'] ?? false,
              'comment': e.value['comment'] ?? '',
            })
        .toList();
    await GalleryService.submitSelections(token, selected);
  }
}
