import 'package:dio/dio.dart';
import '../config/app_config.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.apiUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  static void init() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = AppConfig.prefs.getString(AppConfig.tokenKey) ??
              AppConfig.prefs.getString(AppConfig.galleryTokenKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            AppConfig.prefs.remove(AppConfig.tokenKey);
            AppConfig.prefs.remove(AppConfig.userKey);
          }
          return handler.next(error);
        },
      ),
    );
  }

  static Future<Response> get(String path, {Map<String, dynamic>? params}) async {
    return await _dio.get(path, queryParameters: params);
  }

  static Future<Response> post(String path, {dynamic data}) async {
    return await _dio.post(path, data: data);
  }

  static Future<Response> put(String path, {dynamic data}) async {
    return await _dio.put(path, data: data);
  }

  static Future<Response> delete(String path) async {
    return await _dio.delete(path);
  }

  static Future<Response> uploadFile(String path, FormData formData,
      {ProgressCallback? onProgress}) async {
    return await _dio.post(
      path,
      data: formData,
      onSendProgress: onProgress,
    );
  }
}
