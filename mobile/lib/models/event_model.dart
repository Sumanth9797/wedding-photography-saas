class EventModel {
  final int id;
  final String title;
  final String weddingDate;
  final String brideName;
  final String? bridePhone;
  final String? brideEmail;
  final String groomName;
  final String? groomPhone;
  final String? groomEmail;
  final String galleryToken;
  final String? galleryUrl;
  final String? pinCode;
  final String status;
  final String? venue;
  final String? description;
  final int? photoCount;
  final int? selectionCount;

  const EventModel({
    required this.id,
    required this.title,
    required this.weddingDate,
    required this.brideName,
    this.bridePhone,
    this.brideEmail,
    required this.groomName,
    this.groomPhone,
    this.groomEmail,
    required this.galleryToken,
    this.galleryUrl,
    this.pinCode,
    required this.status,
    this.venue,
    this.description,
    this.photoCount,
    this.selectionCount,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) => EventModel(
    id: json['id'] ?? 0,
    title: json['title'] ?? '',
    weddingDate: json['weddingDate'] ?? '',
    brideName: json['brideName'] ?? '',
    bridePhone: json['bridePhone'],
    brideEmail: json['brideEmail'],
    groomName: json['groomName'] ?? '',
    groomPhone: json['groomPhone'],
    groomEmail: json['groomEmail'],
    galleryToken: json['galleryToken'] ?? '',
    galleryUrl: json['galleryUrl'],
    pinCode: json['pinCode'],
    status: json['status'] ?? 'DRAFT',
    venue: json['venue'],
    description: json['description'],
    photoCount: json['photoCount'],
    selectionCount: json['selectionCount'],
  );

  String get statusLabel {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'ACTIVE': return 'Active';
      case 'EDITING': return 'Editing';
      case 'REVIEW': return 'In Review';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  }
}
