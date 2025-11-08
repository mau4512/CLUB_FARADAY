export function isAuthenticated() {
    return !!localStorage.getItem('token')
  }
  
  export function getUserRole() {
    try {
      const user = JSON.parse(localStorage.getItem('usuario'))
      return user?.rol || null
    } catch {
      return null
    }
  }
  