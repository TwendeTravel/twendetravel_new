// const API_URL = 'https://twendetravel.infinityfreeapp.com/api';

// export interface UserRole {
//   user_id: string;
//   role: string;
//   created_at: string;
// }

// export const roleService = {
//   async getCurrentUserRole(): Promise<UserRole> {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/roles/current`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch user role');
//     }
    
//     return response.json();
//   },

//   async createUserRole(userId: string, role: string): Promise<UserRole> {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/roles`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ user_id: userId, role }),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to create user role');
//     }
    
//     return response.json();
//   },
// };