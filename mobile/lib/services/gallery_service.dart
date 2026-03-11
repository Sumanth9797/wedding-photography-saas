import 'api_service.dart';
import '../models/gallery_model.dart';
import '../models/photo_model.dart';

class GalleryService {
  static Future<GalleryModel> getGalleryInfo(String token) async {
    final res = await ApiService.get('/gallery/$token');
    return GalleryModel.fromJson(res.data);
  }

  static Future<List<PhotoModel>> getPhotos(String token) async {
    final res = await ApiService.get('/gallery/$token/photos');
    return (res.data as List).map((p) => PhotoModel.fromJson(p)).toList();
  }

  static Future<void> submitSelections(String token, List<Map<String, dynamic>> selections) async {
    await ApiService.post('/gallery/$token/selections', data: {'selections': selections});
  }

  static Future<void> submitReview(String token, Map<String, dynamic> review) async {
    await ApiService.put('/gallery/$token/review', data: review);
  }

  static Future<List<String>> getDownloadUrls(String token) async {
    final res = await ApiService.get('/gallery/$token/downloads');
    final data = res.data as Map<String, dynamic>;
    return (data['downloadUrls'] as List).cast<String>();
  }
}
