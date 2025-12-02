import { connect } from './db.js';

export async function getWishlist(userId) {
  const db = await connect();

  try {
const [rows] = await db.execute(
  `SELECT 
      f.favorite_id,
      f.user_id,
      f.product_id,
      p.product_id,
      p.product_name,
      p.price,
      p.image,
      p.description
    FROM favorites f
    INNER JOIN Product p ON f.product_id = p.product_id
    WHERE f.user_id = ?`,
  [userId]
);


    return rows; // renvoie tableau vide si aucun favori
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
}


export async function addToWishlist(userId, productId) {
    const db = await connect();
    try {
        const [result] = await db.execute(
            'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}
export async function removeFromWishlist(userId, productId) {
    const db = await connect();
    try {
        const [result] = await db.execute(
            'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return result.affectedRows > 0;
    }
    catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}
