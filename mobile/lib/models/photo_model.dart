class PhotoModel {
  final int id;
  final String fileName;
  final String? previewUrl;
  final String? thumbnailUrl;
  final String status;
  final int? fileSize;
  final bool? isSelected;
  final bool? isAlbumPhoto;
  final String? clientComment;

  const PhotoModel({
    required this.id,
    required this.fileName,
    this.previewUrl,
    this.thumbnailUrl,
    required this.status,
    this.fileSize,
    this.isSelected,
    this.isAlbumPhoto,
    this.clientComment,
  });

  factory PhotoModel.fromJson(Map<String, dynamic> json) => PhotoModel(
    id: json['id'] ?? 0,
    fileName: json['fileName'] ?? '',
    previewUrl: json['previewUrl'],
    thumbnailUrl: json['thumbnailUrl'],
    status: json['status'] ?? 'PREVIEW',
    fileSize: json['fileSize'],
    isSelected: json['isSelected'],
    isAlbumPhoto: json['isAlbumPhoto'],
    clientComment: json['clientComment'],
  );

  String get displayUrl => thumbnailUrl ?? previewUrl ?? '';
}
