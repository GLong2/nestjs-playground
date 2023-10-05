export function getSocialCode(provider: string): number {
  switch (provider) {
    case 'apple':
      return 1;
    case 'google':
      return 2;
    case 'facebook':
      return 3;
    case 'kakao':
      return 4;
    case 'naver':
      return 5;
    default:
      throw new Error('Invalid provider');
  }
}
