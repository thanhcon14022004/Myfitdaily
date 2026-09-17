class LoginRequest {
  final String email;
  final String password;

  LoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() => {
    'email': email,
    'password': password,
  };
}

class RegisterRequest {
  final String fullName;
  final String email;
  final String password;
  final String? gender;

  RegisterRequest({
    required this.fullName,
    required this.email,
    required this.password,
    this.gender,
  });

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'email': email,
    'password': password,
    'gender': gender ?? 'Unspecified',
  };
}

class AuthResponse {
  final String token;
  final String email;
  final String fullName;
  final String role;
  final String subscriptionType;

  AuthResponse({
    required this.token,
    required this.email,
    required this.fullName,
    required this.role,
    required this.subscriptionType,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    final data = json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;
    final user = data['user'] is Map<String, dynamic> ? data['user'] as Map<String, dynamic> : {};

    return AuthResponse(
      token: data['token'] ?? json['token'] ?? '',
      email: user['email'] ?? data['email'] ?? json['email'] ?? '',
      fullName: user['fullName'] ?? data['fullName'] ?? json['fullName'] ?? '',
      role: user['role'] ?? data['role'] ?? json['role'] ?? 'User',
      subscriptionType: user['subscriptionType'] ?? data['subscriptionType'] ?? json['subscriptionType'] ?? 'Free',
    );
  }
}
