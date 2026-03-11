class GalleryModel {
  final int eventId;
  final String title;
  final String brideName;
  final String groomName;
  final String weddingDate;
  final String status;
  final String? coverUrl;

  const GalleryModel({
    required this.eventId,
    required this.title,
    required this.brideName,
    required this.groomName,
    required this.weddingDate,
    required this.status,
    this.coverUrl,
  });

  factory GalleryModel.fromJson(Map<String, dynamic> json) => GalleryModel(
    eventId: json['eventId'] ?? 0,
    title: json['title'] ?? '',
    brideName: json['brideName'] ?? '',
    groomName: json['groomName'] ?? '',
    weddingDate: json['weddingDate'] ?? '',
    status: json['status'] ?? '',
    coverUrl: json['coverUrl'],
  );
}
