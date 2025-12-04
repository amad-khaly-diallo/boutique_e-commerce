import { connect } from "./db.js";

export async function getWishlist(userId) {
  let db;
  try {
    db = await connect();
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
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  } finally {
    if (db) await db.end();
  }
}

export async function toggleFavorite(userId, productId) {
  let db;
  try {
    db = await connect();
    const [rows] = await db.execute(
      "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId],
    );

    if (rows.length > 0) {
      await db.execute(
        "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
        [userId, productId],
      );
      return { favorite: false, message: "Removed from favorites" };
    }

    await db.execute(
      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
      [userId, productId],
    );

    return { favorite: true, message: "Added to favorites" };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  } finally {
    if (db) await db.end();
  }
}
