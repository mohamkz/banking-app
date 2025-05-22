
export interface JwtPayload {
    sub: string;         
    roles: string[];     
    iat: number;         
    exp: number;         
  }
  
  export const decodeJwt = (token: string): JwtPayload | null => {
    try {
      
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Format JWT invalide');
  
      // 2. Décodage Base64 de la partie payload
      const base64Payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
  
      
        const jsonPayload = decodeURIComponent(
            atob(base64Payload)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)) 
              .join('')
          );
  
      // 4. Vérification et parsing du payload
      const payload = JSON.parse(jsonPayload);
      if (!payload.sub || !payload.exp) throw new Error('Payload JWT incomplet');
  
      return payload as JwtPayload;
    } catch (error) {
      console.error('Erreur de décodage JWT:', error);
      return null;
    }
  };
  
  /**
   * Vérifie si un token JWT est expiré
   */
  export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJwt(token);
    if (!payload) return true;
  
    const now = Math.floor(Date.now() / 1000); 
    return payload.exp < now;
  };