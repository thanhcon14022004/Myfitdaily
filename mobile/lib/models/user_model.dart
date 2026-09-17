class UserProfile {
  final int id;
  final String email;
  final String fullName;
  final String? avatarUrl;
  final String? gender;
  final String role;
  final String subscriptionType;
  final double? height;
  final double? weight;
  final double? chest;
  final double? waist;
  final double? hips;
  final String? bodyShape;
  final int? age;
  final String? ageGroup;

  UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    this.avatarUrl,
    this.gender,
    required this.role,
    required this.subscriptionType,
    this.height,
    this.weight,
    this.chest,
    this.waist,
    this.hips,
    this.bodyShape,
    this.age,
    this.ageGroup,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? '',
      avatarUrl: json['avatarUrl'],
      gender: json['gender'],
      role: json['role'] ?? 'User',
      subscriptionType: json['subscriptionType'] ?? 'Free',
      height: (json['height'] as num?)?.toDouble(),
      weight: (json['weight'] as num?)?.toDouble(),
      chest: (json['chest'] as num?)?.toDouble(),
      waist: (json['waist'] as num?)?.toDouble(),
      hips: (json['hips'] as num?)?.toDouble(),
      bodyShape: json['bodyShape'],
      age: json['age'],
      ageGroup: json['ageGroup'],
    );
  }
}

class UpdateProfileRequest {
  final String fullName;
  final String? avatarUrl;
  final String? gender;
  final double? height;
  final double? weight;
  final double? chest;
  final double? waist;
  final double? hips;
  final String? bodyShape;
  final int? age;
  final String? ageGroup;

  UpdateProfileRequest({
    required this.fullName,
    this.avatarUrl,
    this.gender,
    this.height,
    this.weight,
    this.chest,
    this.waist,
    this.hips,
    this.bodyShape,
    this.age,
    this.ageGroup,
  });

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'avatarUrl': avatarUrl,
    'gender': gender,
    'height': height,
    'weight': weight,
    'chest': chest,
    'waist': waist,
    'hips': hips,
    'bodyShape': bodyShape,
    'age': age,
    'ageGroup': ageGroup,
  };
}
