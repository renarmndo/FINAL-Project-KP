function containsInjectionPatterns(input: string): boolean {
  // Pola SQL injection
  const sqlPatterns = [
    /(\b(select|insert|update|delete|from|drop|alter|truncate|declare|exec|union|create|where)\b)/i,
    /'(\s)*or(\s)*'1'(\s)*=(\s)*'1'/i,
    /'(\s)*or(\s)*1=1/i,
    /--/,
    /;/,
  ];

  // Pola XSS
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
    /on\w+(\s)*=/i,
    /<iframe/i,
    /javascript:/i,
    /eval\(/i,
    /document\./i,
  ];

  // Mengecek pola SQL injection
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      return true;
    }
  }

  // Mengecek pola XSS
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return true;
    }
  }

  return false;
}

export { containsInjectionPatterns };
