// Models
class UserModel {
  final int id;
  final String name;
  final String? email;
  final String? phone;
  final String role;

  const UserModel({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['userId'] ?? json['id'] ?? 0,
    name: json['name'] ?? '',
    email: json['email'],
    phone: json['phone'],
    role: json['role'] ?? 'CLIENT',
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'name': name, 'email': email, 'phone': phone, 'role': role,
  };
}
