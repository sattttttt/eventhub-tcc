import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      nama: user.nama 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      nama: user.nama 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};